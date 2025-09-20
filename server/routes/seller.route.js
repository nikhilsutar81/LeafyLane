import express from "express"
import { isASellerAuth, sellerLogin, sellerLogout } from "../controllers/seller.controller.js"
import authSeller from "../middlewares/auth-seller.js"

const router = express.Router()

router.post("/login", sellerLogin)
router.get("/is-auth",authSeller, isASellerAuth)
router.get("/logout", authSeller,sellerLogout)

export default router