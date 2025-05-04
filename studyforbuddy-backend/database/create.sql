-- Create the database
CREATE DATABASE IF NOT EXISTS studyforbuddy;

-- Use the created database
USE studyforbuddy;

-- Create the professors table
CREATE TABLE IF NOT EXISTS professors (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
    id CHAR(36) PRIMARY KEY,
    classroom_code VARCHAR(50) NOT NULL UNIQUE,
    professor_id CHAR(36),
    classroom_name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create the classroom_files table
CREATE TABLE IF NOT EXISTS classroom_files (
    id CHAR(36) PRIMARY KEY,
    classroom_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL, -- Stores both path and file name
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the classroom_allocation table
CREATE TABLE IF NOT EXISTS classroom_allocation (
    id CHAR(36) PRIMARY KEY,
    professor_id CHAR(36),
    student_id CHAR(36) NULL,
    classroom_name VARCHAR(255) NOT NULL,
    classroom_description TEXT NULL,
    status ENUM('open', 'close', 'busy') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS classroom_students (
    id CHAR(36) PRIMARY KEY,
    classroom_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (classroom_id, student_id)
);

-- Create the jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id CHAR(36) PRIMARY KEY,
    professor_id CHAR(36) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    total_vacancies INT NOT NULL,
    experience_range VARCHAR(50),
    job_type VARCHAR(50) CHECK (job_type IN ('full-time', 'part-time', 'internship', 'freelance')),
    company_criteria TEXT,
    requirements TEXT,
    passout_batch VARCHAR(50),
    job_description TEXT,
    is_remote BOOLEAN DEFAULT FALSE,
    preferred_skills TEXT, -- Changed to TEXT to store skills as a comma-separated string
    salary_range VARCHAR(50),
    job_location VARCHAR(255),
    application_deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the job_application table
CREATE TABLE IF NOT EXISTS job_application (
    id CHAR(36) PRIMARY KEY,
    student_id CHAR(36) NOT NULL, -- Foreign key for the student applying for the job
    job_id CHAR(36) NOT NULL, -- Foreign key for the job being applied for
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- Status of the application (pending, accepted, rejected)
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create the job_saved table
CREATE TABLE save_job (
    id CHAR(36) PRIMARY KEY,
    student_id CHAR(36) NOT NULL,
    job_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

