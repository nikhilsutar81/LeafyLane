import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { Link, useParams } from 'react-router';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useAppContext()
    const { id } = useParams()

    const [thumbnail, setThumbnail] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([])
    const product = products.find((item) => item._id === id)
    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice()
            productsCopy = productsCopy.filter((item) => product.category === item.category && item._id !== product._id)
            setRelatedProducts(productsCopy.slice(0, 5))
        }
    }, [products])

    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null)
    }, [product])
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])



    return product && (
        <div className=" mt-12">
            <nav aria-label='breadcrumb'>
                <Link to={"/"} >Home</Link > /
                <Link to='/products'> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="max-h-[400px] w-full object-contain" />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (

                            <img src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="star icons" className='md:w-4 w-3.5' key={i} />

                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price},00</p>
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice},00</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" onClick={() => addToCart(product._id)} >
                            Add to Cart
                        </button>
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
                            onClick={() => {
                                addToCart(product._id)
                                navigate("/cart")
                            }} >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center mt-20'>
                <div className='flex flex-col items-center w-max'>
                    <p className='text-3xl font-medium'>Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full'>
                    {relatedProducts.filter((product) => product.inStock).map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
                <button className='mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition' onClick={() => navigate(`/products/${product.category.toLowerCase()}`)}>See more</button>
            </div>
        </div>
    );
}

export default ProductDetails