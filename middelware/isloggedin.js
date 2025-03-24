const jwt = require("jsonwebtoken");
const Buyer = require("../mongoose/Buyer");

module.exports = async function (req, res, next) {
    try {
        if (!req.cookies.userSession) {
            res.redirect("/SignUp");
        }

        let decoded = jwt.verify(req.cookies.userSession, "u34yti3yv7ey4v84tv78yrf7y4vt48");

        let buyer = await Buyer.findOne({ email: decoded.email }).select("-password");
        
        if (!buyer) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = buyer;
        next();
    } catch (error) {
        return res.redirect("/SignUp")
    }
};