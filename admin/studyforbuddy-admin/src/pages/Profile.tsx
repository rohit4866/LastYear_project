import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL from '../config';
import { FiSettings } from "react-icons/fi";
import { FaUserEdit, FaPlus } from "react-icons/fa";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { Button, Modal, TextField, Box, Snackbar, Alert } from '@mui/material';

const Profile = () => {
  const [professor, setProfessor] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profile_image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const placeholderImage = 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png';

  const fetchProfessorData = async () => {
    const professorId = localStorage.getItem('professor_id');
    if (!professorId) {
      console.error('No professor ID found in localStorage');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/professors/${professorId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProfessor(data);
      setFormData(data); // Initialize form data
      setImagePreview(data.profile_image || placeholderImage); // Set image preview
    } catch (error) {
      console.error('Error fetching professor data:', error);
    }
  };

  useEffect(() => {
    fetchProfessorData();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setImagePreview(formData.profile_image || placeholderImage); // Reset preview when modal opens
  };
  
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview to the uploaded image
        setFormData({ ...formData, profile_image: file }); // Update form data with image file
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const professorId = localStorage.getItem('professor_id');
    const data = new FormData();
    
    // Append fields to FormData
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('mobile', formData.mobile);
    if (formData.profile_image) {
      data.append('profile_image', formData.profile_image); // Append image file
    }

    try {
      const response = await fetch(`${BASE_URL}/professors/${professorId}`, {
        method: 'PUT',
        body: data, // Send FormData
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Fetch updated data after successful update
      await fetchProfessorData();
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error('Error updating professor data:', error);
      setSnackbarMessage('Error updating profile. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!professor) {
    return <div>Loading...</div>;
  }

  // Helper function to format date
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    
    // Format hours and minutes
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? String(hours).padStart(2, '0') : '12'; // The hour '0' should be '12'
  
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };
  

  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between mb-8 items-center">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{professor.name}</h3>
        </div>

        <div className="flex flex-col md:flex-row md:items-center mb-8">
          <div className="flex justify-center md:w-1/3">
            <img
              src={professor.profile_image || placeholderImage}
              alt="Profile"
              className="h-40 w-40 rounded-full object-cover"
            />
          </div>

          <div className="md:w-2/3 md:ml-8 mt-6 md:mt-0">
            <div className="border-[1.5px] border-stroke dark:border-strokedark p-6 rounded-lg dark:bg-[#1D2A39]">
              <h4 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Profile Information</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Email:</span>
                  <span>{professor.email}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Phone:</span>
                  <span>{professor.mobile}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Created At:</span>
                  <span>{formatDateTime(professor.created_at)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Updated At:</span>
                  <span>{formatDateTime(professor.updated_at)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <Link to="/setting" className="flex items-center bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300">
                <FiSettings size={20} className="mr-2" /> Setting
              </Link>
              <button
                onClick={handleOpen}
                className="flex items-center bg-[#365E7D] text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
              >
                <FaUserEdit size={20} className="mr-2" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing profile */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal"
        aria-describedby="edit-profile-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '400px' }, // Width adjusts based on screen size
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 id="edit-profile-modal" className="text-xl font-semibold">Edit Profile</h2>
          <form onSubmit={handleUpdate}>
            <div className="relative flex justify-center mb-4">
              <div className="relative flex justify-center mb-4">
                <img
                  src={imagePreview || placeholderImage}
                  alt="Profile Preview"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <label
                  htmlFor="modal-image-upload"
                  className="absolute bottom-0 right-0 p-1 cursor-pointer bg-white border border-gray-400 rounded-full"
                >
                  <FaPlus size={20} className="text-[#365E7D]" />
                </label>
                <input
                  id="modal-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }} // Hide the default file input
                />
              </div>
              <input
                id="modal-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }} // Hide the default file input
              />
            </div>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="primary"
                style={{ marginRight: 10 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Update
              </Button>
            </div>          
          </form>
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Positioning Snackbar
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
