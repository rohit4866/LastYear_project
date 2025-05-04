import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Snackbar, Alert } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import BASE_URL from '../../config';

const Classroom: React.FC = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const professorId = localStorage.getItem('professor_id');
    if (professorId) {
      const fetchClassrooms = async () => {
        try {
          const response = await fetch(`${BASE_URL}/classrooms/professor/${professorId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setClassrooms(data);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch classrooms');
          setSnackbarOpen(true);
        }
      };

      fetchClassrooms();
    }
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setSnackbarOpen(true);
    }
  }, [location.state]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSuccessMessage('');
  };

  const handleClassroomClick = (classroomId: string) => {
    navigate(`/studymaterial/showclassroom/${classroomId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.classroom_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.classroom_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={successMessage ? 'success' : 'error'}>
          {successMessage || error}
        </Alert>
      </Snackbar>
      <div className="mx-auto">
        <Breadcrumb pageName="Study Material" />

        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">Classrooms</h2>
            <button
              className="bg-[#365E7D] text-white px-4 py-2 rounded hover:bg-opacity-90"
              onClick={() => navigate('/studymaterial/newclassroom')}
            >
              New Classroom
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

          <div className="flex flex-col space-y-4">
            {filteredClassrooms.length > 0 ? (
              filteredClassrooms.map((classroom) => (
                <div 
                  key={classroom.id} 
                  className="border-[1.5px] border-stroke dark:border-strokedark rounded p-4 relative cursor-pointer transition dark:bg-[#1D2A39]" 
                  onClick={() => handleClassroomClick(classroom.id)}
                >
                  <h3 className="text-lg font-semibold">{classroom.classroom_name}</h3>
                  <p className="text-gray-500">{classroom.description}</p>
                  <p className="text-gray-500">Code: {classroom.classroom_code}</p>
                  <p className="absolute top-2 right-2 text-sm text-gray-400">{formatDate(classroom.created_at)}</p>
                </div>
              ))
            ) : (
              <div className='text-center my-5'>No classrooms found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Classroom;
