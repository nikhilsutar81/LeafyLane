import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import User from "../models/user.model.js"

export const createOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body
        const userId = req.user.id

        if (!address || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "invalid data" })
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        amount += Math.floor(amount * 0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        })
        await User.findByIdAndUpdate(userId, { cartItems: {} })

        return res.status(201).json({ success: true, message: "Order created successfully" })

    } catch (error) {
        console.error("Order error:", error.message)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })

        return res.status(200).json({ success: true, orders })

    } catch (error) {
        console.error("Order error:", error.message)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("items.product address")
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, orders })
    } catch (error) {
        console.error("Order error:", error.message)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}