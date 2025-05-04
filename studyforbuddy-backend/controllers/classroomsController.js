const Classroom = require('../models/classroomModel');
const path = require('path');
const fs = require('fs');

// Helper function to get full URL for files
const getFullFileUrl = (req, filePath) => {
  const fullUrl = `${req.protocol}://${req.get('host')}/`;
  return filePath ? `${fullUrl}${filePath}` : null;
};

const classroomsController = {
  create: async (req, res) => {
    try {
      const { professor_id, classroom_name, description, classroom_code } = req.body;

      if (!professor_id || !classroom_name || !classroom_code) {
        return res.status(400).json({ error: 'professor_id, classroom_name, and classroom_code are required' });
      }

      const classroom = await Classroom.create({ professor_id, classroom_name, description, classroom_code });
      res.status(201).json(classroom);
    } catch (error) {
      console.error('Error creating classroom:', error);
      res.status(500).json({ error: 'Failed to create classroom' });
    }
  },

  getAllByProfessor: async (req, res) => {
    const { professor_id } = req.params;
    try {
      const classrooms = await Classroom.findAllByProfessor(professor_id);
      res.status(200).json(classrooms);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      res.status(500).json({ error: 'Failed to fetch classrooms' });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      res.status(200).json(classroom);
    } catch (error) {
      console.error('Error fetching classroom:', error);
      res.status(500).json({ error: 'Failed to fetch classroom' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { classroom_name, description } = req.body;
  
    try {
      const classroom = await Classroom.update(id, { classroom_name, description });
      res.status(200).json(classroom);
    } catch (error) {
      console.error('Error updating classroom:', error);
      res.status(500).json({ error: 'Failed to update classroom' });
    }
  },
  

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Classroom.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (error) {
      console.error('Error deleting classroom:', error);
      res.status(500).json({ error: 'Failed to delete classroom' });
    }
  },

  addFile: async (req, res) => {
    try {
      const { classroom_id, title } = req.body;
      const files = req.files; // Get multiple files from multer

      if (!classroom_id || !title || !files || files.length === 0) {
        return res.status(400).json({ error: 'classroom_id, title, and files are required' });
      }

      // Save each uploaded file to the database
      const uploadedFiles = await Promise.all(
        files.map(file => Classroom.createFile({ classroom_id, title, file_name: file.path }))
      );

      res.status(201).json(uploadedFiles);
    } catch (error) {
      console.error('Error adding files:', error);
      res.status(500).json({ error: 'Failed to add files' });
    }
  },

  getFilesByClassroomId: async (req, res) => {
    const { classroom_id } = req.params;
    try {
      const files = await Classroom.findFilesByClassroomId(classroom_id);
      const responseFiles = files.map(file => ({
        fileId: file.id,
        url: getFullFileUrl(req, file.file_name), // Generate the full URL for each file
        title: file.title // Assuming the field for file title is named 'title'
      }));
      res.status(200).json(responseFiles);
    } catch (error) {
      console.error('Error fetching classroom files:', error);
      res.status(500).json({ error: 'Failed to fetch classroom files' });
    }
  },  

  deleteFile: async (req, res) => {
    const { id } = req.params; // File ID from the request URL

    try {
      // Find the file record in the database
      const fileRecord = await Classroom.findFileById(id);
      if (!fileRecord) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Delete the file from the filesystem if it exists
      const filePath = path.join(__dirname, '..', fileRecord.file_name); // Adjust the path if necessary
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }

      // Delete the file record from the database
      const result = await Classroom.deleteFileById(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'File record not found' });
      }

      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  },

  // Join a classroom using classroom code
  joinClassroom: async (req, res) => {
    const { student_id, classroom_code } = req.body; // We expect the classroom_code in the request body

    try {
      // Try to join the classroom using the model method
      const classroom_id = await Classroom.joinClassroom(student_id, classroom_code);

      // Return success response
      res.status(200).json({ message: 'Successfully joined the classroom', classroom_id });
    } catch (error) {
      console.error('Error joining classroom:', error.message);
      res.status(400).json({ error: error.message }); // Send error message
    }
  },
  
  // Fetch classrooms a student has joined
  getClassroomsByStudent: async (req, res) => {
    const { student_id } = req.params;
    try {
      // Fetch the classrooms by student_id using the model
      const classrooms = await Classroom.findClassroomsByStudent(student_id);
      
      if (classrooms.length === 0) {
        return res.status(404).json({ error: 'No classrooms found for this student' });
      }
      
      // Map the result to include only relevant classroom details (or expand as needed)
      const result = classrooms.map(classroom => ({
        classroom_id: classroom.id,
        classroom_name: classroom.name, // Include additional fields as needed
        classroom_code: classroom.classroom_code // Example additional field
      }));
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching classrooms for student:', error);
      res.status(500).json({ error: 'Failed to fetch classrooms' });
    }
  },

  // Fetch students in a classroom
  getStudentsInClassroom: async (req, res) => {
    const { classroom_id } = req.params;
    try {
      // Fetch the students by classroom_id using the model
      const students = await Classroom.findStudentsInClassroom(classroom_id);
      
      if (students.length === 0) {
        return res.status(404).json({ error: 'No students found in this classroom' });
      }
      
      // Map the result to include student details along with count
      const result = {
        student_count: students.length,
        students: students.map(student => ({
          student_id: student.id,
          student_name: student.name, // Include additional fields as needed
          student_email: student.email // Example additional field
        }))
      };
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching students in classroom:', error);
      res.status(500).json({ error: 'Failed to fetch students in classroom' });
    }
  },
};

module.exports = classroomsController;
