const express = require("express");
const { classifyItem } = require("../services/classification");

const router = express.Router();

/**
 * Handles classification by text input.
 */
router.post("/", async (req, res) => {
  console.time("⏳ Classification Time");
  console.log("🟢 Received request:", req.body);
  
  const { itemName } = req.body;
  if (!itemName) return res.status(400).json({ error: "Missing 'itemName' in request" });

  const category = await classifyItem(itemName);
  if (!category) return res.status(500).json({ error: "Failed to classify item" });
  
  console.log("✅ Classification Success:", { item: itemName, category });
  console.timeEnd("⏳ Classification Time"); // Logs how long it took
  res.json({ item: itemName, category });
});

module.exports = router;

// const express = require("express");
// const db = require("../services/firebase");
// const { classifyItemWithGPT } = require("../services/openai");

// const router = express.Router();

// /**
//  * Handles classification of an item.
//  * 1. Checks if the item exists in Firestore.
//  * 2. If found, returns the stored category.
//  * 3. If not found, calls OpenAI API to classify the item.
//  * 4. Stores the new classification in Firestore.
//  */
// router.post("/", async (req, res) => {
//   const { itemName } = req.body;

//   if (!itemName) {
//     return res.status(400).json({ error: "Missing 'itemName' in request" });
//   }

//   try {
//     // Check if the item already exists in Firestore
//     const itemRef = db.collection("wasteCategories").doc(itemName.toLowerCase());
//     const doc = await itemRef.get();

//     if (doc.exists) {
//       console.log(`✅ Found '${itemName}' in database.`);
//       return res.json({ item: itemName, category: doc.data().category });
//     }

//     console.log(`🔍 '${itemName}' not found in database. Calling OpenAI...`);

//     // Call OpenAI API to classify the item
//     const category = await classifyItemWithGPT(itemName);

//     if (!category) {
//       return res.status(500).json({ error: "Failed to classify item with OpenAI" });
//     }

//     // Store new classification in Firestore
//     await itemRef.set({ category });
//     console.log(`✅ Stored new classification: '${itemName}' → '${category}'`);

//     res.json({ item: itemName, category });

//   } catch (error) {
//     console.error("❌ Error processing request:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

