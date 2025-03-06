const admin = require("./firebase");
const db = admin.firestore();

/**
 * Checks Firestore for an item's classification.
 */
async function checkFirestore(itemName) {
    const doc = await db.collection("wasteCategories").doc(itemName.toLowerCase()).get();
    return doc.exists ? doc.data().category : null;
}

/**
 * Saves a new item classification in Firestore.
 */
async function saveToFirestore(itemName, category) {
    await db.collection("wasteCategories").doc(itemName.toLowerCase()).set({ category });
}

module.exports = { checkFirestore, saveToFirestore };
