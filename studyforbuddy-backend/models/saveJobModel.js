const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const SaveJob = {
  // Create a new saved job
  create: async (saveJobData) => {
    const {
      student_id,
      job_id
    } = saveJobData;

    const id = uuidv4(); // Generate a new UUID

    const query = `
      INSERT INTO save_job
      (id, student_id, job_id)
      VALUES (?, ?, ?)
    `;

    try {
      await pool.query(query, [id, student_id, job_id]);
      return { id, student_id, job_id };
    } catch (error) {
      console.error('Error saving job:', error);
      throw new Error('Failed to save job');
    }
  },

  // Get a saved job by ID
  findById: async (id) => {
    const query = 'SELECT * FROM save_job WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  // Get all saved jobs for a specific student
  findAllByStudent: async (student_id) => {
    const query = 'SELECT * FROM save_job WHERE student_id = ?';
    const [rows] = await pool.query(query, [student_id]);
    return rows;
  },

  // Delete a saved job by ID
  delete: async (id) => {
    const query = 'DELETE FROM save_job WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = SaveJob;
