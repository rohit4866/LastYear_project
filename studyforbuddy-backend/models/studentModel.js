const pool = require('../config/db');

// Create a new student
exports.create = async (student) => {
  const query = `
    INSERT INTO students (id, name, email, mobile, password, profile_image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const { id, name, email, mobile, password, profile_image } = student;
  await pool.query(query, [id, name, email, mobile, password, profile_image]);
};

// Find all students
exports.findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM students');
  return rows;
};

// Find student by ID
exports.findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
  return rows[0];
};

// Update a student
exports.update = async (id, updatedData) => {
  const query = `
    UPDATE students SET name = ?, email = ?, mobile = ?, password = ?, profile_image = ?
    WHERE id = ?
  `;
  const { name, email, mobile, password, profile_image } = updatedData;
  await pool.query(query, [name, email, mobile, password, profile_image, id]);
};

// Delete a student
exports.delete = async (id) => {
  await pool.query('DELETE FROM students WHERE id = ?', [id]);
};

// Find student by email
exports.findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
  return rows[0];
};
