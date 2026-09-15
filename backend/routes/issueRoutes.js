const express = require("express");
const pool = require("../db");

const router = express.Router();


// Create a new issue
router.post("/", async (req, res) => {

    try {

        const {
            studentId,
            category,
            location,
            title,
            description,
            priority
        } = req.body;


        // Check required fields
        if (
            !studentId ||
            !category ||
            !location ||
            !title ||
            !description ||
            !priority
        ) {

            return res.status(400).json({
                message: "All fields are required."
            });

        }


        // Check if student exists
        const student = await pool.query(
            "SELECT id FROM users WHERE student_id = $1",
            [studentId]
        );


        if (student.rows.length === 0) {

            return res.status(404).json({
                message: "Student account not found."
            });

        }


        // Create issue
        const result = await pool.query(
            `INSERT INTO issues
            (
                student_id,
                category,
                location,
                title,
                description,
                priority
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                studentId,
                category,
                location,
                title,
                description,
                priority
            ]
        );


        res.status(201).json({
            message: "Issue reported successfully.",
            issue: result.rows[0]
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });

    }

});

// Get all issues for a student
router.get("/student/:studentId", async (req, res) => {

    try {

        const { studentId } = req.params;


        const result = await pool.query(
            `SELECT *
             FROM issues
             WHERE student_id = $1
             ORDER BY created_at DESC`,
            [studentId]
        );


        res.json({
            issues: result.rows
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });

    }

});

module.exports = router;