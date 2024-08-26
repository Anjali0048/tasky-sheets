import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    try {
        const token = req.header('x-auth-key');
        if (!token) {
            return res.status(401).json({ message: "Access Denied!" });
        }
        const payload = jwt.verify(token, 'sherlock'); // throws Error for invalid token
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Access Denied!" });
    }
}

export default authMiddleware;