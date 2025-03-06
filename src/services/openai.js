const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Uses API key from .env
});

/**
 * Calls OpenAI API to classify an item into a dustbin category.
 * @param {string} itemName - The name of the waste item.
 * @returns {Promise<string>} - The predicted dustbin category.
 */
async function classifyItemWithGPT(itemName) {
  try {
    console.time("⏳ OpenAI Response Time");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Use "gpt-3.5-turbo" for cheaper cost
      messages: [
        {
          role: "system",
          content: "You are an expert in waste management. Classify the given waste item into one of the following categories: Recyclable, Organic, Hazardous, E-Waste, Medical Waste, Landfill."
        },
        {
          role: "user",
          content: `Which waste category does '${itemName}' belong to? Provide only the category name.`
        }
      ],
      temperature: 0.5, // Lower value for more consistent answers
    });
    console.timeEnd("⏳ OpenAI Response Time");
    return response.choices[0].message.content.trim(); // Extract GPT response
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message);
    return null; // Return null if classification fails
  }
}

module.exports = { classifyItemWithGPT };
