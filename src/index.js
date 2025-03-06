import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import classifyRoutes from "./routes/classify.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/classify", classifyRoutes);
app.use("/api/image", imageRoutes);  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
