const express = require('express');
const professorController = require('../controllers/professorController');
const multer = require('multer');
const path = require('path');

// Setup multer for profile image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/professor_profile/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// CRUD routes for professors
router.post('/professors/create', upload.single('profile_image'), professorController.createProfessor);
router.post('/professors/login', professorController.loginProfessor);
router.get('/professors/:id', professorController.getProfessorById);
router.put('/professors/:id', upload.single('profile_image'), professorController.updateProfessor);
router.delete('/professors/:id', professorController.deleteProfessor);

module.exports = router;
