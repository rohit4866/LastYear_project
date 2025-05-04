import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Modal, Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Divider } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import BASE_URL from '../../config';

const ClassAllocation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [classroomId, setClassroomId] = useState(null);
  const [classroomName, setClassroomName] = useState('');
  const [status, setStatus] = useState('open');
  const [classroomDescription, setClassroomDescription] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchAllocations = async () => {
    try {
      const professorId = localStorage.getItem('professor_id');
      const response = await axios.get(`${BASE_URL}/classroom_allocations/professor/${professorId}`);
      setAllocations(response.data);
    } catch (error) {
      console.error('Error fetching allocations:', error);
      setSnackbarSeverity('error');
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setClassroomName('');
    setStatus('open');
    setClassroomDescription('');
    setEditMode(false);
    setClassroomId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const handleSaveClassroom = async () => {
    const professorId = localStorage.getItem('professor_id');

    // Validation
    if (!classroomName.trim()) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Classroom name is mandatory.');
      setSnackbarOpen(true);
      return;
    }
    if (!classroomDescription.trim()) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Classroom description is mandatory.');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${BASE_URL}/classroom_allocations/${classroomId}`, {
          professor_id: professorId,
          classroom_name: classroomName,
          status,
          classroom_description: classroomDescription,
        });
        setSnackbarSeverity('success');
        setSnackbarMessage('Classroom updated successfully!');
      } else {
        await axios.post(`${BASE_URL}/classroom_allocations`, {
          professor_id: professorId,
          classroom_name: classroomName,
          status,
          classroom_description: classroomDescription,
        });
        setSnackbarSeverity('success');
        setSnackbarMessage('Classroom added successfully!');
      }
      fetchAllocations();
      handleCloseModal();
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving classroom:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to save classroom.');
      setSnackbarOpen(true);
    }
  };

  const handleEditClassroom = (allocation) => {
    setClassroomId(allocation.id);
    setClassroomName(allocation.classroom_name);
    setStatus(allocation.status);
    setClassroomDescription(allocation.classroom_description);
    setEditMode(true);
    handleOpenModal();
  };

  const handleOpenDeleteModal = (allocation) => {
    setClassroomId(allocation.id);
    setClassroomName(allocation.classroom_name);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setClassroomId(null);
    setClassroomName('');
  };

  const handleDeleteClassroom = async () => {
    try {
      await axios.delete(`${BASE_URL}/classroom_allocations/${classroomId}`);
      setSnackbarSeverity('success');
      setSnackbarMessage('Classroom deleted successfully!');
      fetchAllocations();
      handleCloseDeleteModal();
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting classroom:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to delete classroom.');
      setSnackbarOpen(true);
      handleCloseDeleteModal();
    }
  };

  const filteredAllocations = allocations.filter(allocation => 
    allocation.classroom_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Breadcrumb pageName="Class Allocation" />

      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Allocation</h2>
          <button
            className="bg-[#365E7D] text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={handleOpenModal}
          >
            Add Classroom
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search classroom..."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 pl-10 pr-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div>
          {filteredAllocations.length === 0 ? (
            <p className="text-center text-gray-500 my-5">No classroom allocations found.</p>
          ) : (
            filteredAllocations.map(allocation => (
              <>
                <div key={allocation.id} className="flex justify-between p-4">
                  <div>
                    <h3 className="text-lg font-semibold">{allocation.classroom_name}</h3>
                    <p>{allocation.classroom_description}</p>
                    <p>Status: {allocation.status}</p>
                  </div>
                  <div>
                    <Button onClick={() => handleEditClassroom(allocation)} color="primary">Edit</Button>
                    <Button onClick={() => handleOpenDeleteModal(allocation)} color="secondary">Delete</Button>
                  </div>
                </div>
                
                <Divider className='dark:bg-[#ccc]' />
              </>
            ))
          )}
        </div>
      </div>

      {/* Modal for Adding/Editing Classroom */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}>
          <Box sx={{
            width: '100%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Classroom' : 'Add Classroom'}</h2>

            <TextField
              label="Classroom Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="close">Close</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Classroom Description"
              fullWidth
              variant="outlined"
              margin="normal"
              value={classroomDescription}
              onChange={(e) => setClassroomDescription(e.target.value)}
              required
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handleCloseModal} variant="outlined" sx={{ marginRight: 2 }}>
                Cancel
              </Button>
              <Button onClick={handleSaveClassroom} variant="contained" color="primary">
                {editMode ? 'Update' : 'Add'}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}>
          <Box sx={{
            width: '100%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <h2 className="text-lg font-semibold">Are you sure?</h2>
            <p className="mt-2">Are you sure you want to delete the classroom "{classroomName}"?</p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCloseDeleteModal} variant="outlined" sx={{ marginRight: 2 }}>Cancel</Button>
              <Button onClick={handleDeleteClassroom} variant="contained" color="primary">Delete</Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClassAllocation;
