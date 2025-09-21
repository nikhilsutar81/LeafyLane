import { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser,navigate } = useAppContext()
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setShowUserLogin(false);
            }

        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Google login removed

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post(`/user/${state}`, { name, email, password })
            const data = res?.data
            if (data?.success) {
                navigate("/")
                setUser(data.user)
                if (data.token) localStorage.setItem('token', data.token)
                setShowUserLogin(false)
            } else {
                toast.error(data?.message || "Unexpected response from server")
            }

        } catch (error) {
            // Defensive error handling: error.response may be undefined (network error, CORS, SSL, etc.)
            const message = error?.response?.data?.message || error?.message || "An unexpected error occurred"
            toast.error(message)
            console.error("Login error:", error)
        }

    }

    return (
        <div onClick={() => setShowUserLogin(false)} className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50">
            <form className="flex flex-col gap-4 m-auto items-start p-8 py-8 w-80 sm:w-[400px] rounded-xl shadow-2xl border border-gray-200 bg-white" onClick={(e) => e.stopPropagation()} onSubmit={onSubmitHandler}>
                <div className="w-full text-center mb-6">
                    <p className="text-2xl font-semibold">
                        <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                    </p>
                </div>

                {state === "register" && (
                    <div className="w-full">
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Enter your name"
                            className="border border-gray-300 rounded-lg w-full px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            type="text"
                            required
                        />
                    </div>
                )}

                <div className="w-full">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Enter your email"
                        className="border border-gray-300 rounded-lg w-full px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        type="email"
                        required
                    />
                </div>

                <div className="w-full">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Enter your password"
                        className="border border-gray-300 rounded-lg w-full px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        type="password"
                        required
                    />
                </div>

                <div className="w-full text-center text-sm mt-2">
                    {state === "register" ? (
                        <p>
                            Already have an account? {' '}
                            <button
                                type="button"
                                onClick={() => setState("login")}
                                className="text-primary hover:text-primary-dull font-medium cursor-pointer"
                            >
                                Login here
                            </button>
                        </p>
                    ) : (
                        <p>
                            Don't have an account? {' '}
                            <button
                                type="button"
                                onClick={() => setState("register")}
                                className="text-primary hover:text-primary-dull font-medium cursor-pointer"
                            >
                                Create account
                            </button>
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dull transition-colors text-white font-medium w-full py-2.5 rounded-lg cursor-pointer mt-4"
                >
                    {state === "register" ? "Create Account" : "Sign In"}
                </button>
            </form>
        </div>
    );
}

export default Login;