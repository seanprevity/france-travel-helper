import { useState, useEffect, useRef } from "react"
import { useLanguage } from "../context/LanguageContext"
import { ChevronLeft, ChevronRight, X, Star } from "lucide-react"
import "../styles/DescriptionCard.css"
import { useNavigate } from "react-router-dom"

export default function DescriptionCard({ town, townCode, department, departmentName, regionName, description, loading, images = [], }) {
  const { t } = useLanguage()
  const [isSaved, setIsSaved] = useState(false)
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 })
  const [ratingLoading, setRatingLoading] = useState(false)
  const [showRatingInput, setShowRatingInput] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const user = JSON.parse(localStorage.getItem("user"))
  const popupRef = useRef(null)
  const modalRef = useRef(null)
  const [escKeyPressed, setEscKeyPressed] = useState(false)
  const [arrowKeyPressed, setArrowKeyPressed] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [noAttractions, setNoAttractions] = useState(false)
  const [shouldClearCache, setShouldClearCache] = useState(false)
  const navigate = useNavigate()

  const interpolate = (str, vars) =>
    Object.entries(vars).reduce((s, [key, val]) => s.replace(new RegExp(`{{${key}}}`, "g"), val), str)

  // parse description into main + history + attractions
  const parseDescription = (text) => {
    if (!text) return { mainDescription: "", history: "", attractions: [] }

    // Match DESCRIPTION, HISTORY and ATTRACTIONS
    const structuredMatch = text.match(/DESCRIPTION:\s*([\s\S]*?)\s*HISTORY:\s*([\s\S]*?)\s*ATTRACTIONS:\s*([\s\S]+)/i)

    if (structuredMatch) {
      const mainDescription = structuredMatch[1].trim()
      const history = structuredMatch[2].trim()
      const attractionsRaw = structuredMatch[3].trim()

      const attractions = attractionsRaw
        .split("\n")
        .filter((line) => /^\d+\./.test(line.trim()))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())

      return { mainDescription, history, attractions }
    }

    const mainDescription = text.split(/\d+\.\s/)[0].trim()
    return { mainDescription, history: "", attractions: "" }
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
      if (res.status === 401) {
        navigate('/login')
        return
      }
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
      if (res.status === 401) {
        navigate('/login')
        return
      }
      if (!res.ok) throw new Error(await res.text())
      setIsSaved((prev) => !prev)
    } catch (err) {
      console.error("Failed to toggle bookmark:", err)
    }
  }

  const handleAddRating = async (value) => {
    const payload = { town_code: townCode, department, rating: value }

    const res = await fetch("/api/ratings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    if (res.status === 401) {
      navigate('/login')
      return
    }
    if (!res.ok) {
      console.error(`← Error ${res.status}:`, text)
      return
    }
    setShowRatingInput(false)
    fetchRatings()
  }

  const nextImage = () => { setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)) }

  const prevImage = () => { setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1)) }

  const openImageModal = (index) => {
    setCurrentImageIndex(index)
    setShowImageModal(true)
    setEscKeyPressed(false)
    setArrowKeyPressed(null)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
  }

  // Render star rating with support for percentage-based filling
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const partialValue = rating % 1

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="star-icon filled" />)
    }

    // Partial star (if any)
    if (partialValue > 0 && fullStars < 5) {
      stars.push(
        <div key="partial" className="partial-star-container">
          <Star className="star-icon partial-filled-bg" />
          <div className="partial-star-overlay" style={{ width: `${partialValue * 100}%` }}>
            <Star className="star-icon partial-filled" />
          </div>
        </div>,
      )
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (partialValue > 0 ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star-icon empty" />)
    }

    return stars
  }

  const { mainDescription, history, attractions } = parseDescription(description)

  useEffect(() => {
    setNoAttractions(attractions.length === 0)
    setShouldClearCache(attractions.length === 0)
  }, [attractions.length])

  const displayDescription = noAttractions ? interpolate(t("noInfoMessage"), { town }) : mainDescription

  useEffect(() => {
    if (!loading && shouldClearCache && townCode && department) {
      ;(async () => {
        try {
          const res = await fetch(
            `/api/descriptions?town_code=${encodeURIComponent(townCode)}&department=${encodeURIComponent(department)}`,
            { method: "DELETE" },
          )
          if (res.status === 401) {
            navigate('/login')
            return
          }
          if (!res.ok) throw new Error(await res.text())
        } catch (err) {
          console.error("Failed to clear description cache:", err)
        }
      })()
    }
  }, [loading, shouldClearCache, townCode, department])

  if (loading) return <div className="loading-message">{t("loading")}</div>
  if (!town) return <div className="no-town-message">{t("noTownSelected")}</div>

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showRatingInput && popupRef.current && !popupRef.current.contains(e.target)) {
        setShowRatingInput(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [showRatingInput])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setEscKeyPressed(true)
      } else if (e.key === "ArrowRight") {
        setArrowKeyPressed("ArrowRight")
      } else if (e.key === "ArrowLeft") {
        setArrowKeyPressed("ArrowLeft")
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (showImageModal) {
      if (escKeyPressed) {
        closeImageModal()
        setEscKeyPressed(false)
      } else if (arrowKeyPressed === "ArrowRight") {
        nextImage()
        setArrowKeyPressed(null)
      } else if (arrowKeyPressed === "ArrowLeft") {
        prevImage()
        setArrowKeyPressed(null)
      }
    }
  }, [escKeyPressed, arrowKeyPressed, showImageModal])

  return (
    <div className="description-card">
      {/* City */}
      <div className="card-section">
        <h4 className="section-header">{t("city")}</h4>
        <h3 className="town-name">{town}</h3>
        <p className="location-subheader">
          {interpolate(t("locationSentence"), {
            department: departmentName,
            region: regionName,
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

      {/* History */}
      {history && (
        <div className="card-section">
          <h4 className="section-header">{t("history")}</h4>
          <p className="description-text">{history}</p>
        </div>
      )}

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
        <div className="rating-container">
          <div className="rating-box-container" onClick={() => setShowRatingInput(true)}>
            {ratingLoading ? (
              <div className="rating-skeleton">{t("loading")}</div>
            ) : (
              <div className="rating-box">
                <div className="rating-stars-display">{renderStars(ratingData.average)}</div>
                <span className="rating-average">{ratingData.average.toFixed(1)}</span>
                <span className="rating-count">
                  ({ratingData.count} {t("ratings")})
                </span>
              </div>
            )}
          </div>

          {showRatingInput && (
            <div className="rating-popup" ref={popupRef} onClick={(e) => e.stopPropagation()}>
              <button
                className="rating-popup-close"
                onClick={(e) => { e.stopPropagation(), setShowRatingInput(false) }}
                aria-label={t("close")}
              >
                <X size={16} />
              </button>
              <p className="rating-popup-title">{t("addYourRating")}</p>
              <div className="rating-preview">
                {hoverRating > 0 ? hoverRating.toString().replace(".5", "½") : "0"}/5
              </div>
              <div className="rating-stars-input">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n}
                    className={`star-input-container ${hoverRating >= n ? "hovered" : ""}`}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleAddRating(n)}
                  >
                    <Star className={`star-input ${hoverRating >= n ? "filled" : "empty"}`} size={24} />

                    {/* Half-star hover areas */}
                    <div
                      className="half-star-area left"
                      onMouseEnter={(e) => { e.stopPropagation(), setHoverRating(n - 0.5) }}
                      onClick={(e) => { e.stopPropagation(), handleAddRating(n - 0.5) }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bookmark Button */}
        {user && (
          <button onClick={toggleBookmark}
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
              <X size={20} />
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
                <ChevronLeft size={28} />
              </button>

              <div className="image-modal-container">
                <img
                  src={images[currentImageIndex].url || "/placeholder.svg"}
                  alt={images[currentImageIndex].description || town}
                  className="image-modal-img"
                />
              </div>

              <button
                className="image-nav-button next-button"
                onClick={(e) => { e.stopPropagation(), nextImage() }}
                aria-label={t("next")}
              >
                <ChevronRight size={28} />
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
