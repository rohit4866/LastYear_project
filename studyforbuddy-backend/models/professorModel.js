const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class Professor {
    constructor({ name, email, mobile, password, profile_image }) {  
        this.id = uuidv4();
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.password = password;
        this.profile_image = profile_image;
    }

    // Create professor with email and mobile uniqueness validation
    async create() {
        // Check if email or mobile already exists
        const [existing] = await pool.query(
            'SELECT * FROM professors WHERE email = ? OR mobile = ?',
            [this.email, this.mobile]
        );
        if (existing.length > 0) {
            throw new Error('Email or Mobile already exists');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;

        const query = `INSERT INTO professors (id, name, email, mobile, password, profile_image) VALUES (?, ?, ?, ?, ?, ?)`;  
        const values = [this.id, this.name, this.email, this.mobile, this.password, this.profile_image];  
        await pool.query(query, values);
    }

    static async login(email, password) {
        const query = 'SELECT * FROM professors WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        const professor = rows[0];

        if (!professor) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, professor.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        return professor; // Return the professor object if login is successful
    }
    
    static async findById(id) {
        const query = 'SELECT * FROM professors WHERE id = ?';
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    }

    async update() {
        // Check if email or mobile is already in use by another professor
        const [existing] = await pool.query(
            'SELECT * FROM professors WHERE (email = ? OR mobile = ?) AND id != ?',
            [this.email, this.mobile, this.id]
        );
        if (existing.length > 0) {
            throw new Error('Email or Mobile already in use by another professor');
        }
    
        // Hash the password if it has been updated
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    
        const query = `UPDATE professors SET name = ?, email = ?, mobile = ?, password = ?, profile_image = ? WHERE id = ?`;  // Add name to update query
        const values = [this.name, this.email, this.mobile, this.password, this.profile_image, this.id];  // Add name to values
        await pool.query(query, values);
    }

    static async delete(id) {
        const query = 'DELETE FROM professors WHERE id = ?';
        await pool.query(query, [id]);
    }
}

module.exports = Professor;
