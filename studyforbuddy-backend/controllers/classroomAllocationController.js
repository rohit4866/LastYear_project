const classroomAllocationModel = require('../models/classroomAllocationModel');

// Get all classroom allocations
exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await classroomAllocationModel.getAllAllocations();
    res.status(200).json(allocations);
  } catch (error) {
    console.error('Error fetching allocations:', error);
    res.status(500).json({ error: 'Failed to fetch classroom allocations' });
  }
};

// Get classroom allocation by ID
exports.getAllocationById = async (req, res) => {
  try {
    const allocation = await classroomAllocationModel.getAllocationById(req.params.id);
    if (!allocation) {
      return res.status(404).json({ message: 'Classroom allocation not found' });
    }
    res.status(200).json(allocation);
  } catch (error) {
    console.error('Error fetching allocation:', error);
    res.status(500).json({ error: 'Failed to fetch classroom allocation' });
  }
};

// Get classroom allocations by professor ID
exports.getAllocationsByProfessorId = async (req, res) => {
    try {
      const allocations = await classroomAllocationModel.getAllocationsByProfessorId(req.params.professor_id);
      if (!allocations.length) {
        return res.status(404).json({ message: 'No classroom allocations found for this professor' });
      }
      res.status(200).json(allocations);
    } catch (error) {
      console.error('Error fetching allocations by professor ID:', error);
      res.status(500).json({ error: 'Failed to fetch classroom allocations' });
    }
  };  

// Create a new classroom allocation
exports.createAllocation = async (req, res) => {
    try {
      const { professor_id, classroom_name, status, classroom_description } = req.body;
  
      // Validate input data
      if (!professor_id || !classroom_name || !status || !classroom_description) {
        return res.status(400).json({ error: 'All fields except student_id are required' });
      }
  
      const allocationData = { professor_id, classroom_name, status, classroom_description };
      const newAllocation = await classroomAllocationModel.createAllocation(allocationData);
  
      // Return the newly created allocation including its ID
      res.status(201).json({ message: 'Classroom allocation created', allocation: newAllocation });
    } catch (error) {
      console.error('Error creating allocation:', error);
      res.status(500).json({ error: 'Failed to create classroom allocation' });
    }
};

// Update a classroom allocation
exports.updateAllocation = async (req, res) => {
    try {
      const allocationData = req.body; // Get data from request body
  
      const updatedAllocation = await classroomAllocationModel.updateAllocation(req.params.id, allocationData);
  
      if (!updatedAllocation) {
        return res.status(404).json({ message: 'Classroom allocation not found' });
      }
  
      res.status(200).json({ message: 'Classroom allocation updated', allocation: updatedAllocation });
    } catch (error) {
      console.error('Error updating allocation:', error);
      res.status(500).json({ error: 'Failed to update classroom allocation' });
    }
};

// Delete a classroom allocation
exports.deleteAllocation = async (req, res) => {
    try {
      const deleted = await classroomAllocationModel.deleteAllocation(req.params.id);
  
      if (!deleted) {
        return res.status(404).json({ message: 'Classroom allocation not found' });
      }
  
      res.status(200).json({ message: 'Classroom allocation deleted successfully' });
    } catch (error) {
      console.error('Error deleting allocation:', error);
      res.status(500).json({ error: 'Failed to delete classroom allocation' });
    }
  };  