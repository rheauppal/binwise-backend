# const { classifyItemWithGPT } = require("./openai");
# const { checkFirestore, saveToFirestore } = require("./firestore");

# /**
#  * Classifies an item name by checking Firestore or calling OpenAI.
#  * @param {string} itemName - Name of the item to classify.
#  * @returns {Promise<string>} - The classified category.
#  */
# async function classifyItem(itemName) {
#     try {
#         // Step 1: Check Firestore for existing classification
#         let category = await checkFirestore(itemName);
#         if (category) {
#             console.log(`✅ Found '${itemName}' in Firestore: ${category}`);
#             return category;
#         }

#         console.log(`🔍 '${itemName}' not found in Firestore. Calling OpenAI...`);

#         // Step 2: Call OpenAI if not found
#         category = await classifyItemWithGPT(itemName);
#         if (!category) throw new Error("OpenAI classification failed");

#         // Step 3: Save new classification to Firestore
#         await saveToFirestore(itemName, category);
#         console.log(`✅ Stored new classification: '${itemName}' → '${category}'`);

#         return category;
#     } catch (error) {
#         console.error("❌ Classification Error:", error);
#         return null;
#     }
# }

# module.exports = { classifyItem };
