import User from "../models/user.model.js"

export const updateCart = async (req, res) => {
    try {
        const userId = req.user.id
        const { cartItems } = req.body
        await User.findByIdAndUpdate(userId, { cartItems })
        res.status(200).json({ success: true , message:"Cart Updated" })
    } catch (error) {
        console.log("Cart error", error.message)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}