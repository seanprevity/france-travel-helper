import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { AuthContext } from "../context/AuthContext"
import "../styles/AuthForms.css"

export default function Login() {
  const { t } = useLanguage()
  const { login, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Check if coming from successful registration
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setShowSuccess(true)
    }
  }, [location.state])

  // If we already have a user, redirect
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/discover"
      navigate(from, { replace: true })
    }
  }, [user, navigate, location])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    const result = await login(form)
    setIsLoading(false)

    if (!result.success) {
      setError(result.error || t("loginFailed"))
    }
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="auth-loading">{t("loading")}</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-title">{t("loginTitle")}</h2>

          {showSuccess && <div className="auth-success">{t("registrationSuccess")}</div>}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              {t("username")}
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t("password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={isLoading} className="auth-button">
            {t("loginButton")}
          </button>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-link">
            {t("noAccount")} <Link to="/register">{t("registerNow")}</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
