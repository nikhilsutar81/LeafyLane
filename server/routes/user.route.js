import express from "express"
import { isAuth, login, logout, register, updateUser } from "../controllers/user.controller.js"
import jwt from "jsonwebtoken"
import upload from "../middlewares/upload.js"
import authUser from "../middlewares/auth-user.js"

const router = express.Router()


router.post("/register", register)
router.post("/login", login)
// Google OAuth routes removed
router.patch(
    '/update',
    authUser,
    upload.single('image'),
    updateUser
)

router.get("/is-auth", authUser, isAuth)
// Make logout public so the client can clear cookies even when the auth token is invalid or expired
router.get("/logout", logout)

export default router