import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin;

        next();
    } catch (error) {
        console.log("Error in authMiddleware:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};


export const adminMiddleware = (req, res, next) => {
    if (!req.isAdmin) return res.status(403).json({ message: "Access denied: Admins only" });
    next();
};