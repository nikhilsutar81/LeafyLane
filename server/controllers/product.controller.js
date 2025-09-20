import cloudinary from "../configs/cloudinary.js"
import Product from "../models/product.model.js"
import streamifier from "streamifier"


export const addProduct = async (req, res) => {
    try {
        const productData = JSON.parse(req.body.productData)

        if (!productData.name || !productData.description || !productData.price || !productData.category) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const images = req.files
        if (!images || images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required" });
        }
      
        
        const uploadImage = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result.secure_url)
                    }
                )
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }


        const imagesUrl = await Promise.all(images.map(file => uploadImage(file.buffer)))

        await Product.create({ ...productData, image: imagesUrl })

        return res.status(201).json({ success: true, message: "Product Added" })

    } catch (error) {
        console.error("Add product error:", error.message)
        console.log(error)
        res.status(500).json({ success: false, message: "An error has occurred, try again later" })
    }
}



export const productList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const category = req.query.category

        const filter = {}

        if (category) {
            filter.category = category
        }

        const total = await Product.countDocuments(filter)
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        return res.status(200).json({
            success: true,
            data: products,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        })

    } catch (error) {
        console.error("productList error:", error.message)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const productsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({ success: false, message: "Category is required" });
        }

        const products = await Product.find({ category });

        return res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error("productsByCategory error:", error.message);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


export const productById = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        return res.status(200).json({ success: true, product })

    } catch (error) {
        console.error("productById error:", error.message)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const changeStock = async (req, res) => {
    try {
      const { id, inStock } = req.body
  
      if (typeof inStock !== "boolean") {
        return res.status(400).json({ success: false, message: "Invalid stock value" })
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, { inStock }, { new: true })
  
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" })
      }
  
      res.status(200).json({ success: true, message: "Stock Updated" })
    } catch (error) {
      console.error("Change Stock error:", error.message)
      res.status(500).json({ success: false, message: "Something went wrong" })
    }
  }