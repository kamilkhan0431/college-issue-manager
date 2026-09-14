const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();


// Signup
router.post("/signup", async (req, res) => {

    try {

        const {
            name,
            studentId,
            email,
            password
        } = req.body;


        // Check required fields
        if (!name || !studentId || !email || !password) {

            return res.status(400).json({
                message: "All fields are required."
            });

        }


        // Check if student ID already exists
        const existingStudent = await pool.query(
            "SELECT id FROM users WHERE student_id = $1",
            [studentId]
        );

        if (existingStudent.rows.length > 0) {

            return res.status(409).json({
                message: "A student with this ID already exists."
            });

        }


        // Check if email already exists
        const existingEmail = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingEmail.rows.length > 0) {

            return res.status(409).json({
                message: "An account with this email already exists."
            });

        }


        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);


        // Create user
        const result = await pool.query(
            `INSERT INTO users
            (name, student_id, email, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, student_id, email, created_at`,
            [
                name,
                studentId,
                email,
                passwordHash
            ]
        );


        res.status(201).json({
            message: "Account created successfully.",
            user: result.rows[0]
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });

    }

});

// Login
router.post("/login", async (req, res) => {

    try {

        const {
            identifier,
            password
        } = req.body;


        // Check required fields
        if (!identifier || !password) {

            return res.status(400).json({
                message: "Email/student ID and password are required."
            });

        }


        // Find user by email or student ID
        const result = await pool.query(
            `SELECT id, name, student_id, email, password_hash
             FROM users
             WHERE email = $1 OR student_id = $1`,
            [identifier]
        );


        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid email/student ID or password."
            });

        }


        const user = result.rows[0];


        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email/student ID or password."
            });

        }


        // Send user information
        res.json({
            message: "Login successful.",
            user: {
                id: user.id,
                name: user.name,
                student_id: user.student_id,
                email: user.email
            }
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });

    }

});

module.exports = router;