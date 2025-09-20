import Address from "../models/address.model.js"

export const addAddress = async (req, res) => {
    try {
        const { address } = req.body
        const userId = req.user.id
        await Address.create({ ...address, userId })

        res.status(201).json({ success: true, message: "Address added successfully" })
    } catch (error) {
        console.error("Address error:", error.message)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const getAddress = async (req, res) => {
    try {
        const userId = req.user.id
        const addresses = await Address.find({ userId })
        res.status(200).json({ success: true, addresses })
    } catch (error) {
        console.error("Addresses error:", error.message)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}
