const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const JobApplication = {
  // Create a new job application
  create: async (application) => {
    const {
      student_id,
      job_id
    } = application;

    const id = uuidv4(); // Generate a new UUID

    const query = `
      INSERT INTO job_application
      (id, student_id, job_id) 
      VALUES (?, ?, ?)
    `;

    try {
      await pool.query(query, [id, student_id, job_id]);
      return { id, student_id, job_id };
    } catch (error) {
      console.error('Error creating job application:', error);
      throw new Error('Failed to create job application');
    }
  },

  // Get a job application by ID
  findById: async (id) => {
    const query = 'SELECT * FROM job_application WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  // Get all applications for a specific student
  findAllByStudent: async (student_id) => {
    const query = 'SELECT * FROM job_application WHERE student_id = ?';
    const [rows] = await pool.query(query, [student_id]);
    return rows;
  },

  // Get all applications for a specific job
  findAllByJob: async (job_id) => {
    const query = 'SELECT * FROM job_application WHERE job_id = ?';
    const [rows] = await pool.query(query, [job_id]);
    return rows;
  },

  // Update the status of a job application
  updateStatus: async (id, status) => {
    const query = 'UPDATE job_application SET status = ? WHERE id = ?';
    await pool.query(query, [status, id]);
    return { id, status };
  },

  // Delete a job application by ID
  delete: async (id) => {
    const query = 'DELETE FROM job_application WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = JobApplication;
