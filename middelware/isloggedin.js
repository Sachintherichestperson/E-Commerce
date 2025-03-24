const jwt = require("jsonwebtoken");
const Buyer = require("../mongoose/Buyer");

module.exports = async function (req, res, next) {
    try {
        if (!req.cookies.userSession) {
            console.log("No token found");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
            res.redirect("/Sign-up");
        }

        let decoded = jwt.verify(req.cookies.userSession, "u34yti3yv7ey4v84tv78yrf7y4vt48");

        let buyer = await Buyer.findOne({ email: decoded.email }).select("-password");
        
        if (!buyer) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = buyer;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
