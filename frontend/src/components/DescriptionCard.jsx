import { useState, useEffect, useRef } from "react"
import { useLanguage } from "../context/LanguageContext"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import "../styles/DescriptionCard.css"

export default function DescriptionCard({ town, townCode, department, departmentName, regionName, description, loading, images = [] }) {
  const { t } = useLanguage()
  const [isSaved, setIsSaved] = useState(false)
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 })
  const [ratingLoading, setRatingLoading] = useState(false)
  const [showRatingInput, setShowRatingInput] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))
  const popupRef = useRef(null)
  const modalRef = useRef(null)
  const [escKeyPressed, setEscKeyPressed] = useState(false)
  const [arrowKeyPressed, setArrowKeyPressed] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const interpolate = (str, vars) =>
    Object.entries(vars).reduce(
      (s, [key, val]) => s.replace(new RegExp(`{{${key}}}`, "g"), val),
      str
    )

  // parse description into main + attractions
  const parseDescription = (text) => {
    if (!text) return { mainDescription: "", attractions: [] }
    const structuredMatch = text.match(/DESCRIPTION:\s*(.*?)\s*ATTRACTIONS:\s*([\s\S]+)/i)
    if (structuredMatch) {
      return {
        mainDescription: structuredMatch[1].trim(),
        attractions: structuredMatch[2]
          .split("\n")
          .filter((line) => /^\d+\./.test(line.trim()))
          .map((line) => line.replace(/^\d+\.\s*/, "").trim()),
      }
    }
    const fallbackAttractions = (text.match(/\d+\.\s(.+?)\s-\s(.+?)(?=\s*\d+\.|$)/g) || []).map((item) =>
      item.replace(/^\d+\.\s*/, ""),
    )
    return {
      mainDescription: text.split(/\d+\.\s/)[0].trim(),
      attractions: fallbackAttractions,
    }
  }

  // fetch ratings helper
  const fetchRatings = async () => {
    if (!townCode || !department) return
    setRatingLoading(true)
    try {
      const res = await fetch(`/api/ratings/${townCode}/${department}`)
      if (!res.ok) throw new Error("Failed to fetch ratings")
      const data = await res.json()
      setRatingData({
        average: data.average || 0,
        count: data.count || 0,
      })
    } catch (err) {
      console.error("Rating fetch error:", err)
      setRatingData({ average: 0, count: 0 })
    } finally {
      setRatingLoading(false)
    }
  }

  // fetch bookmarks helper
  const fetchBookmark = async () => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setIsSaved(data.bookmarks.includes(town))
    } catch (err) {
      console.error("Bookmark fetch failed:", err)
    }
  }

  // initial ratings/bookmark state load
  useEffect(() => {
    fetchRatings()
    if (town && user) fetchBookmark()
  }, [townCode, department, town])

  // toggle bookmark via cookie auth
  const toggleBookmark = async () => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: isSaved ? "DELETE" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ town_name: town }),
      })
      if (!res.ok) throw new Error(await res.text())
      setIsSaved((prev) => !prev)
    } catch (err) {
      console.error("Failed to toggle bookmark:", err)
    }
  }

  const handleAddRating = async (value) => {
    const payload = { town_code: townCode, department, rating: value }
    console.log("→ Sending rating payload:", payload)

    const res = await fetch("/api/ratings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    if (!res.ok) {
      console.error(`← Error ${res.status}:`, text)
      return
    }
    console.log("← Rating response:", text)
    setShowRatingInput(false)
    fetchRatings()
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex+1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex-1))
  }

  const openImageModal = (index) => {
    setCurrentImageIndex(index)
    setShowImageModal(true)
    setEscKeyPressed(false)
    setArrowKeyPressed(null)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
  }

  const { mainDescription, attractions } = parseDescription(description)

  const noAttractions = attractions.length === 0
  const displayDescription = noAttractions ? interpolate(t("noInfoMessage"), { town }) : mainDescription

  useEffect(() => {
    if (!loading && noAttractions && townCode && department) {
      ;(async () => {
        try {
          const res = await fetch(
            `/api/descriptions?town_code=${encodeURIComponent(townCode)}&department=${encodeURIComponent(department)}}`,
            { method: "DELETE" }
          )
          if (!res.ok) throw new Error(await res.text())
            console.info(`Cleared cache for ${townCode}/${department}`)
        } catch (err) {
          console.error("Failed to clear description cache:", err)
        }
      }) ()
    }
  }, [loading, noAttractions, townCode, department])

  if (loading) return <div className="loading-message">{t("loading")}</div>
  if (!town) return <div className="no-town-message">{t("noTownSelected")}</div>

  useEffect(() => {
    if (!showRatingInput) return
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowRatingInput(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => { document.removeEventListener("mousedown", handleOutsideClick)}
  }, [showRatingInput])

  useEffect(() => {
    const handleKeyDown= (e) => {
      if (e.key === "Escape") {
        setEscKeyPressed(true)
      }
      else if (e.key === "ArrowRight") {
        setArrowKeyPressed("ArrowRight")
      }
      else if (e.key === "ArrowLeft") {
        setArrowKeyPressed("ArrowLeft")
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (setShowImageModal) {
      if (escKeyPressed) {
        closeImageModal()
        setEscKeyPressed(false)
      }
      else if (arrowKeyPressed === "ArrowRight") {
        nextImage()
        setArrowKeyPressed(null)
      }
      else if (arrowKeyPressed === "ArrowLeft") {
        prevImage()
        setArrowKeyPressed(null)
      }
    }
  }, [escKeyPressed, arrowKeyPressed, setShowImageModal])

  return (
    <div className="description-card">
      {/* City */}
      <div className="card-section">
        <h4 className="section-header">{t("city")}</h4>
        <h3 className="town-name">{town}</h3>
        <p className="location-subheader">
          {interpolate(t("locationSentence"), {
            department: departmentName,
            region: regionName
          })}
        </p>
      </div>

      {/* Images Thumbnail Gallery */}
      {images.length > 0 && (
        <div className="card-section">
          <h4 className="section-header">{t("images")}</h4>
          <div className="image-thumbnails">
            {images.map((image, index) => (
              <div key={index} className="image-thumbnail-container" onClick={() => openImageModal(index)}>
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.description || town}
                  className="image-thumbnail"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="card-section">
        <h4 className="section-header">{t("description")}</h4>
        <p className="description-text">{displayDescription}</p>
      </div>

      {/* Attractions */}
      {!noAttractions && attractions.length > 0 && (
        <div className="card-section">
          <h4 className="section-header">{t("topAttractions")}</h4>
          <ul className="attractions-list">
            {attractions.map((item, idx) => (
              <li key={idx} className="attraction-item">
                <span className="attraction-number">{idx + 1}.</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Bar with Rating and Bookmark */}
      <div className="bottom-bar">
        {/* Rating Display & Input */}
        <div onClick={() => setShowRatingInput(true)} className="rating-container">
          {ratingLoading ? (
            <div className="rating-skeleton">{t("loading")}</div>
          ) : (
            <div className="rating-box">
              <span className="rating-star">⭐</span>
              <span className="rating-average">{ratingData.average.toFixed(1)}</span>
              <span className="rating-count">
                ({ratingData.count} {t("ratings")})
              </span>
            </div>
          )}

          {showRatingInput && (
            <div 
              className="rating-popup" 
              ref={popupRef}
              onClick={(e) => e.stopPropagation()}
              >
              <button 
                className="rating-popup-close" 
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRatingInput(false)
                }} 
                aria-label={t("close")}
              >
                x
              </button>
              <p className="rating-popup-title">{t("addYourRating")}</p>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className="rating-star-input" onClick={() => handleAddRating(n)}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bookmark Button */}
        {user && (
          <button
            onClick={toggleBookmark}
            className={`bookmark-button ${isSaved ? "bookmark-button-saved" : "bookmark-button-unsaved"}`}
          >
            📌 {isSaved ? t("saved") : t("save")}
          </button>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && images.length > 0 && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeImageModal} aria-label={t("close")}>
              <X size={24} />
            </button>

            <div className="image-modal-main">
              <button
                className="image-nav-button prev-button"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                aria-label={t("previous")}
              >
                <ChevronLeft size={30} />
              </button>

              <div className="image-modal-container">
                <img
                  src={images[currentImageIndex].url || "/placeholder.svg"}
                  alt={images[currentImageIndex].description || town}
                  className="image-modal-img"
                  onError={(e) => {
                    e.target.src = "/abstract-geometric-shapes.png"
                    e.target.alt = t("imageUnavailable")
                  }}
                />
              </div>

              <button
                className="image-nav-button next-button"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                aria-label={t("next")}
              >
                <ChevronRight size={30} />
              </button>
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
        </div>
      )}
    </div>
  )
}
