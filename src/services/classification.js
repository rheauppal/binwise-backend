const { classifyItemWithGPT } = require("./openai");
const { checkFirestore, saveToFirestore } = require("./firestore");

/**
 * Classifies an item by checking Firestore or calling OpenAI.
 * @param {string} itemName - The name of the item to classify.
 * @returns {Promise<string>} - The classified category.
 */
async function classifyItem(itemName) {
    try {
        let category = await checkFirestore(itemName);
        if (category) {
            console.time("⏳ Firestore Query Time");
            console.log(`✅ Found '${itemName}' in Firestore: ${category}`);
            console.timeEnd("⏳ Firestore Query Time");
            return category;
        }

        console.log(`🔍 '${itemName}' not found in Firestore. Calling OpenAI...`);
        category = await classifyItemWithGPT(itemName);
        if (!category) throw new Error("OpenAI classification failed");

        await saveToFirestore(itemName, category);
        console.log(`✅ Stored new classification: '${itemName}' → '${category}'`);

        return category;
    } catch (error) {
        console.error("❌ Classification Error:", error);
        return "Unknown"; // Default fallback category
    }
}

/**
 * Classifies multiple items at once.
 * @param {string[]} itemNames - Array of item names to classify.
 * @returns {Promise<Object>} - A dictionary mapping item names to categories.
 */
async function classifyMultipleItems(itemNames) {
    const classifications = {};
    for (const itemName of itemNames) {
        classifications[itemName] = await classifyItem(itemName);
    }
    return classifications;
}

module.exports = { classifyItem, classifyMultipleItems };
