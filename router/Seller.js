const express = require("express");
const router = express.Router();
const Product = require("../mongoose/Products");
const Seller = require("../mongoose/Seller");
const upload = require("../config/multer");


router.get("/Add-product", (req, res) => {
    res.render("Product-Add");
});

router.get("/product-image/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        res.set("Content-Type", "image/jpg");
        res.send(product.Productimage);
    }catch(err){
        console.log(err);
    }
});

router.post("/product-add",upload.single("Productimage"), (req, res) => {
    try{
        const { name, description, quantity, price } = req.body;
        const newProduct = new Product({
            Productname: name,
            Productdescription: description,
            Productimage: req.file.buffer,
            ProductQty: quantity,
            Productprice: price,
            ProductStandard: "Basic"
        });

        newProduct.save();
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

router.get("/Allproducts", async(req, res) => {
    const Allproducts = await Product.find();
    res.render("Allproducts", { Allproducts });
})

router.get("/product-edit/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        console.log(`product: ${product.Productname}`);
        res.render("Product-edit", { product });
    }catch(err){
        console.log(err);
    }
});

router.post("/product-Qty/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        console.log(product.ProductQty);
        product.ProductQty = "0";
        await product.save();
        res.json(product);
    }catch(err){
        console.log(err);
    }
});

router.post("/product-Delete/:id", async (req, res) => {
    const ProductId = req.params.id.trim();

    const product = await Product.findById(req.params.id);

    await Product.findByIdAndDelete(ProductId);
    
    res.json({ "message": "Product Deleted"});
});



module.exports = router;