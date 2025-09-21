import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import session from "express-session";
// passport and Google OAuth removed
import connectDB from "./configs/db.js"
import userRoutes from "./routes/user.route.js"
import sellerRoutes from "./routes/seller.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import orderRoutes from "./routes/order.route.js"
import addressRoutes from "./routes/address.route.js"
dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000
// Allow common local dev origins and an optional CLIENT_URL from env
const allowedOrigins = ['http://localhost:5173', 'http://localhost:4000', 'https://leafylane-client.vercel.app']

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Dynamic CORS handler: when credentials are used, browsers won't accept '*', so we echo allowed origins
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true)
        }
        return callback(new Error('CORS policy: Origin not allowed'))
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}

app.use((req, res, next) => {
    // For OPTIONS preflight, respond quickly with the correct headers
    if (req.method === 'OPTIONS') {
        cors(corsOptions)(req, res, () => res.sendStatus(204))
        return
    }
    cors(corsOptions)(req, res, next)
})

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax"
}));

// passport initialization removed


app.get("/", (req, res) => {
    res.send("ok")
})

app.use("/api/user", userRoutes)
app.use("/api/seller", sellerRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/address", addressRoutes)
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Connetion error:", err);
});