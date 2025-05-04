const pool = require('../config/db');

// Get all classroom allocations
exports.getAllAllocations = async () => {
  const query = `SELECT * FROM classroom_allocation`;
  const [rows] = await pool.query(query);
  return rows;
};

// Get a classroom allocation by ID
exports.getAllocationById = async (id) => {
  const query = `SELECT * FROM classroom_allocation WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  return rows.length ? rows[0] : null;
};

// Get classroom allocations by professor ID
exports.getAllocationsByProfessorId = async (professorId) => {
    const query = `SELECT * FROM classroom_allocation WHERE professor_id = ?`;
    const [rows] = await pool.query(query, [professorId]);
    return rows;
  };

// Create a new classroom allocation
exports.createAllocation = async (allocationData) => {
  const { professor_id, classroom_name, status, classroom_description } = allocationData;
  const query = `
    INSERT INTO classroom_allocation
    (id, professor_id, classroom_name, status, classroom_description) 
    VALUES (UUID(), ?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [professor_id, classroom_name, status, classroom_description]);
  
  // Fetch the newly created allocation using the insertId
  const newAllocation = await this.getAllocationById(result.insertId);
  return newAllocation;
};

// Update a classroom allocation
exports.updateAllocation = async (id, allocationData) => {
    const { professor_id, classroom_name, status, classroom_description, student_id } = allocationData;
  
    let setClause = [];
    let values = [];
  
    // Build the set clause and values dynamically
    if (professor_id) {
      setClause.push('professor_id = ?');
      values.push(professor_id);
    }
    if (classroom_name) {
      setClause.push('classroom_name = ?');
      values.push(classroom_name);
    }
    if (status) {
      setClause.push('status = ?');
      values.push(status);
    }
    if (classroom_description) {
      setClause.push('classroom_description = ?');
      values.push(classroom_description);
    }
    if (student_id) {
      setClause.push('student_id = ?');
      values.push(student_id);
    }
  
    // Ensure at least one field is being updated
    if (setClause.length === 0) {
      return null;  // No fields to update
    }
  
    // Construct the SQL query
    const query = `
      UPDATE classroom_allocation
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = ?
    `;
    
    values.push(id); // Add the ID to the end of the values array
  
    // Execute the query
    const [result] = await pool.query(query, values);
  
    // Check if any rows were updated
    if (result.affectedRows === 0) {
      return null;  // No rows were updated (ID might not exist)
    }
  
    // Fetch and return the updated allocation
    const updatedAllocation = await this.getAllocationById(id);
    return updatedAllocation;
  };

// Helper function to get allocation by ID (assuming this exists)
exports.getAllocationById = async (id) => {
    const query = `SELECT * FROM classroom_allocation WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows.length ? rows[0] : null;
};

// Delete a classroom allocation
exports.deleteAllocation = async (id) => {
  const query = `DELETE FROM classroom_allocation WHERE id = ?`;
  const [result] = await pool.query(query, [id]);
  return result.affectedRows > 0;
};
