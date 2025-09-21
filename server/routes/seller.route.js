import express from "express"
import { isASellerAuth, sellerLogin, sellerLogout } from "../controllers/seller.controller.js"
import authSeller from "../middlewares/auth-seller.js"

const router = express.Router()

router.post("/login", sellerLogin)
router.get("/is-auth", authSeller, isASellerAuth)
// Allow logout without auth so clients can clear cookies even if the token is invalid
router.get("/logout", sellerLogout)

export default router