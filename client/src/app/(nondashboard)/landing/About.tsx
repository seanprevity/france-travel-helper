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

const About = () => {
  const { t } = useLanguage();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.4 },
    },
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-[95vh] bg-gradient-to-t from-white to-gray-100 py-12 px-6 sm:px-10 md:px-16 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className={`${playfair.className} relative text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 pb-2 inline-block mx-auto after:content-[''] after:absolute after:bottom-0 after:left-[30%] after:right-[30%] after:h-[3px] after:bg-gradient-to-r after:from-transparent after:via-blue-500 after:to-transparent`}>
          {t("aboutTitle")}
        </h2>

        <motion.div 
          className="flex flex-col gap-8 md:flex-row md:items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="flex-1 text-gray-700">
            <motion.p 
              className="mb-6 text-base sm:text-lg leading-relaxed tracking-wide text-shadow"
              variants={fadeInVariants}
            >
              <span className={`${lato.className} first-letter:text-blue-500 first-letter:font-semibold first-letter:text-[1.5em]`}>
                {t("aboutDescription1")}
              </span>
            </motion.p>
            <motion.p 
              className={`${lato.className} mb-6 text-base sm:text-lg leading-relaxed tracking-wide text-shadow`}
              variants={fadeInVariants}
            >
              {t("aboutDescription2")}
            </motion.p>
          </div>
          <motion.div 
            className="flex-1 flex justify-center"
            variants={fadeInVariants}  
          >
            <img
              src="/france-countryside.jpg"
              alt={t("aboutImageAlt")}
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
