const express = require("express");
const router = express.Router();
const Seller = require("../mongoose/Seller");
const Buyer = require("../mongoose/Buyer");
const Product = require("../mongoose/Products");
const isloggedin = require("../middelware/isloggedin");
const jwt = require("jsonwebtoken");
require("dotenv");


router.get("/SignUp", (req, res) => {
    res.render("Form");
});

router.post("/Sign-up", async (req, res) => {
    try {
        const { username, email, Number, password } = req.body;

        // Check if user already exists
        const existingUser = await Buyer.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const newBuyer = new Buyer({
            username,
            email,
            Number,
            password
        });
        await newBuyer.save(); // Save user

        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(
            { email: newBuyer.email, id: newBuyer._id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie (optional)
        res.cookie("userSession", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // Security best practice
            secure: process.env.NODE_ENV === "production" ? true : false, // Security best practice
        });

        return res.redirect("/"); // ✅ Use return to prevent duplicate responses
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
});


router.get("/", isloggedin,async (req, res) => {
    const products = await Product.find().limit(6);
    const user = await Buyer.findById(req.user.id);
    res.render("Home", { products, user });
});

router.get("/Shop", isloggedin,async (req, res) => {
    const products = await Product.find();
    const user = await Buyer.findById(req.user.id);
    res.render("Shop", { products, user });
});

router.get("/Product", isloggedin, (req, res) => {
    res.render("Product");
});

router.post("/addtocart/:id", isloggedin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const buyer = await Buyer.findById(req.user.id);

        const existingProduct = buyer.Cart.find(
            (item) => item.productId.toString() === product._id.toString()
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            buyer.Cart.push({
                productId: product._id,
                quantity: 1,
            });
        }

        await buyer.save();
        console.log(buyer.Cart)

        res.json({ message: "Product added to cart" });
    } catch (error) {
        // Catch any errors that may occur
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Error adding product to cart" });
    }
});

router.get("/:name/:id", isloggedin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    const suggestions = await Product.find({_id: { $ne: req.params.id }});
    res.render("Product", { product, suggestions });
});

router.get("/:name/image/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        res.set("Content-Type", "image/jpg");
        res.send(product.Productimage);
    }catch(err){
        console.log(err);
    }
});

router.get("/:name/BuyNow/:id", isloggedin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    const buyer = await Buyer.findById(req.user.id);
    res.render("buynow", { product });
});

router.get("/Cart", isloggedin, async(req, res) => {
    const buyer = await Buyer.findById(req.user.id).populate('Cart.productId');
    const products = buyer.Cart;
    console.log(products[0].productId.id);
    res.render("cart", { buyer, products });
});

router.post("/removeproduct/:id", isloggedin, async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.user.id).populate("Cart.productId");

        // Find the product by matching the productId
        const productIndex = buyer.Cart.findIndex(item => item.productId._id.toString() === req.params.id);

        if (productIndex !== -1) {
            buyer.Cart.splice(productIndex, 1); // Remove the product at the found index
            await buyer.save();
            return res.json({ message: "One product removed from cart" });
        } else {
            return res.json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing product from cart" });
    }
});

router.post("/removecart/:id", isloggedin, async (req, res) => {
    const buyer = await Buyer.findById(req.user.id);
    buyer.Cart.pull({ productId: req.params.id});
    await buyer.save();
    res.json({ "message" : "Product removed from cart" });
});

router.post("/checkout/:name/:id", isloggedin, async (req, res) => {
    const buyer = await Buyer.findById(req.user.id).populate("Cart");
    const products = buyer.Cart;
    res.render("checkout", { products });
});

router.get("/HotDeals", isloggedin, async (req, res) => {
    try{
        const products = await Product.find({ ProductStandard: "Hot Deals" });
        console.log(products);
        res.render("Hotdeals", { products });
    }catch(error){
        res.status(500).json({ message: "Error fetching products" });
    }
});

router.get("/Exclusive", isloggedin , async (req, res) => {
    try{
        const products = await Product.find({ ProductStandard: "Exclusive" });
        console.log(products);
        res.render("Exclusive", { products });
    }catch(error){
        res.status(500).json({ message: "Error fetching products" });
    }
})

router.get("/Trending", isloggedin, async (req, res) => {
    try{
        const products = await Product.find({ ProductStandard: "Trending" });
        console.log(products);
        res.render("Trending", { products });
    }catch(error){
        res.status(500).json({ message: "Error fetching products" });
    }
});

router.get("/Logout", isloggedin, (req, res) => {
    res.clearCookie("userSession");
    res.redirect("/");
});

router.get("/Contact-Us",isloggedin, async(req, res) => {
    res.render("Contact")
});


module.exports = router;