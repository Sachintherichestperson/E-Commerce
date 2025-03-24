const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    Productname: String,
    Productprice: Number,
    Productdescription: String,
    Productimage: Buffer,
    ProductStandard: String,
    ProductQty: Number,
    Reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller"
        }
    ],
});

module.exports = mongoose.model("Product", ProductSchema);