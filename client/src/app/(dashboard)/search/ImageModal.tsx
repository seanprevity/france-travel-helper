"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Image } from "@/types/drizzleTypes";

export default function ImageModal({
  images,
  initialIndex,
  onClose,
}: {
  images: Image[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentImageIndex];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4 mt-[70px] animate-fade-in"
      onClick={onClose}
    >
      {/* Prev Button */}
      <button
        className="fixed left-8 top-1/2 z-[1001] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/60 hover:scale-110 md:left-4 md:h-10 md:w-10 sm:left-2 sm:h-9 sm:w-9 hover:cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
        aria-label="Previous image"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Close Button */}
      <button
        className="fixed top-8 right-8 z-[1001] flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/60 md:top-4 md:right-4 md:h-10 md:w-10 sm:top-2 sm:right-2 sm:h-9 sm:w-9 hover:cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Modal Content */}
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col overflow-hidden rounded-xl bg-[#1a1a1a] shadow-2xl"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container */}
        <div className="flex items-center justify-center relative">
          <div className="flex h-[70vh] w-[80vw] max-w-[1200px] items-center justify-center md:h-[50vh] sm:h-[40vh] sm:w-[90vw]">
            <img
              src={images[currentImageIndex].url || "/placeholder.svg"}
              alt={images[currentImageIndex].description || "Image"}
              className="max-h-full max-w-full rounded shadow-xl object-contain"
            />
          </div>
        </div>

        {/* Caption */}
        {images[currentImageIndex].description && (
          <div className="px-8 py-5 text-center text-white text-base leading-relaxed bg-[#1a1a1a] md:px-4 md:py-3 md:text-sm">
            <p>{images[currentImageIndex].description}</p>
          </div>
        )}

        {/* Counter */}
        <div className="border-t border-white/10 bg-[#1a1a1a] px-4 py-3 text-center text-sm text-gray-300">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Next Button */}
      <button
        className="fixed right-8 top-1/2 z-[1001] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/60 hover:scale-110 md:right-4 md:h-10 md:w-10 sm:right-2 sm:h-9 sm:w-9 hover:cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
        aria-label="Next image"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
