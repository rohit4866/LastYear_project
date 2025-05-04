const pool = require('../config/db'); // Make sure the path is correct
const { v4: uuidv4 } = require('uuid');

const Classroom = {
  create: async (classroom) => {
    const { professor_id, classroom_name, description, classroom_code } = classroom;
    const id = require('uuid').v4();
    const query = 'INSERT INTO classrooms (id, professor_id, classroom_name, description, classroom_code) VALUES (?, ?, ?, ?, ?)';
    await pool.query(query, [id, professor_id, classroom_name, description, classroom_code]);
    return { id, professor_id, classroom_name, description, classroom_code };
  },

  findAllByProfessor: async (professor_id) => {
    const query = 'SELECT * FROM classrooms WHERE professor_id = ?';
    const [rows] = await pool.query(query, [professor_id]);
    return rows;
  },

  findById: async (id) => {
    const query = 'SELECT * FROM classrooms WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  update: async (id, classroom) => {
    const { classroom_name, description } = classroom;
  
    // Update query without classroom_code
    const query = 'UPDATE classrooms SET classroom_name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await pool.query(query, [classroom_name, description, id]);
  
    // Return the updated classroom data
    return { id, classroom_name, description }; // Exclude classroom_code
  },  

  delete: async (id) => {
    const query = 'DELETE FROM classrooms WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result; // Return the result of the deletion
  },

  createFile: async (file) => {
    const { classroom_id, title, file_name } = file;
    const id = uuidv4();
    const query = 'INSERT INTO classroom_files (id, classroom_id, title, file_name) VALUES (?, ?, ?, ?)';
    await pool.query(query, [id, classroom_id, title, file_name]);
    return { id, classroom_id, title, file_name };
  },

  findFileById: async (id) => {
    const query = 'SELECT * FROM classroom_files WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0]; // Return the first row, or undefined if not found
  },

  findFilesByClassroomId: async (classroom_id) => {
    const query = 'SELECT * FROM classroom_files WHERE classroom_id = ?';
    const [rows] = await pool.query(query, [classroom_id]);
    return rows;
  },  

  deleteFileById: async (id) => {
    const query = 'DELETE FROM classroom_files WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result; // Return the result of the deletion
  },

  // Method to join a classroom using the classroom code
  joinClassroom: async (student_id, classroom_code) => {
    // Step 1: Get the classroom_id based on the classroom_code
    const query = 'SELECT id FROM classrooms WHERE classroom_code = ?';
    const [classroom] = await pool.query(query, [classroom_code]);

    if (classroom.length === 0) {
      throw new Error('Invalid classroom code'); // No classroom found
    }

    // Step 2: Get the classroom_id
    const classroom_id = classroom[0].id;

    // Step 3: Check if the student is already part of the classroom
    const checkQuery = 'SELECT * FROM classroom_students WHERE student_id = ? AND classroom_id = ?';
    const [existing] = await pool.query(checkQuery, [student_id, classroom_id]);

    if (existing.length > 0) {
      throw new Error('Student is already in this classroom');
    }

    // Step 4: Insert the student into the classroom
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();  // Generate a new UUID for the student entry
    const insertQuery = 'INSERT INTO classroom_students (id, student_id, classroom_id) VALUES (?, ?, ?)';
    await pool.query(insertQuery, [id, student_id, classroom_id]);

    return classroom_id; // Return the classroom_id that the student has joined
  },

  isStudentInClassroom: async (classroom_id, student_id) => {
      const query = 'SELECT * FROM classroom_students WHERE classroom_id = ? AND student_id = ?';
      const [rows] = await pool.query(query, [classroom_id, student_id]);
      return rows.length > 0;
  },

  // Find classrooms a student is part of
  findClassroomsByStudent: async (student_id) => {
    const query = 'SELECT c.* FROM classrooms c JOIN classroom_students cs ON c.id = cs.classroom_id WHERE cs.student_id = ?';
    const [rows] = await pool.query(query, [student_id]);
    return rows; 
  },

  // Find students in a classroom
  findStudentsInClassroom: async (classroom_id) => {
    const query = 'SELECT s.* FROM students s JOIN classroom_students cs ON s.id = cs.student_id WHERE cs.classroom_id = ?';
    const [rows] = await pool.query(query, [classroom_id]);
    return rows;
  },

};

module.exports = Classroom;
