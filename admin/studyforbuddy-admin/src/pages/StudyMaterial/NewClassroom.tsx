import { Snackbar, Alert } from '@mui/material';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import BASE_URL from '../../config';

const NewClassroom = () => {
  const [classroomName, setClassroomName] = useState('');
  const [description, setDescription] = useState('');
  const [classroomCode, setClassroomCode] = useState(''); // State for classroom code
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState(''); 
  
  const navigate = useNavigate();

  const generateClassroomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setClassroomCode(code); // Set the generated code
  };

  useEffect(() => {
    generateClassroomCode(); // Generate code when the component mounts
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // Validate inputs
    if (!classroomName || !description || !classroomCode) {
      setSnackbarMessage('Error: All fields are required.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    const professor_id = localStorage.getItem('professor_id');
  
    const classroomData = {
      professor_id,
      classroom_name: classroomName,
      description,
      classroom_code: classroomCode, // Include classroom_code in the data
    };
  
    try {
      const response = await fetch(`${BASE_URL}/classrooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classroomData),
      });
  
      if (response.ok) {
        setSnackbarMessage('Classroom created successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); 
        navigate('/studymaterial/classroom', { state: { successMessage: 'Classroom created successfully' } });
      } else {
        const errorResponse = await response.json();
        setSnackbarMessage(`Error: ${errorResponse.message || 'Failed to create classroom.'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true); 
      }
    } catch (error) {
      console.error('Error creating classroom:', error);
      setSnackbarMessage('Error: An unexpected error occurred.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); 
    }
  };  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCancel = () => {
    navigate('/studymaterial/classroom');
  };

  return (
    <>
      <Breadcrumb pageName="New Classroom" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Create Classroom</h3>
        </div>
        <form className="flex flex-col gap-5.5 p-6.5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-3 block text-black dark:text-white">Classroom Name</label>
            <input
              type="text"
              placeholder="Enter classroom name"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-3 block text-black dark:text-white">Description</label>
            <textarea
              placeholder="Enter classroom description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              rows="3"
            />
          </div>
          <div>
            <label className="mb-3 block text-black dark:text-white">Classroom Code</label>
            <input
              type="text"
              placeholder="Unique classroom code"
              value={classroomCode}
              onChange={(e) => setClassroomCode(e.target.value.toUpperCase())} // Convert to uppercase
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required // Make this field mandatory
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="mr-3 rounded-lg border border-stroke bg-transparent py-3 px-5 text-black transition hover:bg-gray-200 dark:text-white dark:border-strokedark dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#365E7D] py-3 px-5 text-white transition hover:bg-opacity-90"
            >
              Create Classroom
            </button>
          </div>
        </form>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewClassroom;
