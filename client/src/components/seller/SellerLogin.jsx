import { useEffect, useState } from "react"
import { useAppContext } from "../../context/AppContext"
import axiosInstance from "../../api/axios"
import toast from "react-hot-toast"


const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate } = useAppContext()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        if (isSeller) {
            navigate("/seller")
        }
    }, [isSeller])

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axiosInstance.post('/seller/login', { email, password })
            if (data.success) {
                setIsSeller(true)
                navigate("/seller")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }
    return !isSeller && (
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center text-sm text-gray-600">
            <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
                <p className="text-2xl font-medium m-auto"><span className="text-primary">Seller</span> Login</p>
                <div className="w-full">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter your email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" />
                </div>
                <div className="w-full">
                    <p>Password</p>
                    <input type="password" placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)} value={password}
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" />
                </div>
                <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">Login</button>
            </div>
        </form>
    )
}

export default SellerLogin