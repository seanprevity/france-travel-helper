"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Compass, MapPin, Info } from "lucide-react";
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

const HowToUseSection = () => {
  const { t } = useLanguage();

  // Variants for cards
  const cardVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.3, ease: "easeOut" as const },
    },
  };

  // Container variant for staggering
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 }, 
    },
  };

  const steps = [
    {
      icon: <MapPin size={32} />,
      title: t("step1Title"),
      desc: t("step1Description"),
    },
    {
      icon: <Info size={32} />,
      title: t("step2Title"),
      desc: t("step2Description"),
    },
    {
      icon: <Compass size={32} />,
      title: t("step3Title"),
      desc: t("step3Description"),
    },
  ];

  return (
    <div className="relative min-h-[70vh] bg-gradient-to-b from-gray-50 to-gray-200 px-10 py-8">
      <h2 className={`${playfair.className} text-2xl md:text-3xl font-bold text-center mb-10`}>
        {t("howToTitle")}
      </h2>

      {/* Staggered container */}
      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="text-center p-8 rounded-lg bg-gray-50 shadow-md hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="flex justify-center items-center w-[70px] h-[70px] mx-auto mb-6 rounded-full bg-blue-100 text-blue-500">
              {step.icon}
            </div>
            <h3 className={`${playfair.className} text-xl font-semibold text-gray-800 mb-4`}>
              {step.title}
            </h3>
            <p className={`${lato.className} text-gray-600 leading-relaxed`}>{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HowToUseSection;
