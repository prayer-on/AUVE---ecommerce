const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.statua(401).json({ message: "Missing or invalid token!" });
    }

    const token = authHeader.split(' ')[1];

    try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
    }

    catch (error) {
    res.status(403).json({ message: "Invalid or expired token", error: error.message });
    }
};

module.exports = verifyToken;