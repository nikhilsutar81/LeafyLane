import React from 'react'
import { useAppContext } from "../../context/AppContext"
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const ProductList = () => {
    const { products, currency, pagination, changePage, fetchProducts,isSeller } = useAppContext()
    const toogleStock = async (id, inStock) => {
        try {
            const { data } = await axiosInstance.post('/product/stock', { id, inStock })
            if (data.success) {
                fetchProducts()
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    return (
        <div className="flex-1 py-10 flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>
                <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {products.map((product) => (
                                <tr key={product._id} className="border-t border-gray-500/20">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <div className="border border-gray-300 rounded p-2">
                                            <img src={product.image[0]} alt="Product" className="w-16" />
                                        </div>
                                        <span className="truncate max-sm:hidden w-full">{product.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3 max-sm:hidden">{currency}{product.offerPrice}</td>
                                    <td className="px-4 py-3">
                                        <   label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input
                                                onChange={(e) => toogleStock(product._id, e.target.checked)}
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={product.inStock}
                                            />
                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
            {pagination.pages > 1 && (
                <div className="flex flex-wrap justify-center items-center mt-6 gap-2 sm:gap-3">

                    <button
                        disabled={pagination.page === 1}
                        onClick={() => changePage(pagination.page - 1)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 
                 disabled:opacity-50 text-sm sm:text-base"
                    >
                        Prev
                    </button>


                    {Array.from({ length: pagination.pages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => changePage(i + 1)}
                            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded text-sm sm:text-base 
                    ${pagination.page === i + 1
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                }`}
                            style={{ minWidth: "2.5rem" }}
                        >
                            {i + 1}
                        </button>
                    ))}


                    <button
                        disabled={pagination.page === pagination.pages}
                        onClick={() => changePage(pagination.page + 1)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 
                 disabled:opacity-50 text-sm sm:text-base"
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    );

}

export default ProductList