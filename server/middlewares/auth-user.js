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
        // Attempt to clear token cookie so the browser won't keep sending an invalid token on refresh
        try {
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: '/',
            }
            res.clearCookie('token', cookieOptions)
            res.cookie('token', '', { ...cookieOptions, maxAge: 0 })
        } catch (e) {
            // ignore cookie clear errors
        }
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default authUser;
