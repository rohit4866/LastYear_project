const Job = require('../models/jobModel');

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching job', error });
    }
};   

// Get jobs by professor ID
exports.getJobsByProfessorId = async (req, res) => {
  try {
    const professor_id = req.params.professor_id;
    
    // Call the raw SQL function directly without the 'where' clause
    const jobs = await Job.findAllByProfessor(professor_id);
    
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found for this professor' });
    }
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs for professor:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching jobs for professor', error });
  }
};

// Create new job
exports.createJob = async (req, res) => {
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      const updatedJob = await Job.update(req.params.id, req.body);
      res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    } catch (error) {
      res.status(500).json({ message: 'Error updating job', error });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      await Job.delete(req.params.id);
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting job', error });
    }
};