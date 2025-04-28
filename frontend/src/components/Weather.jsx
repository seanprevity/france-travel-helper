import { useState, useEffect } from "react"
import { useLanguage } from "../context/LanguageContext"
import "../styles/Weather.css"

export default function Weather({ lat, lon }) {
  const { t } = useLanguage()
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFull, setShowFull] = useState(false)

  useEffect(() => {
    if (!lat || !lon) return
    setLoading(true)
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then(res => {
        if (!res.ok) throw new Error("Weather fetch failed")
        return res.json()
      })
      .then(data => setForecast(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [lat, lon])

  if (loading) return <div className="weather-loading">{t("loading")}</div>
  if (error || !forecast.length) return <div className="weather-error">{t("weatherError")}</div>

  const today = forecast[0]
  return (
    <div className="card-section weather-section">
      <h4 className="section-header">{t("weather")}</h4>

      <div
        className="weather-current"
        onClick={() => setShowFull((s) => !s)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={today.icon}
          alt={today.description}
          className="weather-icon"
        />
        <div className="weather-current-info">
          <div className="weather-temp">
            {Math.round(today.temp_max)}° / {Math.round(today.temp_min)}°
          </div>
          <div className="weather-desc">{today.description}</div>
        </div>
        <button className="weather-toggle-btn">
          {showFull ? t("hideForecast") : t("showForecast")}
        </button>
      </div>

      {showFull && (
        <div className="weather-forecast">
          {forecast.map((day) => (
            <div key={day.date} className="forecast-day">
              <div className="forecast-date">{day.date}</div>
              <img
                src={day.icon}
                alt={day.description}
                className="forecast-icon"
              />
              <div className="forecast-temp">
                {Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
