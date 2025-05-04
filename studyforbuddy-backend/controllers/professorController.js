const Professor = require('../models/professorModel');
const fs = require('fs');
const path = require('path');

// Create a new professor
exports.createProfessor = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;  // Include name
        const profile_image = req.file ? req.file.path : null;

        const newProfessor = new Professor({
            name,
            email,
            mobile,
            password,
            profile_image
        });

        await newProfessor.create();

        res.status(201).json({ message: 'Professor created successfully!' });
    } catch (error) {
        console.error('Error creating professor:', error);
        res.status(400).json({ error: error.message });
    }
};


// Login professor
exports.loginProfessor = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const professor = await Professor.login(email, password);
        
        // Respond with a success message, ID, and email only
        res.status(200).json({ 
            message: 'Login successful', 
            id: professor.id, 
            email: professor.email 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: error.message });
    }
};

// Get professor by ID
exports.getProfessorById = async (req, res) => {
    try {
        const id = req.params.id;
        const professor = await Professor.findById(id);

        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        // Prepend the host URL to the profile_image path
        const fullUrl = `${req.protocol}://${req.get('host')}`;
        professor.profile_image = professor.profile_image ? `${fullUrl}/${professor.profile_image}` : null;

        // Format the created_at and updated_at fields
        const formatDate = (date) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            return new Date(date).toLocaleString('sv-SE', options).replace('T', ' ');
        };

        // Construct response without the password
        const response = {
            id: professor.id,
            name: professor.name,
            email: professor.email,
            mobile: professor.mobile,
            profile_image: professor.profile_image,
            created_at: formatDate(professor.created_at),
            updated_at: formatDate(professor.updated_at),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching professor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update professor
exports.updateProfessor = async (req, res) => {
    try {
        const id = req.params.id;
        const { email, mobile, password, name } = req.body; // Added name
        const profile_image = req.file ? req.file.path : null;

        console.log('Update Professor Call:', { id, email, mobile, password, name, profile_image }); // Updated log

        // Find professor by ID
        const professorData = await Professor.findById(id);
        if (!professorData) {
            console.log('Professor not found with ID:', id);
            return res.status(404).json({ message: 'Professor not found' });
        }

        console.log('Professor found:', professorData);

        // Create an instance of Professor with the retrieved data
        const professor = new Professor({
            email: email || professorData.email,
            mobile: mobile || professorData.mobile,
            password: password || professorData.password, // Password will be hashed if updated
            profile_image: profile_image || professorData.profile_image,
            name: name || professorData.name, // Added name handling
        });

        // Handle profile image change if new image is uploaded
        if (profile_image && professorData.profile_image) {
            console.log('New profile image provided, deleting old image:', professorData.profile_image);
            try {
                const oldImagePath = path.join(__dirname, '..', professorData.profile_image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log('Old profile image deleted:', professorData.profile_image);
                } else {
                    console.log('Old profile image not found, skipping delete:', oldImagePath);
                }
            } catch (err) {
                console.error('Error deleting old profile image:', err);
            }
        }

        // Set the id for the update
        professor.id = id;

        // Call the update method from the Professor class
        await professor.update();

        console.log('Updating professor with new values:', {
            email: professor.email,
            mobile: professor.mobile,
            password: professor.password,
            profile_image: professor.profile_image,
            name: professor.name, // Updated log to include name
        });

        res.status(200).json({ message: 'Professor updated successfully' });
    } catch (error) {
        console.error('Error during updateProfessor call:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Delete professor
exports.deleteProfessor = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the professor by ID
        const professor = await Professor.findById(id);
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        // Delete profile image if it exists
        if (professor.profile_image) {
            try {
                const imagePath = path.join(__dirname, '..', professor.profile_image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);  // Remove image from file system
                    console.log(`Deleted profile image: ${professor.profile_image}`);
                } else {
                    console.log(`Profile image not found: ${imagePath}`);
                }
            } catch (err) {
                console.error('Error deleting profile image:', err);
            }
        }

        // Delete professor from the database
        await Professor.delete(id);

        res.status(200).json({ message: 'Professor deleted successfully' });
    } catch (error) {
        console.error('Error deleting professor:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
