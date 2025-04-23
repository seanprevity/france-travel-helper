import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import LogoutConfirmation from "./LogoutConfirmation"
import "../styles/navbar.css"

export default function Navbar() {
  const { t, lang, setLang } = useLanguage()
  const { pathname } = useLocation()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))

  const toggleLang = () => {
    setLang(lang === "en" ? "fr" : "en")
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user")
    window.location.reload()
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img src="/eiffel-tower.png" alt="eiffel-tower" className="navbar-logo"/>
            {t("title")}
          </Link>
        </div>
        <div className="navbar-right">
          {/* Language switch */}
          <label className="language-switch">
            <input type="checkbox" checked={lang === "fr"} onChange={toggleLang} />
            <span className="language-slider" />
          </label>

          {/* Conditional rendering based on auth status */}
          {user ? (
            <>
              <Link to="/discover" className={pathname === "/discover" ? "navbar-link-active" : "navbar-link"}>
                {t("discover")}
              </Link>
              <Link to="/bookmarks" className={pathname === "/bookmarks" ? "navbar-link-active" : "navbar-link"}>
                {t("bookmarks")}
              </Link>
              <button onClick={handleLogoutClick} className="navbar-button">
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                {t("loginButton")}
              </Link>
              <Link to="/register" className="navbar-link">
                {t("registerButton")}
              </Link>
            </>
          )}
        </div>
      </nav>

      {showLogoutConfirm && <LogoutConfirmation onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </>
  )
}