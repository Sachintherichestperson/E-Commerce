const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
require("dotenv").config();  // Load environment variables

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000  
}).then(() => dbgr("✅ Connected to MongoDB"))
.catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
});

module.exports = mongoose.connection;
