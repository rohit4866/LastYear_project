const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');

router.post('/job-applications', jobApplicationController.createJobApplication);
router.get('/job-applications/:id', jobApplicationController.getJobApplicationById);
router.get('/job-applications/student/:student_id', jobApplicationController.getApplicationsByStudent);
router.get('/job-applications/job/:job_id', jobApplicationController.getApplicationsByJob);
router.put('/job-applications/:id', jobApplicationController.updateJobApplicationStatus);
router.delete('/job-applications/:id', jobApplicationController.deleteJobApplication);

module.exports = router;
