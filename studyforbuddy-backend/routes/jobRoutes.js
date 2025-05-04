const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/jobs', jobController.getAllJobs);
router.post('/jobs', jobController.createJob);
router.get('/jobs/:id', jobController.getJobById);
router.get('/jobs/professor/:professor_id', jobController.getJobsByProfessorId); // New route
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);

module.exports = router;
