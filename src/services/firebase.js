
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// Load Firebase credentials from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
