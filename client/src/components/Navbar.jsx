import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'
import { assets } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const searchTimeout = useRef(null);
    const dropdownRef = useRef(null);

    const {
        user,
        setUser,
        setShowUserLogin,
        navigate,
        setSearchQuery,
        searchQuery,
        getCartCount,
        setCartItems,
        isSeller,
        setIsSeller
    } = useAppContext()
   
   
    const handleLogout = async () => {
        try {
            const { data } = await axiosInstance.get("/user/logout")
            if (data.success) {
                toast.success(data.message)
                const localCart = JSON.parse(localStorage.getItem('cart')) || {}
                setCartItems(localCart)
                setUser(null)
                navigate("/")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }

    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products")
        }
    }, [searchQuery])

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current)
        }

        searchTimeout.current = setTimeout(() => {
            setOpen(false)
        }, 2500)
    }

    return (
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 py-4 border-b border-gray-300 bg-white relative">
            <div className="flex items-center justify-between w-full">
                <NavLink to="/" onClick={() => setOpen(false)}>
                    <img src={assets.logo} alt="Logo" className="h-10 md:h-16" />
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-4 md:gap-6 lg:gap-8">

                    {/* Seller Dashboard button always visible */}
                    <button
                        className="py-2 px-4 rounded-full border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                        onClick={() => {
                            navigate("/seller")
                        }}
                    >
                        Seller Dashboard
                    </button>

                    <NavLink to="/" className="hover:bg-gray-50 py-2 px-2 rounded-lg transition-colors whitespace-nowrap">Home</NavLink>
                    <NavLink to="/products" className="hover:bg-gray-50 py-2 px-2 rounded-lg transition-colors whitespace-nowrap">All Products</NavLink>

                    <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                        <input
                            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                            type="text"
                            placeholder="Search products"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                    </div>

                    <div className="relative cursor-pointer ml-4" onClick={() => navigate("/cart")}>
                        <img src={assets.cart_icon_2} alt="cart" className='w-6 opacity-80 min-w-[24px]' />
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                    </div>

                    {!user ? (
                        <button
                            onClick={() => {
                                setOpen(false)
                                setShowUserLogin(true)
                            }}
                            className="cursor-pointer px-4 md:px-6 lg:px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full whitespace-nowrap"
                        >
                            Login
                        </button>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <div className="cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                                <img
                                    src={user.avatar || assets.profile_icon}
                                    alt="profile_icon"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-primary transition-colors"
                                />
                            </div>

                            {showDropdown && (
                                <ul className="absolute top-12 right-0 flex flex-col bg-white shadow-lg border border-gray-200 py-2 w-48 rounded-md text-sm z-50">
                                    <li>
                                        <NavLink to="/orders" className="block px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowDropdown(false)}>My Orders</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/edit-profile" className="block px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowDropdown(false)}>Edit Profile</NavLink>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-logout transition-colors">
                                            Logout
                                        </button>
                                    </li>
                                    {isSeller && (
                                        <li>
                                            <NavLink to="/seller" className="block px-4 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowDropdown(false)}>Seller Dashboard</NavLink>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="sm:hidden flex items-center gap-4">
                    <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
                        <img src={assets.cart_icon_2} alt="cart" className='w-5 opacity-80 md:w-4' />
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                    </div>
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                        className="p-2"
                    >
                        <img
                            src={open ? assets.close_icon : assets.menu_icon}
                            alt="menu icon"
                            className="w-6 transition-transform"
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 overflow-hidden z-50 max-h-[500px] opacity-100">
                    <div className="px-4 py-4 space-y-4">
                        <div className="flex items-center gap-2 border border-gray-300 px-3 rounded-full">
                            <input
                                className="py-2 w-full bg-transparent outline-none placeholder-gray-500 text-sm"
                                type="text"
                                placeholder="Search products"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                        </div>

                        <NavLink to="/" onClick={() => setOpen(false)} className="block py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">Home</NavLink>
                        <NavLink to="/products" onClick={() => setOpen(false)} className="block py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">All Products</NavLink>
                        <button onClick={() => { setOpen(false); navigate('/seller') }} className="block w-full text-left py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">Seller Dashboard</button>

                        {user && (
                            <>
                                <NavLink to="/orders" onClick={() => setOpen(false)} className="block py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">My Orders</NavLink>
                                <NavLink to="/edit-profile" className="block px-2 py-2 hover:bg-gray-100 transition-colors" onClick={() => setShowDropdown(false)}>Edit Profile</NavLink>
                            </>
                        )}

                        {!user ? (
                            <button
                                onClick={() => {
                                    setOpen(false)
                                    setShowUserLogin(true)
                                }}
                                className="w-full py-3 bg-primary hover:bg-primary-dull transition text-white rounded-lg text-md font-medium"
                            >
                                Login
                            </button>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 bg-logout hover:bg-logout-hover text-white rounded-lg text-md font-medium"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
