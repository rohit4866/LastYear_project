const SaveJob = require('../models/saveJobModel');

// Create a new saved job
exports.createSaveJob = async (req, res) => {
  try {
    const newSavedJob = await SaveJob.create(req.body);
    res.status(201).json(newSavedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error saving job', error });
  }
};

// Get a saved job by ID
exports.getSavedJobById = async (req, res) => {
  try {
    const savedJob = await SaveJob.findById(req.params.id);
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    res.status(200).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved job', error });
  }
};

// Get all saved jobs for a specific student
exports.getSavedJobsByStudent = async (req, res) => {
  try {
    const savedJobs = await SaveJob.findAllByStudent(req.params.student_id);
    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved jobs for student', error });
  }
};

// Delete a saved job
exports.deleteSavedJob = async (req, res) => {
  try {
    const savedJob = await SaveJob.findById(req.params.id);
    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    await SaveJob.delete(req.params.id);
    res.status(200).json({ message: 'Saved job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting saved job', error });
  }
};
