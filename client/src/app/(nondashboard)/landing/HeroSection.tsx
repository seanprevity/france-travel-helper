"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
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

const slides = [
  { url: "/louvre-1.webp", alt: "Louvre Museum" },
  { url: "/eiffel-tower-3.jpg", alt: "Eiffel Tower" },
  { url: "/arc-de-triomphe-2.webp", alt: "Arc de Triomphe" },
  { url: "/paris-cafe-1.jpg", alt: "Paris Cafe" },
];

const HeroSection = () => {
  const { t } = useLanguage();
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center text-center pt-[50px] h-[calc(100vh-50px)]">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative w-full h-full flex-shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.url})` }}
            >
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-30 px-4 sm:px-6 lg:px-10 flex flex-col items-center justify-center text-white">
        <h1
          className={`${playfair.className} text-4xl sm:text-5xl md:text-6xl mb-4 font-bold drop-shadow-md tracking-tight`}
        >
          {t("heroTitle")}
        </h1>
        <p
          className={`${lato.className} text-lg sm:text-xl md:text-2xl max-w-3xl mb-8 font-light drop-shadow-sm`}
        >
          {t("heroSubtitle")}
        </p>
        <button
          onClick={() => router.push("/search")}
          className="text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-6 py-3 rounded-md shadow-lg hover:-translate-y-1 hover:cursor-pointer"
        >
          {t("exploreButton")}
        </button>
      </div>

      <button
        onClick={(e) =>
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
        className="absolute left-5 top-1/2 cursor-pointer transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white w-12 h-12 rounded-full z-40 flex items-center justify-center transition-transform duration-300 hover:scale-110"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={(e) =>
          setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
        }
        className="absolute right-5 top-1/2 cursor-pointer transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white w-12 h-12 rounded-full z-40 flex items-center justify-center transition-transform duration-300 hover:scale-110"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
