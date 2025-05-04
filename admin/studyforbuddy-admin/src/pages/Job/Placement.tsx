import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Snackbar, Alert, Button } from '@mui/material';
import BASE_URL from '../../config';
import { FaSearch } from 'react-icons/fa';

const Placement = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Jobs state
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch the success message if available
        if (location.state && location.state.successMessage) {
            setSnackbarMessage(location.state.successMessage);
            setSnackbarOpen(true);
        }

        // Fetch professor_id from local storage
        const professorId = localStorage.getItem('professor_id');
        if (professorId) {
            fetchJobs(professorId);
        }
    }, [location.state]);

    const fetchJobs = async (professorId) => {
        try {
            const response = await fetch(`${BASE_URL}/jobs/professor/${professorId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleViewJob = (jobId) => {
        navigate(`/job/viewjob/${jobId}`);
    };

    // Filtering jobs based on search term
    const filteredJobs = jobs.filter(job => {
        const jobTitle = job.job_title.toLowerCase();
        const companyName = job.company_name.toLowerCase();
        const applicationDeadline = new Date(job.application_deadline).toLocaleDateString().toLowerCase();
        const term = searchTerm.toLowerCase();

        return (
            jobTitle.includes(term) ||
            companyName.includes(term) ||
            applicationDeadline.includes(term)
        );
    });

    // Date formatting utility
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <Breadcrumb pageName="Placements" />
            <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Jobs</h2>
                    <button
                        className="bg-[#365E7D] text-white px-4 py-2 rounded hover:bg-opacity-90"
                        onClick={() => navigate('/job/addjob')}
                    >
                        Add Job
                    </button>
                </div>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search classroom..."
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 pl-10 pr-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {loading && <p>Loading jobs...</p>}
                {filteredJobs.length === 0 && !loading && <p className='text-center'>No jobs found.</p>}

                {filteredJobs.length > 0 && (
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="border-b border-[#ccc] py-4 px-4 font-medium text-black dark:text-white">
                                        Job Title
                                    </th>
                                    <th className="border-b border-[#ccc] py-4 px-4 font-medium text-black dark:text-white">
                                        Company Name
                                    </th>
                                    <th className="border-b border-[#ccc] py-4 px-4 font-medium text-black dark:text-white">
                                        Application Deadline
                                    </th>
                                    <th className="border-b border-[#ccc] py-4 px-4 font-medium text-black dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredJobs.map(job => (
                                <tr key={job.id}>
                                    <td className="border-b border-[#ccc] py-4 px-4">{job.job_title}</td>
                                    <td className="border-b border-[#ccc] py-4 px-4">{job.company_name}</td>
                                    <td className="border-b border-[#ccc] py-4 px-4">{formatDate(job.application_deadline)}</td>
                                    <td className="border-b border-[#ccc] py-4 px-4">
                                        <Button
                                            variant="outlined"
                                            color="#365E7D"
                                            onClick={() => handleViewJob(job.id)}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Placement;
