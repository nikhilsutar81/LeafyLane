import { categories } from "../assets/assets"
import { useAppContext } from "../context/AppContext"



const Categories = () => {
    const { navigate } = useAppContext()
    return (
        <div className="mt-16">
            <p className="text-2xl md:text-3xl font-medium  mb-8">
                Explore by Category
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
                {categories.map((category, index) => (
                    <div key={index} className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-shadow duration-300" style={{ backgroundColor: category.bgColor }}
                        onClick={() => {
                            navigate(`/products/${category.path.toLowerCase()}`)
                            scrollTo(0, 0)
                        }}>
                        <img src={category.image} className="group-hover:scale-108 transition-transform duration-300 ease-in-out max-w-28" alt={category.text} />
                        <p className="font-sm font-medium">{category.text}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Categories