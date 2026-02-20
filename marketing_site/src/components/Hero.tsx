import React from "react";
import { motion } from "framer-motion";

export const Hero: React.FC = () => {
  return (
    <section className="h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-20 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Zamir
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto px-4">
          Connect with your faith. Enhance your lifestyle.
        </p>
      </motion.div>
    </section>
  );
};
