const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { classifyItem } = require("../services/classification"); // ✅ Import classification function

const router = express.Router();

// Set up multer for handling image uploads
const storage = multer.diskStorage({
    destination: "images/",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post("/detect", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const imagePath = path.resolve(req.file.path);
        if (!fs.existsSync(imagePath)) {
            return res.status(500).json({ error: "Uploaded file not found" });
        }

        console.log("🚀 Running YOLOv8 on image:", imagePath);

        const pythonProcess = spawn("python3", [
            path.join(__dirname, "../services/yolov8.py"),
            imagePath
        ]);

        let result = "";
        let errorOutput = "";

        // ✅ Capture output
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
            console.error(`❌ Python Error: ${data.toString()}`);
        });

        // ✅ Set timeout for process
        // const timeout = setTimeout(() => {
        //     console.error("⏳ YOLOv8 process timed out, killing process...");
        //     pythonProcess.kill();
        //     if (!res.headersSent) {
        //         return res.status(500).json({ error: "Object detection timed out" });
        //     }
        // }, 60 * 1000);

        pythonProcess.on("close", async (code) => {
            //clearTimeout(timeout);

            if (code !== 0) {
                console.error("❌ YOLOv8 process failed.");
                return res.status(500).json({ error: "Object detection failed" });
            }

            try {
                console.log("🔍 Raw Python Output:", result);

                // ✅ Extract JSON part
                const jsonStartIndex = result.indexOf("{");
                if (jsonStartIndex === -1) {
                    throw new Error("No JSON found in Python output");
                }

                const cleanedResult = result.substring(jsonStartIndex).trim();
                console.log("📜 Cleaned Python Output:", cleanedResult);

                const parsedResult = JSON.parse(cleanedResult);
                const detectedObjects = parsedResult.objects_detected; // ["book", "bottle", ...]

                if (!detectedObjects || detectedObjects.length === 0) {
                    if (!res.headersSent) {
                        return res.status(400).json({ error: "No objects detected" });
                    }
                    return;
                }

                // ✅ Classify each detected object
                const classifications = {};
                for (const objectName of detectedObjects) {
                    classifications[objectName] = await classifyItem(objectName);
                }

                if (!res.headersSent) {
                    return res.json({ detectedObjects, classifications });
                }
            } catch (error) {
                console.error("⚠️ Failed to parse YOLOv8 output:", error.message);
                if (!res.headersSent) {
                    return res.status(500).json({ error: "Failed to parse response from YOLO", details: result });
                }
            }
        });

    } catch (error) {
        console.error("🔥 Internal server error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

module.exports = router;


// const express = require("express");
// const multer = require("multer");
// const { spawn } = require("child_process");
// const path = require("path");
// const fs = require("fs");
// const { classifyItem } = require("../services/classification"); // ✅ Import classification function

// const router = express.Router();

// // Set up multer for handling image uploads
// const storage = multer.diskStorage({
//     destination: "images/",
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({ storage });
// router.post("/detect", upload.single("image"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No image uploaded" });
//         }

//         const imagePath = path.resolve(req.file.path);
//         if (!fs.existsSync(imagePath)) {
//             return res.status(500).json({ error: "Uploaded file not found" });
//         }

//         console.log("🚀 Running YOLOv8 on image:", imagePath);
//         const pythonProcess = spawn("python3", [
//             path.join(__dirname, "../services/yolov8.py"),
//             imagePath
//         ]);

//         let result = "";
//         let errorOutput = "";

//         pythonProcess.stdout.on("data", (data) => {
//             result += data.toString();
//         });

//         pythonProcess.stderr.on("data", (data) => {
//             errorOutput += data.toString();
//             console.error(`❌ Python Error: ${data.toString()}`);
//         });

//         const timeout = setTimeout(() => {
//             pythonProcess.kill();
//             if (!res.headersSent) {
//                 return res.status(500).json({ error: "Object detection timed out" });
//             }
//         }, 60 * 1000);

//         pythonProcess.on("close", async (code) => {
//             clearTimeout(timeout);
//             if (code !== 0) {
//                 if (!res.headersSent) {
//                     return res.status(500).json({ error: "Object detection failed", details: errorOutput });
//                 }
//                 return;
//             }

//             try {
//                 console.log("🔍 Raw Python Output:", result);

//                 const jsonStartIndex = result.indexOf("{");
//                 if (jsonStartIndex === -1) {
//                     if (!res.headersSent) {
//                         return res.status(500).json({ error: "No JSON found in Python output", details: result });
//                     }
//                     return;
//                 }

//                 const cleanedResult = result.substring(jsonStartIndex).trim();
//                 console.log("📜 Cleaned Python Output:", cleanedResult);

//                 const parsedResult = JSON.parse(cleanedResult);
//                 const detectedObjects = parsedResult.objects_detected;

//                 if (!detectedObjects || detectedObjects.length === 0) {
//                     if (!res.headersSent) {
//                         return res.status(400).json({ error: "No objects detected" });
//                     }
//                     return;
//                 }

//                 const classifications = {};
//                 for (const objectName of detectedObjects) {
//                     classifications[objectName] = await classifyItem(objectName);
//                 }

//                 if (!res.headersSent) {
//                     res.json({ detectedObjects, classifications });
//                 }
//             } catch (error) {
//                 if (!res.headersSent) {
//                     res.status(500).json({ error: "Failed to parse response from YOLO", details: result });
//                 }
//             }
//         });

//     } catch (error) {
//         if (!res.headersSent) {
//             res.status(500).json({ error: "Internal server error" });
//         }
//     }
// });

// module.exports = router;
