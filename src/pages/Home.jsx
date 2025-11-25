import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import axios from "axios";
import { motion } from "framer-motion";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [visibleCount, setVisibleCount] = useState(8);
  const { addToCart } = useCart();
  const location = useLocation();

  const categories = [
    { name: "All", icon: "/icons/drink.png" },
    { name: "Breakfast", icon: "/icons/hamburger.png" },
    { name: "Lunch", icon: "/icons/noodle.png" },
    { name: "Dinner", icon: "/icons/pizza.png" },
    { name: "Snacks", icon: "/icons/ice-cream.png" },
    { name: "Dessert", icon: "/icons/ice-cream.png" },
    { name: "Beverages", icon: "/icons/pizza.png" },
    { name: "Vegetarian", icon: "/icons/noodle.png" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, sortBy, location.search]);

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

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === selectedCategory
      );
    }

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    setVisibleCount(8);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const scrollToMenuTop = () => {
    const menuHeading = document.getElementById("menu-heading");
    if (menuHeading) {
      menuHeading.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[700px] flex items-center w-full">
        <video
          muted
          autoPlay
          loop
          playsInline
          poster="/bgPoster.jpg"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/bgVideo.mp4" type="video/mp4" />
        </video>

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>

        <motion.div
          className="relative z-20 max-w-4xl px-6 md:px-12 text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex gap-2 text-lg text-yellow-400 leading-tight ml-2 mb-4">
            <GiForkKnifeSpoon />
            <h1>Authentic Nepali Cuisine</h1>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            Order Your <span className="text-orange-400">Favorite Food</span>{" "}
            Anytime
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-6 max-w-lg">
            Discover fresh, delicious meals and ingredients delivered right to
            your door. From farm-fresh produce to ready-to-eat favorites, we
            make ordering authentic Nepali food easy, fast, and affordable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToMenuTop}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg hover:scale-105 transition"
            >
              Order Now
            </button>
            <button
              onClick={scrollToMenuTop}
              className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-6 py-3 rounded-full text-base font-semibold transition"
            >
              Explore Menu
            </button>
          </div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <section id="products-section" className="py-12 md:py-16 bg-white w-full">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div id="menu-heading" className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Our <span className="text-orange-500">Delicious Menu</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Choose from a variety of authentic Nepali favorites.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => setSelectedCategory(name.toLowerCase())}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm tracking-wide transition-all select-none ${
                  selectedCategory === name.toLowerCase()
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 hover:bg-orange-50 text-gray-700"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <img src={icon} alt={`${name} icon`} className="w-5 h-5" />
                {name}
              </button>
            ))}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 border border-yellow-400 rounded-full text-yellow-800 font-semibold cursor-pointer hover:border-yellow-600 transition ml-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No dishes found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <motion.div
                    key={product._id}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden transition transform hover:-translate-y-2 "
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="block relative"
                    >
                      {/* Category Tag */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-yellow-600 text-xs font-bold text-white uppercase px-3 py-1 rounded-full shadow-lg z-10 select-none">
                        {product.category}
                      </div>

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-t-3xl"
                      />
                    </Link>
                    <div className="p-5 sm:p-6">
                      {/* Product Name */}
                      <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-3 ">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 text-sm sm:text-base mb-5 line-clamp-3">
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
                        <div className="text-2xl">
                          <AiOutlineShoppingCart />
                        </div>
                        {product.inStock ? "Add to Cart" : "Not Possible"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="px-10 py-4 rounded-full font-extrabold transition shadow-yellow-500/50 bg-orange-500 text-white shadow-md hover:bg-orange-600"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
