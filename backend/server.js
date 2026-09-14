const express = require("express");
const pool = require("./db");

const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = 5000;


// Middleware
app.use(express.json());
app.use("/api/auth", authRoutes);


// Test route
app.get("/db-test", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully!",
            time: result.rows[0].now
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database connection failed."
        });

    }

});
app.get("/", (req, res) => {

    res.json({
        message: "CampusFix backend is running!"
    });

});


// Start server
app.listen(PORT, () => {

    console.log(`CampusFix backend running on http://localhost:${PORT}`);

});