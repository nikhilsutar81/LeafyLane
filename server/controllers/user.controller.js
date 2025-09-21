import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validateLoginInput, validateRegisterInput } from "../helpers/validators.js"
import cloudinary from "../configs/cloudinary.js"
import streamifier from "streamifier";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const errorMsg = validateRegisterInput({ name, email, password });
        if (errorMsg) return res.status(400).json({ success: false, message: errorMsg });

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" })
        }

        const defaultAvatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${name.replace(/ /g, '+')}`
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            avatar: defaultAvatarUrl
        })

        const savedUser = await newUser.save()
        const userWithoutPassword = savedUser.toObject()
        delete userWithoutPassword.password

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie('token', token, {
            httpOnly: true,
            // Only use secure cookies in production
            secure: process.env.NODE_ENV === "production",
            // Use 'none' in production (for cross-site), but 'lax' during development so
            // the browser will send cookies on cross-origin requests from localhost dev server.
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(201).json({ success: true, user: userWithoutPassword })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const errorMsg = validateLoginInput({ email, password });
        if (errorMsg) return res.status(400).json({ success: false, message: errorMsg });

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        const userWithoutPassword = user.toObject()
        delete userWithoutPassword.password

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({ success: true, user: userWithoutPassword })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}


const uploadFromBuffer = (buffer) =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  

export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id
        console.log(userId)        
        const user = await User.findOne({ _id: userId })
        
       

        if (!user) {
            return res.status(403).json({
                success: false, message: "Google users cannot update profile or user not found"
            })
        }

        const updates = {}
        if (req.body.name) updates.name = req.body.name
        if (req.body.email) updates.email = req.body.email
        if (req.file) {
            const result = await uploadFromBuffer(req.file.buffer);
            updates.avatar = result.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password -__v')

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })
    } catch (error) {
        console.error("Update error:", error)
        res.status(500).json({
            success: false,
            message: "Error updating profile",
        })
    }
}

export const isAuth = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: '/',
        })
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}
