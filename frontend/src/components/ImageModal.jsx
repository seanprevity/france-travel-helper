import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import "../styles/ImageModal.css"

export default function ImageModal({ images, initialIndex = 0, onClose }) {
   const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex)
   const modalRef = useRef(null)

   const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
   }

   const prevImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
   }

   useEffect(() => {
      const handleKeyDown = (e) => {
         if (e.key === "Escape") {
            onClose()
         } else if (e.key === "ArrowRight") {
            nextImage()
         } else if (e.key === "ArrowLeft") {
            prevImage()
         }
      }

      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
   }, [onClose])

   if (!images || images.length === 0) return null

   return (
      <div className="image-modal-overlay" onClick={onClose}>
         <button
            className="image-nav-button prev-button"
            onClick={(e) => {
               e.stopPropagation()
               prevImage()
            }}
            aria-label="Previous image"
         >
            <ChevronLeft size={28} />
         </button>

         <button className="image-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
         </button>

         <div className="image-modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-main">
               <div className="image-modal-container">
                  <img
                     src={images[currentImageIndex].url || "/placeholder.svg"}
                     alt={images[currentImageIndex].description || "Image"}
                     className="image-modal-img"
                  />
               </div>
            </div>

            {images[currentImageIndex].description && (
               <div className="image-modal-caption">
                  <p>{images[currentImageIndex].description}</p>
               </div>
            )}

            <div className="image-modal-counter">
               {currentImageIndex + 1} / {images.length}
            </div>
         </div>

         <button
            className="image-nav-button next-button"
            onClick={(e) => {
               e.stopPropagation()
               nextImage()
            }}
            aria-label="Next image"
         >
            <ChevronRight size={28} />
         </button>
      </div>
   )
}
