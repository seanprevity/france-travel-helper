import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { AuthContext } from "../context/AuthContext"
import "../styles/AuthForms.css"

export default function Register() {
  const { t } = useLanguage()
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await register(form)
      if (result.success) {
        navigate("/login", {
          replace: true,
          state: { registrationSuccess: true },
        })
      } else {
        setError(result.error || t("registrationFailed"))
      }
    } catch (err) {
      setError(t("registrationFailed"))
    } finally {
      setIsLoading(false)
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
    <div className="auth-page-container">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-decoration decoration-1"></div>
          <div className="auth-form-decoration decoration-2"></div>

          <h2 className="auth-title">{t("registerTitle")}</h2>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              {t("username")}
            </label>
            <input
              id="username"
              name="username"
              placeholder={t("enterUsername")}
              value={form.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t("enterEmail")}
              value={form.email}
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
              placeholder={t("enterPassword")}
              value={form.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={isLoading} className="auth-button register-button">
            {isLoading ? t("loading") : t("registerButton")}
          </button>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-link">
            {t("haveAccount")} <Link to="/login">{t("loginNow")}</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
