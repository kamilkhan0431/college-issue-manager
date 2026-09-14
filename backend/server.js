const express = require("express");

const app = express();

const PORT = 5000;


// Middleware
app.use(express.json());


// Test route
app.get("/", (req, res) => {

    res.json({
        message: "CampusFix backend is running!"
    });

});


// Start server
app.listen(PORT, () => {

    console.log(`CampusFix backend running on http://localhost:${PORT}`);

});