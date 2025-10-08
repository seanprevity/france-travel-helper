"use client";

import { useLanguage } from "@/context/LanguageContext";
import React from "react";
import { motion, Variants } from "framer-motion";
import { Playfair_Display, Lato } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const FeaturedCities = () => {
  const { t } = useLanguage();

  // === Variants ===
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.4 },
    },
  };

  const cities = [
    { img: "/paris-9eme.jpg", title: t("cityParis"), desc: t("parisBrief") },
    { img: "/nice-1.jpg", title: t("cityNice"), desc: t("niceBrief") },
    { img: "/lyon-1.webp", title: t("cityLyon"), desc: t("lyonBrief") },
  ];

  return (
    <div className="relative min-h-[95vh] bg-[url('/rainy-day-paris.jpeg')] bg-cover bg-center py-12 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden rounded-2xl">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-white">
        <h2
          className={`${playfair.className} text-3xl md:text-3xl font-bold text-center mb-4`}
        >
          {t("featuredTitle")}
        </h2>
        <p
          className={`${lato.className} text-center text-gray-200 mb-10 max-w-2xl mx-auto`}
        >
          {t("featuredDescription")}
        </p>

        {/* Cards grid with staggered animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {cities.map((city, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="overflow-hidden transition-transform duration-300 ease-in-out bg-white rounded-lg shadow-md hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="w-full h-52 overflow-hidden">
                <img
                  src={city.img}
                  alt={city.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </div>
              <div className="p-6 text-gray-900">
                <h3
                  className={`${playfair.className} text-xl font-semibold mb-2`}
                >
                  {city.title}
                </h3>
                <p className={`${lato.className} -gray-600 leading-relaxed`}>
                  {city.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedCities;
