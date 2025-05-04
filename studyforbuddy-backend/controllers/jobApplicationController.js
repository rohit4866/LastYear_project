const JobApplication = require('../models/jobApplicationModel');

// Create a new job application
exports.createJobApplication = async (req, res) => {
  try {
    const newApplication = await JobApplication.create(req.body);
    res.status(201).json({ 
      message: 'Application submitted successfully!', 
      application: newApplication 
    });
  } catch (error) {
    console.error('Error creating job application:', error);
    res.status(500).json({ message: 'Error creating job application', error });
  }
};

// Get a job application by ID
exports.getJobApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job application', error });
  }
};

// Get all job applications for a specific student
exports.getApplicationsByStudent = async (req, res) => {
  try {
    const applications = await JobApplication.findAllByStudent(req.params.student_id);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications for student', error });
  }
};

// Get all job applications for a specific job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await JobApplication.findAllByJob(req.params.job_id);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications for job', error });
  }
};

// Update job application status
exports.updateJobApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedApplication = await JobApplication.updateStatus(req.params.id, status);
    res.status(200).json({ message: 'Job application status updated', application: updatedApplication });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job application status', error });
  }
};

// Delete a job application
exports.deleteJobApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    await JobApplication.delete(req.params.id);
    res.status(200).json({ message: 'Job application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job application', error });
  }
};
