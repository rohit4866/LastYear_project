// routes/classrooms.js
const express = require('express');
const classroomsController = require('../controllers/classroomsController');
const multer = require('multer');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/classroom_files/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage: storage });

// Route to create a new classroom
router.post('/classrooms', classroomsController.create);

// Route to get classrooms by professor_id
router.get('/classrooms/professor/:professor_id', classroomsController.getAllByProfessor);

// Route to get a classroom by ID
router.get('/classrooms/:id', classroomsController.getById);

// Route to update a classroom by ID
router.put('/classrooms/:id', classroomsController.update);

// Route to delete a classroom by ID
router.delete('/classrooms/:id', classroomsController.delete);

// Route to upload multiple files to a classroom
router.post('/classrooms/files', upload.any(), classroomsController.addFile);

// Route to delete a file by ID
router.delete('/classrooms/files/:id', classroomsController.deleteFile);

// Route to get classroom files by classroom_id
router.get('/classrooms/files/:classroom_id', classroomsController.getFilesByClassroomId); 


// Route to join a classroom using classroom code
router.post('/classrooms/join', classroomsController.joinClassroom);

// Route to get classrooms a student has joined
router.get('/students/:student_id/classrooms', classroomsController.getClassroomsByStudent);

// Route to get students in a classroom
router.get('/classrooms/:classroom_id/students', classroomsController.getStudentsInClassroom);


module.exports = router;
