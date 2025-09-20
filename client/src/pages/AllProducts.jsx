import { useEffect, useState, useRef, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { products, fetchProducts, pagination, changePage, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const loaderRef = useRef(null);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.pages) {
      changePage(pagination.page + 1);
    }
  }, [pagination.page, pagination.pages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMore]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {filteredProducts.filter((product) => product.inStock).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* Loader com spinner */}
      {pagination.page < pagination.pages && (
        <div ref={loaderRef} className="h-12 mt-6 flex justify-center items-center">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
