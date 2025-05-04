import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom'; 
import BASE_URL from '../../config';
import { Snackbar, Alert } from '@mui/material';

const Addjob = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [totalVacancies, setTotalVacancies] = useState('');
    const [experienceRange, setExperienceRange] = useState('');
    const [jobType, setJobType] = useState('full-time'); // Dropdown
    const [companyCriteria, setCompanyCriteria] = useState('');
    const [requirements, setRequirements] = useState('');
    const [passoutBatch, setPassoutBatch] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isRemote, setIsRemote] = useState(false); // Switch
    const [preferredSkills, setPreferredSkills] = useState([]); // Checkboxes
    const [salaryRange, setSalaryRange] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const navigate = useNavigate();  
    const [newSkill, setNewSkill] = useState('');
    const [professorId, setProfessorId] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch professor_id from local storage
        const storedProfessorId = localStorage.getItem('professor_id');
        if (storedProfessorId) {
            setProfessorId(storedProfessorId);
        }
    }, []);

    const handleAddSkill = () => {
        if (newSkill && !preferredSkills.includes(newSkill)) {
            setPreferredSkills([...preferredSkills, newSkill]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setPreferredSkills(preferredSkills.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!jobTitle || !companyName || !totalVacancies || !experienceRange || !salaryRange || !jobLocation || !passoutBatch || !companyCriteria || !requirements || !jobDescription || !applicationDeadline) {
            setError('All fields are mandatory.');
            setSnackbarOpen(true);
            return;
        }

        const jobData = {
            professor_id: professorId,
            job_title: jobTitle,
            company_name: companyName,
            total_vacancies: totalVacancies,
            experience_range: experienceRange,
            job_type: jobType,
            company_criteria: companyCriteria,
            requirements: requirements,
            passout_batch: passoutBatch,
            job_description: jobDescription,
            is_remote: isRemote,
            preferred_skills: preferredSkills.join(', '),
            salary_range: salaryRange,
            job_location: jobLocation,
            application_deadline: applicationDeadline
        };

        try {
            const response = await fetch(`${BASE_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData)
            });

            if (response.ok) {
                setSuccessMessage('Job added successfully!');
                setSnackbarOpen(true);
                // Pass success message in state
                navigate('/job/placement', { state: { successMessage: 'Job added successfully!' } });
            } else {
                setError('Error adding job. Please try again.');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setError('Error adding job: ' + error.message);
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
            <Breadcrumb pageName="Add Job" />
            <form onSubmit={handleSubmit} className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title and Company Name */}
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Job Title</label>
                        <input
                            type="text"
                            placeholder="Enter job title"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Company Name</label>
                        <input
                            type="text"
                            placeholder="Enter company name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Total Vacancies and Experience Range */}
                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Total Vacancies</label>
                        <input
                            type="number"
                            placeholder="Enter total vacancies"
                            value={totalVacancies}
                            onChange={(e) => setTotalVacancies(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Experience Range</label>
                        <input
                            type="text"
                            placeholder="e.g., 1-3 years"
                            value={experienceRange}
                            onChange={(e) => setExperienceRange(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Job Type</label>
                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
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
                            placeholder="e.g., 50000 - 70000"
                            value={salaryRange}
                            onChange={(e) => setSalaryRange(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Job Location</label>
                        <input
                            type="text"
                            placeholder="Enter job location"
                            value={jobLocation}
                            onChange={(e) => setJobLocation(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Passout Batch</label>
                        <input
                            type="text"
                            placeholder="Specify passout batch"
                            value={passoutBatch}
                            onChange={(e) => setPassoutBatch(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Company Criteria */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Company Criteria</label>
                        <textarea
                            rows={3}
                            placeholder="Enter company criteria"
                            value={companyCriteria}
                            onChange={(e) => setCompanyCriteria(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Requirements */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Requirements</label>
                        <textarea
                            rows={3}
                            placeholder="Enter job requirements"
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Job Description */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Job Description</label>
                        <textarea
                            rows={3}
                            placeholder="Enter job description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Remote Option */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Is Remote</label>
                        <input
                            type="checkbox"
                            checked={isRemote}
                            onChange={(e) => setIsRemote(e.target.checked)}
                            className="h-4 w-4 border border-stroke text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {/* Preferred Skills */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Preferred Skills</label>
                        <div className="flex flex-wrap">
                            {preferredSkills.map((skill, index) => (
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
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <button type="button" onClick={handleAddSkill} className="mt-2 rounded-lg bg-blue-500 text-white px-4 py-2">Add Skill</button>
                    </div>

                    {/* Application Deadline */}
                    <div className="mb-4 col-span-1 md:col-span-2">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">Application Deadline</label>
                        <input
                            type="date"
                            value={applicationDeadline}
                            onChange={(e) => setApplicationDeadline(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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

export default Addjob;
