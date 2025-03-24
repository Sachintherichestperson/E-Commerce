const mongoose = require("mongoose");

const BuyerSchema = new mongoose.Schema({
    username: String,
    email: String,
    Number: Number,
    password: String,
    Cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // Reference to Product schema
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ]
})

module.exports = mongoose.model("Buyer", BuyerSchema);