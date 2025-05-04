import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import BASE_URL from '../../config';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar } from '@mui/material';
import { GoPencil } from 'react-icons/go';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';

const defaultProfileImage = 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png';

const Viewjob = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jobs/${jobId}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleEdit = () => {
    navigate(`/job/editjob/${jobId}`);
  };

  const handleDeleteModalOpen = () => {
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
  };

  const handleDeleteJob = async () => {
    try {
      await axios.delete(`${BASE_URL}/jobs/${jobId}`);
      navigate('/job/placement', {
        state: { successMessage: 'Job deleted successfully!' }
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job');
    } finally {
      handleDeleteModalClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!job) {
    return <p>No job details found.</p>;
  }

  return (
    <div>
      <Breadcrumb pageName="View Job" />
      
      {/* Job Details */}
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{job.job_title}</h2>
          <div className="flex space-x-2">
            <IconButton onClick={handleEdit} className="text-blue-500 dark:text-white">
              <GoPencil size={20} />
            </IconButton>
            <IconButton onClick={handleDeleteModalOpen} className="text-red-500 dark:text-white">
              <AiOutlineDelete size={20} />
            </IconButton>
          </div>
        </div>

        {/* Job Information */}
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 gap-x-8">
          <p><strong>Company:</strong> {job.company_name}</p>
          <p><strong>Total Vacancies:</strong> {job.total_vacancies}</p>
          <p><strong>Experience Range:</strong> {job.experience_range}</p>
          <p><strong>Job Type:</strong> {job.job_type}</p>
          <p><strong>Company Criteria:</strong> {job.company_criteria}</p>
          <p><strong>Requirements:</strong> {job.requirements}</p>
          <p><strong>Passout Batch:</strong> {job.passout_batch}</p>
          <p><strong>Is Remote:</strong> {job.is_remote ? "Yes" : "No"}</p>
          <p><strong>Preferred Skills:</strong> {job.preferred_skills}</p>
          <p><strong>Salary Range:</strong> {job.salary_range}</p>
          <p><strong>Job Location:</strong> {job.job_location}</p>
          <p><strong>Application Deadline:</strong> {formatDate(job.application_deadline)}</p>
          <p><strong>Created At:</strong> {formatDate(job.created_at)}</p>
        </div>
      </div>

      <div className="mt-10 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h1 className='font-bold text-2xl mb-2'>Applied Students</h1>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search classroom..."
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 pl-10 pr-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto" style={{ tableLayout: 'auto' }}>
            {/* Table Header */}
            <thead className="bg-gray-2 dark:bg-meta-4">
              <tr>
                <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base" style={{ width: '250px' }}>
                  Name
                </th>
                <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Email</th>
                <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base">Mobile</th>
                <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base">Action</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody>
                <tr>
                  <td className="flex items-center gap-3 p-2.5 xl:p-5" style={{ width: '250px', whiteSpace: 'nowrap' }}>
                    <div className="flex-shrink-0">
                      <img
                        src={defaultProfileImage}
                        alt="Profile"
                        className="w-14 h-14 rounded-full"
                      />
                    </div>
                    <p className="text-black dark:text-white">krishna</p>
                  </td>

                  {/* Email */}
                  <td className="p-2.5 xl:p-5 text-left">
                    <p className="text-black dark:text-white whitespace-nowrap">krishna@gmail.com</p>
                  </td>

                  {/* Mobile */}
                  <td className="p-2.5 xl:p-5 text-center">
                    <p className="text-meta-3">9607107901</p>
                  </td>

                  {/* Action */}
                  <td className="p-2.5 xl:p-5 text-center">
                    <Button
                      variant="outlined"
                      color="#365E7D"
                      onClick={() => handleViewJob(student.id)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this job? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteJob} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Viewjob;
