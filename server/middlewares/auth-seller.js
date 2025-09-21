import jwt from "jsonwebtoken"

const authSeller = (req, res, next) => {
    // Accept token from cookie or Authorization header
    let token = null
    if (req.cookies && req.cookies.sellerToken) token = req.cookies.sellerToken
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!token && authHeader && authHeader.startsWith && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded?.email === process.env.SELLER_EMAIL) {
            next()
        } else {
            return res.status(403).json({ success: false, message: "Access denied" })
        }

    } catch (error) {
        try {
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: '/',
            }
            res.clearCookie('sellerToken', cookieOptions)
            res.cookie('sellerToken', '', { ...cookieOptions, maxAge: 0 })
        } catch (e) {}
        res.status(401).json({ success: false, message: error.message })
    }
}

export default authSeller
