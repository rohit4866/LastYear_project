import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom'; 
import BASE_URL from '../../config';
import { Snackbar, Alert } from '@mui/material';

const EditJob = () => {
    const { jobId } = useParams();
    const [jobDetails, setJobDetails] = useState({
        jobTitle: '',
        companyName: '',
        totalVacancies: '',
        experienceRange: '',
        jobType: 'full-time',
        companyCriteria: '',
        requirements: '',
        passoutBatch: '',
        jobDescription: '',
        isRemote: false,
        preferredSkills: [],
        salaryRange: '',
        jobLocation: '',
        applicationDeadline: '',
    });
    const [newSkill, setNewSkill] = useState(''); // Add state for newSkill
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/jobs/${jobId}`);
                if (response.ok) {
                    const data = await response.json();
                    setJobDetails({
                        jobTitle: data.job_title,
                        companyName: data.company_name,
                        totalVacancies: data.total_vacancies,
                        experienceRange: data.experience_range,
                        jobType: data.job_type,
                        companyCriteria: data.company_criteria,
                        requirements: data.requirements,
                        passoutBatch: data.passout_batch,
                        jobDescription: data.job_description,
                        isRemote: data.is_remote,
                        preferredSkills: data.preferred_skills.split(', '),
                        salaryRange: data.salary_range,
                        jobLocation: data.job_location,
                        applicationDeadline: data.application_deadline,
                    });
                } else {
                    setError('Error fetching job details.');
                    setSnackbarOpen(true);
                }
            } catch (error) {
                setError('Error fetching job details: ' + error.message);
                setSnackbarOpen(true);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setJobDetails(prevDetails => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddSkill = () => {
        if (newSkill && !jobDetails.preferredSkills.includes(newSkill)) {
            setJobDetails(prevDetails => ({
                ...prevDetails,
                preferredSkills: [...prevDetails.preferredSkills, newSkill],
            }));
            setNewSkill(''); // Clear the input
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setJobDetails(prevDetails => ({
            ...prevDetails,
            preferredSkills: prevDetails.preferredSkills.filter(skill => skill !== skillToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate all fields
        const { jobTitle, companyName, totalVacancies, experienceRange, salaryRange, jobLocation, passoutBatch, companyCriteria, requirements, jobDescription, applicationDeadline } = jobDetails;
    
        if (!jobTitle || !companyName || !totalVacancies || !experienceRange || !salaryRange || !jobLocation || !passoutBatch || !companyCriteria || !requirements || !jobDescription || !applicationDeadline) {
            setError('All fields are mandatory.');
            setSnackbarOpen(true);
            return;
        }
    
        // Ensure applicationDeadline is in the correct format (YYYY-MM-DD)
        const formattedJobDetails = {
            job_title: jobTitle, // Match backend field name
            company_name: companyName, // Match backend field name
            total_vacancies: totalVacancies,
            experience_range: experienceRange,
            job_type: jobDetails.jobType, // Ensure this is correctly mapped
            company_criteria: companyCriteria,
            requirements: requirements,
            passout_batch: passoutBatch,
            job_description: jobDescription,
            is_remote: jobDetails.isRemote,
            preferred_skills: jobDetails.preferredSkills.join(', '), // Convert skills array to string
            salary_range: salaryRange,
            job_location: jobLocation,
            application_deadline: applicationDeadline.split('T')[0], // Only keep the date part
        };
    
        console.log(formattedJobDetails); // Debug log to check the data
    
        try {
            const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedJobDetails)
            });
    
            if (response.ok) {
                setSuccessMessage('Job updated successfully!');
                setSnackbarOpen(true);
                navigate('/job/placement', { state: { successMessage: 'Job updated successfully!' } });
            } else {
                const errorData = await response.json();
                setError(`Error updating job: ${errorData.message}`);
                setSnackbarOpen(true);
            }
        } catch (error) {
            setError('Error updating job: ' + error.message);
            setSnackbarOpen(true);
        }
    };
    

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        setSuccessMessage('');
        setError('');
    };

    return (
        <div>
            <Breadcrumb pageName="Edit Job" />
            <form onSubmit={handleSubmit} className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title and Company Name */}
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Job Title</label>
                        <input
                            type="text"
                            name="jobTitle"
                            placeholder="Enter job title"
                            value={jobDetails.jobTitle}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Enter company name"
                            value={jobDetails.companyName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Total Vacancies and Experience Range */}
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Total Vacancies</label>
                        <input
                            type="number"
                            name="totalVacancies"
                            placeholder="Enter total vacancies"
                            value={jobDetails.totalVacancies}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Experience Range</label>
                        <input
                            type="text"
                            name="experienceRange"
                            placeholder="e.g., 1-3 years"
                            value={jobDetails.experienceRange}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Job Type</label>
                        <select
                            name="jobType"
                            value={jobDetails.jobType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="internship">Internship</option>
                            <option value="freelance">Freelance</option>
                        </select>
                    </div>

                    {/* Salary Range and Job Location */}
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Salary Range</label>
                        <input
                            type="text"
                            name="salaryRange"
                            placeholder="e.g., 50000 - 70000"
                            value={jobDetails.salaryRange}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Job Location</label>
                        <input
                            type="text"
                            name="jobLocation"
                            placeholder="Enter job location"
                            value={jobDetails.jobLocation}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Passout Batch */}
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Passout Batch</label>
                        <input
                            type="text"
                            name="passoutBatch"
                            placeholder="Specify passout batch"
                            value={jobDetails.passoutBatch}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Company Criteria */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Company Criteria</label>
                        <textarea
                            name="companyCriteria"
                            rows={3}
                            placeholder="Enter company criteria"
                            value={jobDetails.companyCriteria}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Requirements */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Requirements</label>
                        <textarea
                            name="requirements"
                            rows={3}
                            placeholder="Enter job requirements"
                            value={jobDetails.requirements}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Job Description */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Job Description</label>
                        <textarea
                            name="jobDescription"
                            rows={3}
                            placeholder="Enter job description"
                            value={jobDetails.jobDescription}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Remote Option */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Is Remote</label>
                        <input
                            type="checkbox"
                            name="isRemote"
                            checked={jobDetails.isRemote}
                            onChange={handleChange}
                            className="h-4 w-4 border border-stroke text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Preferred Skills */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Preferred Skills</label>
                        <div className="flex flex-wrap">
                            {jobDetails.preferredSkills.map((skill, index) => (
                                <div key={index} className="mr-2 mb-2 flex items-center">
                                    <span className="mr-2 text-black dark:text-white">{skill}</span>
                                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-red-600">Remove</button>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Add a skill"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button type="button" onClick={handleAddSkill} className="mt-2 rounded-lg bg-blue-500 text-white px-4 py-2">Add Skill</button>
                    </div>

                    {/* Application Deadline */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Application Deadline</label>
                        <input
                            type="date"
                            name="applicationDeadline"
                            value={jobDetails.applicationDeadline.split('T')[0] || ''} // Format to YYYY-MM-DD
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            required // Optional
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/job/placement')}
                        className="mr-3 rounded-lg border border-stroke bg-transparent py-3 px-5 text-black transition hover:bg-gray-200 dark:text-white dark:border-strokedark dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-[#365E7D] py-3 px-5 text-white transition hover:bg-opacity-90"
                    >
                        Submit
                    </button>
                </div>
            </form>

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
        </div>
    );
};

export default EditJob;
