const express = require('express');
const router = express.Router();
const classroomAllocationController = require('../controllers/classroomAllocationController');

// Get all classroom allocations
router.get('/classroom_allocations', classroomAllocationController.getAllAllocations);

// Get classroom allocation by ID
router.get('/classroom_allocations/:id', classroomAllocationController.getAllocationById);

// Get classroom allocations by professor ID
router.get('/classroom_allocations/professor/:professor_id', classroomAllocationController.getAllocationsByProfessorId);

// Create new classroom allocation
router.post('/classroom_allocations', classroomAllocationController.createAllocation);

// Update classroom allocation
router.put('/classroom_allocations/:id', classroomAllocationController.updateAllocation);

// Delete classroom allocation
router.delete('/classroom_allocations/:id', classroomAllocationController.deleteAllocation);

module.exports = router;
