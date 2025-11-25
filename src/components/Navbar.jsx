import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import {
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineClose,
} from "react-icons/ai";
import { MdRestaurantMenu, MdHome, MdAdminPanelSettings } from "react-icons/md";
import { LuContact } from "react-icons/lu";
import { BiUser, BiChevronDown } from "react-icons/bi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const cartCount = getCartItemsCount();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowProfileDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setTimeout(() => {
        const menuHeading = document.getElementById("menu-heading");
        if (menuHeading) {
          menuHeading.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate("/");
    }
    setShowSearch(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate("/");
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-orange-200 shadow-md">
        <div className="flex justify-between items-center px-4 md:px-12 h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="NepaliThali"
              className="h-10 w-10 md:h-16 md:w-16 object-contain"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Nepali dishes..."
                className="w-full px-6 py-3 pl-12 border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition duration-300"
              />
              <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <AiOutlineClose className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              to="/"
              className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
            >
              <MdHome className="text-2xl" />
              <span className="text-xs">Home</span>
            </Link>

            <Link
              to="/menu"
              className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
            >
              <MdRestaurantMenu className="text-2xl" />
              <span className="text-xs">Menu</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
            >
              <AiOutlineShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
              <span className="text-xs">Cart</span>
            </Link>

            <Link
              to="/contact"
              className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
            >
              <LuContact className="text-2xl" />
              <span className="text-xs">Contact</span>
            </Link>

            {/* Admin link only if user exists and isAdmin */}
            {user && user.isAdmin && (
              <Link
                to="/admin"
                className="relative flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
                onClick={() => setShowProfileDropdown(false)}
              >
                <MdAdminPanelSettings className="text-2xl" />
                <span className="text-xs">Admin</span>
              </Link>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-orange-50 transition duration-300"
                >
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </span>
                  </div>
                  <span>{user.name}</span>
                  <BiChevronDown className="w-5 h-5 text-gray-700" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 animate-slide-down">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Orders
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="gradient-primary text-white px-6 py-2 rounded-xl hover:shadow-lg font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Top Icons */}
          <div className="flex md:hidden space-x-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-700 hover:text-orange-600"
            >
              <AiOutlineSearch className="text-2xl" />
            </button>
            <Link to="/contact" className="text-gray-700 hover:text-orange-600">
              <LuContact className="text-2xl" />
            </Link>
            {user && user.isAdmin && (
              <Link
                to="/admin"
                className="block text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => setShowProfileDropdown(false)}
              >
                <MdAdminPanelSettings className="text-2xl" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden px-4 pb-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dishes..."
                className="w-full px-4 py-3 pl-10 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition duration-300"
              />
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full z-50 md:hidden backdrop-blur-md bg-white/90 border-t border-orange-200 shadow-inner">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
          >
            <MdHome className="text-xl" />
            <span className="text-xs">Home</span>
          </Link>

          <Link
            to="/menu"
            className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
          >
            <MdRestaurantMenu className="text-xl" />
            <span className="text-xs">Menu</span>
          </Link>

          <Link
            to="/cart"
            className="relative flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
          >
            <AiOutlineShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </Link>

          {user ? (
            <div className="relative flex flex-col items-center">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex flex-col items-center"
              >
                <BiUser className="text-xl" />
                <span className="text-xs">Profile</span>
              </button>
              {showProfileDropdown && (
                <div className="absolute bottom-16 bg-white rounded-xl shadow-lg w-40 py-2 border border-gray-200 flex flex-col items-start animate-slide-up">
                  <Link
                    to="/profile"
                    className="px-4 py-2 w-full text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="px-4 py-2 w-full text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Orders
                  </Link>
                  <hr className="my-1 w-full border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 w-full text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition duration-300"
            >
              <BiUser className="text-xl" />
              <span className="text-xs">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
