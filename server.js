const dotenv = require("dotenv");
const express = require("express");
const path = require("path");


// Load environment variables
dotenv.config();

console.log("hi");
// Import routes
const classifyRoute = require("./src/routes/classify.js");  // Ensure the path is correct
const imageRoute = require("./src/routes/image.js");
// Initialize Express app
const app = express();
app.use(express.json());  // Enable JSON parsing

console.log("🚀 Initializing server...");

const cors = require("cors");

app.use(cors({
    origin: "https://binwise-frontend.vercel.app", // Replace with your deployed frontend URL
    methods: "GET,POST",
}));

// API Routes
app.use("/api/classify", classifyRoute);
app.use("/api/image", imageRoute);


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
