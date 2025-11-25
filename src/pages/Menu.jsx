import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import axios from "axios";
import { motion } from "framer-motion";

const Menu = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-white py-16 px-6 ">
      <h2
        id="menu-heading"
        className="text-center text-4xl font-extrabold text-gray-900 mb-10"
      >
        Our <span className="text-orange-500">Delicious Menu</span>
      </h2>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No dishes found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product._id}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden transition transform hover:-translate-y-2 max-w-sm mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/product/${product._id}`} className="block relative">
                {/* Category Tag */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-yellow-600 text-xs font-bold text-white uppercase px-3 py-1 rounded-full shadow-lg z-10 select-none">
                  {product.category}
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-44 object-cover rounded-t-3xl"
                />
              </Link>

              <div className="p-6">
                {/* Meal Type & Cooking Time */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-semibold tracking-wide select-none rounded-full px-3 py-1 bg-gray-100 text-gray-700">
                    {product.mealType}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600 text-xs select-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{product.cookingTime} mins</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 hover:text-yellow-600 transition">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-5 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating and Price */}
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="gold"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.538 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.783.57-1.838-.197-1.538-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                    <span className="text-yellow-700 text-lg select-none">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  <span className="text-red-700 font-extrabold text-lg select-none">
                    Rs. {product.price}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`rounded-xl py-3 flex justify-center items-center gap-3 font-bold transition disabled:opacity-50 ${
                    product.inStock
                      ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white w-full"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.3h12m-8-3v6m4-6v6"
                    />
                  </svg>
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
