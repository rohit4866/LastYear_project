const pool = require('../config/db'); // Make sure the path is correct
const { v4: uuidv4 } = require('uuid'); 

const Job = {
  // Create a new job
  create: async (job) => {
    const {
      professor_id,
      job_title,
      company_name,
      total_vacancies,
      experience_range,
      job_type,
      company_criteria,
      requirements,
      passout_batch,
      job_description,
      is_remote,
      preferred_skills,
      salary_range,
      job_location,
      application_deadline
    } = job;

    const id = uuidv4(); // Generate a new UUID

    const query = `
      INSERT INTO jobs 
      (id, professor_id, job_title, company_name, total_vacancies, experience_range, job_type, company_criteria, requirements, passout_batch, job_description, is_remote, preferred_skills, salary_range, job_location, application_deadline) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      // Execute the query
      await pool.query(query, [
        id, // Pass the generated UUID here
        professor_id,
        job_title,
        company_name,
        total_vacancies,
        experience_range,
        job_type,
        company_criteria,
        requirements,
        passout_batch,
        job_description,
        is_remote,
        preferred_skills,
        salary_range,
        job_location,
        application_deadline
      ]);

      // Construct the response object
      return {
        id, // Return the generated UUID
        professor_id,
        job_title,
        company_name,
        total_vacancies,
        experience_range,
        job_type,
        company_criteria,
        requirements,
        passout_batch,
        job_description,
        is_remote,
        preferred_skills,
        salary_range,
        job_location,
        application_deadline
      };
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  },

  // Get all jobs
  findAll: async () => {
    const query = 'SELECT * FROM jobs';
    const [rows] = await pool.query(query);
    return rows;
  },

  // Get a job by ID
  findById: async (id) => {
    const query = 'SELECT * FROM jobs WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  // Get jobs by professor ID
  findAllByProfessor: async (professor_id) => {
    const query = 'SELECT * FROM jobs WHERE professor_id = ?';
    const [rows] = await pool.query(query, [professor_id]);
    return rows;
  },

  // Update a job
  update: async (id, job) => {
    const {
      job_title,
      company_name,
      total_vacancies,
      experience_range,
      job_type,
      company_criteria,
      requirements,
      passout_batch,
      job_description,
      is_remote,
      preferred_skills,
      salary_range,
      job_location,
      application_deadline
    } = job;

    const query = `
        UPDATE jobs 
        SET job_title = ?, company_name = ?, total_vacancies = ?, experience_range = ?, job_type = ?, company_criteria = ?, requirements = ?, passout_batch = ?, job_description = ?, is_remote = ?, preferred_skills = ?, salary_range = ?, job_location = ?, application_deadline = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `;

    await pool.query(query, [
      job_title, company_name, total_vacancies, experience_range, job_type, company_criteria, requirements, passout_batch, job_description, is_remote, preferred_skills, salary_range, job_location, application_deadline, id
    ]);

    return {
      id, job_title, company_name, total_vacancies, experience_range, job_type, company_criteria, requirements, passout_batch, job_description, is_remote, preferred_skills, salary_range, job_location, application_deadline
    };
  },

  // Delete a job
  delete: async (id) => {
    const query = 'DELETE FROM jobs WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = Job;
