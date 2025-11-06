"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import React from "react";
import { Playfair_Display, Lato } from "next/font/google";
import Image from "next/image";

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

const CallToAction = () => {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="relative py-38 px-8 flex items-center justify-center text-white text-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('/paris-1.avif')] bg-cover bg-center z-0" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/fr-flag.svg"
            alt="French flag"
            width={40}
            height={24}
            className="mb-3 drop-shadow"
          />
          <h2
            className={`${playfair.className} text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}
          >
            {t("ctaTitle")}
          </h2>
        </div>
        <p
          className={`${lato.className} text-lg md:text-xl mb-8 text-white/95 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]`}
        >
          {t("ctaDescription")}
        </p>
        <button
          onClick={() => router.push("/search")}
          className="bg-white text-blue-500 text-lg font-medium px-8 py-3 rounded hover:cursor-pointer hover:bg-gray-200 hover:-translate-y-1 hover:shadow-xl transition-transform duration-300"
        >
          {t("ctaButton")}
        </button>
        <p className="mt-4 text-white/80 italic text-sm">{t("testimonial")}</p>
      </div>
    </div>
  );
};

export default CallToAction;
