# const express = require("express");
# const multer = require("multer");
# const { spawn } = require("child_process");
# const path = require("path");
# const fs = require("fs");
# const { classifyItem } = require("../services/classification"); // ✅ Import classification function

# const router = express.Router();

# // Set up multer for handling image uploads
# const storage = multer.diskStorage({
#     destination: "images/",
#     filename: (req, file, cb) => {
#         cb(null, file.originalname);
#     }
# });

# const upload = multer({ storage });

# router.post("/detect", upload.single("image"), async (req, res) => {
#     try {
#         if (!req.file) {
#             return res.status(400).json({ error: "No image uploaded" });
#         }

#         const imagePath = path.resolve(req.file.path);
#         if (!fs.existsSync(imagePath)) {
#             return res.status(500).json({ error: "Uploaded file not found" });
#         }

#         console.log("🚀 Running YOLOv8 on image:", imagePath);
#         const pythonProcess = spawn("python3", [
#             path.join(__dirname, "../services/yolov8.py"),
#             imagePath
#         ]);

#         let result = "";
#         let errorOutput = "";

#         pythonProcess.stdout.on("data", (data) => {
#             result += data.toString();
#         });

#         pythonProcess.stderr.on("data", (data) => {
#             errorOutput += data.toString();
#             console.error(`❌ Python Error: ${data.toString()}`);
#         });

#         const timeout = setTimeout(() => {
#             pythonProcess.kill();
#             return res.status(500).json({ error: "Object detection timed out" });
#         }, 60 * 1000);

#         pythonProcess.on("close", async (code) => {
#             clearTimeout(timeout);
#             if (code !== 0) {
#                 return res.status(500).json({ error: "Object detection failed", details: errorOutput });
#             }

#             try {
#                 console.log("🔍 Raw Python Output:", result);

#                 // ✅ Extract JSON part (find the first `{`)
#                 const jsonStartIndex = result.indexOf("{");
#                 if (jsonStartIndex === -1) {
#                     throw new Error("No JSON found in Python output");
#                 }

#                 const cleanedResult = result.substring(jsonStartIndex).trim();
#                 console.log("📜 Cleaned Python Output:", cleanedResult);

#                 const parsedResult = JSON.parse(cleanedResult);
#                 const detectedObjects = parsedResult.objects_detected; // ["book", "bottle", ...]

#                 if (!detectedObjects || detectedObjects.length === 0) {
#                     return res.status(400).json({ error: "No objects detected" });
#                 }

#                 // ✅ Classify each detected object
#                 const classifications = {};
#                 for (const objectName of detectedObjects) {
#                     classifications[objectName] = await classifyItem(objectName);
#                 }

#                 res.json({ detectedObjects, classifications });
#             } catch (error) {
#                 res.status(500).json({ error: "Failed to parse response from YOLO", details: result });
#             }
#         });

#     } catch (error) {
#         res.status(500).json({ error: "Internal server error" });
#     }
# });

# module.exports = router;





# const express = require("express");
# const multer = require("multer");
# const { spawn } = require("child_process");
# const path = require("path");
# const fs = require("fs");
# const { classifyItem } = require("../services/classification"); // ✅ Import classification function

# const router = express.Router();

# // Set up multer for handling image uploads
# const storage = multer.diskStorage({
#     destination: "images/",
#     filename: (req, file, cb) => {
#         cb(null, file.originalname);
#     }
# });

# const upload = multer({ storage });

# router.post("/detect", upload.single("image"), async (req, res) => {
#     try {
#         if (!req.file) {
#             return res.status(400).json({ error: "No image uploaded" });
#         }

#         const imagePath = path.resolve(req.file.path);
#         if (!fs.existsSync(imagePath)) {
#             return res.status(500).json({ error: "Uploaded file not found" });
#         }

#         console.log("🚀 Running YOLOv8 on image:", imagePath);
#         const pythonProcess = spawn("python3", [
#             path.join(__dirname, "../services/yolov8.py"),
#             imagePath
#         ]);

#         let result = "";
#         let errorOutput = "";

#         pythonProcess.stdout.on("data", (data) => {
#             result += data.toString();
#         });

#         pythonProcess.stderr.on("data", (data) => {
#             errorOutput += data.toString();
#             console.error(`❌ Python Error: ${data.toString()}`);
#         });

#         const timeout = setTimeout(() => {
#             pythonProcess.kill();
#             return res.status(500).json({ error: "Object detection timed out" });
#         }, 60 * 1000);

#         pythonProcess.on("close", async (code) => {
#             clearTimeout(timeout);
#             if (code !== 0) {
#                 return res.status(500).json({ error: "Object detection failed", details: errorOutput });
#             }

#             try {
#                 console.log("🔍 Raw Python Output:", result);

#                 // ✅ Extract JSON part (find the first `{`)
#                 const jsonStartIndex = result.indexOf("{");
#                 if (jsonStartIndex === -1) {
#                     throw new Error("No JSON found in Python output");
#                 }

#                 const cleanedResult = result.substring(jsonStartIndex).trim();
#                 console.log("📜 Cleaned Python Output:", cleanedResult);

#                 const parsedResult = JSON.parse(cleanedResult);
#                 const detectedObjects = parsedResult.objects_detected; // ["book", "bottle", ...]

#                 if (!detectedObjects || detectedObjects.length === 0) {
#                     return res.status(400).json({ error: "No objects detected" });
#                 }

#                 // ✅ Classify each detected object
#                 const classifications = {};
#                 for (const objectName of detectedObjects) {
#                     classifications[objectName] = await classifyItem(objectName);
#                 }

#                 res.json({ detectedObjects, classifications });
#             } catch (error) {
#                 res.status(500).json({ error: "Failed to parse response from YOLO", details: result });
#             }
#         });

#     } catch (error) {
#         res.status(500).json({ error: "Internal server error" });
#     }
# });

# module.exports = router;
