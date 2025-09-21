import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
    // Accept token from cookie or Authorization header (Bearer token)
    let token = null
    if (req.cookies && req.cookies.token) token = req.cookies.token
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!token && authHeader && authHeader.startsWith && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded?.id) {
            req.user = { id: decoded.id };
            next();
        } else {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export default authUser;
