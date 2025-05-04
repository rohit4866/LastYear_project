const express = require('express');
const studentController = require('../controllers/studentController');
const multer = require('multer');
const router = express.Router();

// Set up Multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/student_profile/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routes
router.post('/students', upload.single('profile_image'), studentController.createStudent);
router.get('/students', studentController.getAllStudents);
router.get('/students/:id', studentController.getStudentById);
router.put('/students/:id', upload.single('profile_image'), studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);
router.post('/students/login', studentController.loginStudent);

module.exports = router;
