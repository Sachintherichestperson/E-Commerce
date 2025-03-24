const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
require("dotenv").config();  // Load environment variables

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => dbgr("Connected to MongoDB"))
.catch(err => dbgr("MongoDB connection error:", err));

module.exports = mongoose.connection;
