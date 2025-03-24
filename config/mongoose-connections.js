const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

mongoose
.connect(`mongodb://127.0.0.1:27017/E-Commerce`)
.then(function(){
    dbgr("Connected")
})
.catch(function(err){
    dbgr(err)
})

module.exports = mongoose.connection;