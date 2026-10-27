const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    // cookie se token lo, na mile to Postman ke liye Bearer header check karo
    let token = req.cookies?.token;
    const header = req.headers.authorization;

    if (!token && header && header.startsWith("Bearer ")) {
        token = header.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

function optionalAuthMiddleware(req, res, next) {
    let token = req.cookies?.token;
    const header = req.headers.authorization;

    if (!token && header && header.startsWith("Bearer ")) {
        token = header.split(" ")[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            // ignore invalid token for optional auth
        }
    }
    next();
}

module.exports = { authMiddleware, optionalAuthMiddleware };
