import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login again" })
    }
    try {
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decoded.id;
        next();
    } catch (error) {
        return res.json({ success: false, message: "Error" })
    }
};

export default authMiddleware;
