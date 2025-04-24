import { useLanguage } from "../context/LanguageContext"
import { MapPin, Info, Compass, Globe, ChevronLeft, ChevronRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import "../styles/Home.css"

export default function Home() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  // Slideshow state and functionality
  const slides = [
    { url: "/louvre-1.webp", alt: "Louvre Museum" },
    { url: "/eiffel-tower-3.jpg", alt: "Eiffel Tower" },
    { url: "/arc-de-triomphe-2.webp", alt: "Arc de Triomphe" },
    { url: "/paris-cafe-1.jpg", alt: "Paris Cafe" },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((current) => (current === slides.length - 1 ? 0 : current + 1))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((current) => (current === 0 ? slides.length - 1 : current - 1))
  }, [slides.length])

  const goToSlide = (index) => { setCurrentSlide(index) }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000) 
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="home-container">
      {/* Hero Section with Slideshow */}
      <section id="home"className="hero-section">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.url})` }}
            >
              <div className="hero-overlay">
                <h1 className="hero-title">{t("heroTitle")}</h1>
                <p className="hero-subtitle">{t("heroSubtitle")}</p>
                <button className="hero-button" onClick={() => navigate("/discover")}>
                  {t("exploreButton")}
                </button>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button className="slide-arrow prev-arrow" onClick={prevSlide}>
            <ChevronLeft size={30} />
          </button>
          <button className="slide-arrow next-arrow" onClick={nextSlide}>
            <ChevronRight size={30} />
          </button>

          {/* Dots Navigation */}
          <div className="slide-dots">
            {slides.map((_, index) => (
              <button key={index}
                className={`slide-dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="content-section about-section">
        <h2 className="section-title">{t("aboutTitle")}</h2>
        <div className="about-content">
          <div className="about-text">
            <p>{t("aboutDescription1")}</p>
            <p>{t("aboutDescription2")}</p>
          </div>
          <div className="about-image-container">
            <img src="/france-countryside.jpg" alt={t("aboutImageAlt")} className="about-image" />
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="content-section featured-section">
        <h2 className="section-title">{t("featuredTitle")}</h2>
        <p className="section-description">{t("featuredDescription")}</p>

        <div className="featured-cities">
          <div className="city-card">
            <div className="city-image-container">
              <img src="/paris-1.avif" alt="Paris" className="city-image" />
            </div>
            <div className="city-info">
              <h3>{t("cityParis")}</h3>
              <p>{t("parisBrief")}</p>
            </div>
          </div>

          <div className="city-card">
            <div className="city-image-container">
              <img src="/nice-1.jpg" alt="Nice" className="city-image" />
            </div>
            <div className="city-info">
              <h3>{t("cityNice")}</h3>
              <p>{t("niceBrief")}</p>
            </div>
          </div>

          <div className="city-card">
            <div className="city-image-container">
              <img src="/lyon-1.webp" alt="Lyon" className="city-image" />
            </div>
            <div className="city-info">
              <h3>{t("cityLyon")}</h3>
              <p>{t("lyonBrief")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="content-section how-to-section">
        <h2 className="section-title">{t("howToTitle")}</h2>
        <div className="how-to-steps">
          <div className="step">
            <div className="step-icon">
              <MapPin size={32} />
            </div>
            <h3>{t("step1Title")}</h3>
            <p>{t("step1Description")}</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <Info size={32} />
            </div>
            <h3>{t("step2Title")}</h3>
            <p>{t("step2Description")}</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <Compass size={32} />
            </div>
            <h3>{t("step3Title")}</h3>
            <p>{t("step3Description")}</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="content-section cta-section">
        <div className="cta-content">
          <h2>{t("ctaTitle")}</h2>
          <p>{t("ctaDescription")}</p>
          <button className="cta-button" onClick={() => navigate("/discover")}>
            {t("ctaButton")}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t("footerAboutTitle")}</h3>
            <p>{t("footerAboutText")}</p>
          </div>
          <div className="footer-section">
            <h3>{t("footerLinksTitle")}</h3>
            <ul className="footer-links">
              <li>
                <Link to="/#home">{t("footerLinkHome")}</Link>
              </li>
              <li>
                <Link to="/discover">{t("footerLinkMap")}</Link>
              </li>
              <li>
                <Link to="/discover">{t("footerLinkCities")}</Link>
              </li>
              <li>
                <Link to="/#about">{t("footerLinkAbout")}</Link>
              </li>
              <li>
                <Link to="/">{t("footerLinkContact")}</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>{t("footerContactTitle")}</h3>
            <p>{t("footerContactEmail")}</p>
            <div className="language-selector">
              <Globe size={16} />
              <span>{t("footerLanguage")}</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            {t("footerCopyright")} &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
