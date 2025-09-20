import express from "express"
import upload from "../middlewares/upload.js"
import authUser from "../middlewares/auth-user.js"
import authSeller from "../middlewares/auth-seller.js"
import { addProduct, changeStock, productById, productList, productsByCategory } from "../controllers/product.controller.js"

const router = express.Router()

// Sellers should be able to add products. Require seller authentication here.
router.post("/add", authSeller, upload.array('images'), addProduct)
router.get("/list", productList)
router.get("/:id", productById)
router.get('/category/:category', productsByCategory);

router.post("/stock", authSeller, changeStock)

export default router