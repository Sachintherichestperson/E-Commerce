const jwt = require("jsonwebtoken");
const Buyer = require("../mongoose/Buyer");
require("dotenv")

module.exports = async function (req, res, next) {
    try {
        if (!req.cookies.userSession) {
            return res.redirect("/SignUp");
        }

        let decoded = jwt.verify(req.cookies.userSession, process.env.JWT_SECRET);

        let buyer = await Buyer.findOne({ email: decoded.email }).select("-password");
        
        if (!buyer) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = buyer;
        next();
    } catch (error) {
        console.log(error);
        return res.redirect("/SignUp")
    }
};