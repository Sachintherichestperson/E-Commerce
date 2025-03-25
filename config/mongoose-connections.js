const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
require("dotenv").config();  // Load environment variables

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing. Check your .env file.");
    process.exit(1);
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000  // Wait max 5s before failing
}).then(() => dbgr("✅ Connected to MongoDB"))
.catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);  // Stop app if MongoDB isn't connected
});

module.exports = mongoose.connection;
