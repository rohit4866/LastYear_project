const studentModel = require('../models/studentModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Helper function to append full URL for images
const getFullUrl = (req, filePath) => {
  const fullUrl = `${req.protocol}://${req.get('host')}`;
  return filePath ? `${fullUrl}${filePath}` : null;
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save profile image path
    const profile_image = req.file ? `/uploads/student_profile/${req.file.filename}` : null;

    const newStudent = {
      id: uuidv4(),
      name,
      email,
      mobile,
      password: hashedPassword,
      profile_image
    };

    await studentModel.create(newStudent);
    
    // Prepare response (exclude password and add full URL for profile image)
    const responseStudent = {
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      mobile: newStudent.mobile,
      profile_image: getFullUrl(req, newStudent.profile_image)
    };

    res.status(201).json({ message: 'Student created successfully', data: responseStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.findAll();
    
    // Format response (exclude password and add full URL for profile image)
    const responseStudents = students.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      profile_image: getFullUrl(req, student.profile_image)
    }));

    res.status(200).json(responseStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Prepare response (exclude password and add full URL for profile image)
    const responseStudent = {
      id: student.id,
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      profile_image: getFullUrl(req, student.profile_image)
    };

    res.status(200).json(responseStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const student = await studentModel.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updatedData = {
      name: name || student.name,
      email: email || student.email,
      mobile: mobile || student.mobile,
      password: password ? await bcrypt.hash(password, 10) : student.password,
    };

    // Update profile image if uploaded
    if (req.file) {
      if (student.profile_image) {
        fs.unlinkSync(path.join(__dirname, '..', student.profile_image)); // Remove old image
      }
      updatedData.profile_image = `/uploads/student_profile/${req.file.filename}`;
    }

    await studentModel.update(req.params.id, updatedData);

    // Prepare response (exclude password and add full URL for profile image)
    const responseStudent = {
      id: req.params.id,
      name: updatedData.name,
      email: updatedData.email,
      mobile: updatedData.mobile,
      profile_image: getFullUrl(req, updatedData.profile_image || student.profile_image)
    };

    res.status(200).json({ message: 'Student updated successfully', data: responseStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove profile image
    if (student.profile_image) {
      fs.unlinkSync(path.join(__dirname, '..', student.profile_image));
    }

    await studentModel.delete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await studentModel.findByEmail(email);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the provided password matches the hashed password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Prepare response (exclude password and add full URL for profile image)
    const responseStudent = {
      id: student.id,
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      profile_image: getFullUrl(req, student.profile_image)
    };

    res.status(200).json({ message: 'Login successful', data: responseStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
