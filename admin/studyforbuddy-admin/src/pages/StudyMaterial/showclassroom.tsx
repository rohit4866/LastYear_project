import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { IconButton, Snackbar, Alert, Modal, Box, Button, TextField, Divider } from '@mui/material';
import { GoPencil } from 'react-icons/go';
import { AiOutlineDelete, AiOutlineFile } from 'react-icons/ai';
import { MdAddChart } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';

const Showclassroom: React.FC = () => {
  const { classroomId } = useParams();
  const [classroom, setClassroom] = useState<any>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false); // New state for file upload modal
  const [classroomName, setClassroomName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // New state for file input
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!classroomId) return;

      try {
        const response = await fetch(`${BASE_URL}/classrooms/${classroomId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setClassroom(data);
        setClassroomName(data.classroom_name);
        setDescription(data.description);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch classroom details');
        setSnackbarOpen(true);
      }
    };

    fetchClassroom();
  }, [classroomId]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!classroomId) return;
  
      try {
        const response = await fetch(`${BASE_URL}/classrooms/files/${classroomId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setFiles(data); // Assuming response contains an array of files
      } catch (err) {
        console.error(err);
        setError('Failed to fetch classroom files');
        setSnackbarOpen(true);
      }
    };
  
    fetchFiles();
  }, [classroomId]); 

  const handleDeleteFile = async (fileId: string) => {
    // Show confirmation alert
    const confirmed = window.confirm('Are you sure you want to delete this file?');
    if (!confirmed) return; // If not confirmed, exit the function
  
    try {
      const response = await fetch(`${BASE_URL}/classrooms/files/${fileId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to delete file');
  
      // Use fileId directly from the response data instead of passing it
      setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId)); // Update state
      setSuccessMessage('File deleted successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to delete file');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError('');
    setSuccessMessage('');
  };

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleAddFileModalOpen = () => {
    setAddFileModalOpen(true); // Open file upload modal
  };

  const handleAddFileModalClose = () => {
    setAddFileModalOpen(false); // Close file upload modal
    setSelectedFiles(null); // Clear selected files
  };

  const handleUpdate = async () => {
    if (!classroomName.trim() || !description.trim()) {
      setError('Both fields are required');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classroom_name: classroomName, description }),
      });

      if (!response.ok) throw new Error('Failed to update classroom');
      const updatedClassroom = await response.json();
      setClassroom(updatedClassroom);
      handleModalClose();
      setSuccessMessage('Classroom updated successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to update classroom');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete classroom');
      handleDeleteModalClose();
      setSuccessMessage(`Classroom "${classroom.classroom_name}" deleted successfully!`);
      setSnackbarOpen(true);
      navigate('/studymaterial/classroom', { state: { successMessage: `Classroom "${classroom.classroom_name}" deleted successfully!` } });
    } catch (err) {
      console.error(err);
      setError('Failed to delete classroom');
      setSnackbarOpen(true);
    }
  };  

  const handleAddFiles = async () => {
    if (!selectedFiles) {
      setError('Please select files to upload');
      setSnackbarOpen(true);
      return;
    }
    
    if (!classroomId || !title.trim()) {
      setError('Classroom ID and title are required');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append('files', file);
    });

    // Append classroom_id and title
    formData.append('classroom_id', classroomId);
    formData.append('title', title);

    try {
      const response = await fetch(`${BASE_URL}/classrooms/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload files');
      setSuccessMessage('Files uploaded successfully!');
      setSnackbarOpen(true);
      handleAddFileModalClose();
      // Optionally refresh classroom data or handle accordingly
    } catch (err) {
      console.error(err);
      setError('Failed to upload files');
      setSnackbarOpen(true);
    }
  };

  if (!classroom) return <div>Loading...</div>;

  return (
    <div>
      <Breadcrumb pageName="Show Classroom" />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {error || successMessage}
        </Alert>
      </Snackbar>

      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{classroom.classroom_name}</h2>
          <div className="flex items-center">
            <IconButton onClick={handleEdit} className="mr-2 dark:text-white">
              <GoPencil />
            </IconButton>
            <IconButton onClick={handleDeleteModalOpen} className="mr-2 dark:text-white">
              <AiOutlineDelete />
            </IconButton>
            <IconButton onClick={handleAddFileModalOpen} className='dark:text-white'>
              <MdAddChart />
            </IconButton>
          </div>
        </div>

        <p className="text-gray-500">{classroom.description}</p>
        <p className="text-gray-500">Code: {classroom.classroom_code}</p>
        <p className="text-gray-400 mb-8">Created At: {new Date(classroom.created_at).toLocaleDateString('en-GB')}</p>

        <Divider className='dark:bg-[#ccc]' />

        <div className="files-list mt-8">
          {files.length === 0 ? ( // Check if there are no files
            <p className="text-gray-500 text-center">No files added.</p> // Message to display when there are no files
          ) : (
            <ul>
              <h4 className="text-2xl font-semibold mb-4">Uploaded Files</h4>
              {files.map((file) => (
                <div key={file.id} className="rounded-sm border border-stroke p-2 dark:border-strokedark dark:bg-boxdark mb-2 flex items-center justify-between">
                  <li className="flex items-center">
                    <AiOutlineFile className="text-gray-600 mr-2" size={18} /> {/* File icon */}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      // style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      <span className="truncate">{file.title}</span> {/* Add truncate for long filenames */}
                    </a>
                  </li>
                  <IconButton onClick={() => handleDeleteFile(file.fileId)} color="error">
                    <AiOutlineDelete />
                  </IconButton>
                </div>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
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
            maxWidth: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <h2 className="text-xl font-semibold">Edit Classroom</h2>
            <TextField
              label="Classroom Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleModalClose} variant="outlined" sx={{ marginRight: 2 }}>Cancel</Button>
              <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* Add File Modal */}
      <Modal
        open={addFileModalOpen}
        onClose={handleAddFileModalClose}
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
            <h2 className="text-xl font-semibold">Upload Files</h2>
            <TextField
              label="Title"
              fullWidth
              variant="outlined"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="my-2"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleAddFileModalClose} variant="outlined" sx={{ marginRight: 2 }}>Cancel</Button>
              <Button onClick={handleAddFiles} variant="contained" color="primary">Upload</Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
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
            <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete the classroom "<strong>{classroom.classroom_name}</strong>"?</p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleDeleteModalClose} variant="outlined" sx={{ marginRight: 2 }}>Cancel</Button>
              <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Showclassroom;
