import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="relative bg-white border border-gray-200 shadow-xl rounded-2xl p-10 md:p-14 text-center w-full max-w-6xl">
        <div className="flex justify-center items-center text-[80px] sm:text-[100px] md:text-[120px] font-extrabold text-gray-800">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="drop-shadow"
          >
            4
          </motion.span>
          <motion.img
            src="404Page.jpg"
            alt="Plate with food"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 mx-4 rounded-full shadow-md object-cover"
            initial={{ y: -10 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="drop-shadow"
          >
            4
          </motion.span>
        </div>

        <p className="text-xl text-black font-semibold mt-6">
          Recipe not found
        </p>
        <p className="text-sm text-gray-500 mt-2">
          We looked everywhere, but the recipe you're craving doesn't exist.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mt-10 bg-orange-500 hover:bg-orange-600 transition-all px-8 py-4 text-white text-base font-semibold rounded-full shadow-md mx-auto"
        >
          Back to Homepage
        </motion.button>

        <div className="absolute -bottom-6 -left-6 hidden md:block opacity-30">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.HDgS_nk6CzS3Dsvm0onH5wHaE6?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Leaf decoration"
            className="w-28"
          />
        </div>
        <div className="absolute -top-6 -right-6 hidden md:block opacity-30">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.HDgS_nk6CzS3Dsvm0onH5wHaE6?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Leaf decoration"
            className="w-24 rotate-180"
          />
        </div>
      </div>
    </div>
  );
};

export default NoPage;
