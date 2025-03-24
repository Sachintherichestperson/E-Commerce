const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
    username: String,
    email: String,
    Number: Number,
    password: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
})

module.exports = mongoose.model("Seller", SellerSchema);