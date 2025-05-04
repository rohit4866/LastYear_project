const express = require('express');
const router = express.Router();
const saveJobController = require('../controllers/saveJobController');

router.post('/save-jobs', saveJobController.createSaveJob);
router.get('/save-jobs/:id', saveJobController.getSavedJobById);
router.get('/save-jobs/student/:student_id', saveJobController.getSavedJobsByStudent);
router.delete('/save-jobs/:id', saveJobController.deleteSavedJob);

module.exports = router;
