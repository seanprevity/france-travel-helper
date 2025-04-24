import { useState, useEffect, useRef } from "react"
import { useLanguage } from "../context/LanguageContext"
import "../styles/SearchBar.css"

export default function SearchBar({ onSelectTown }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const debounce = useRef(null)

  useEffect(() => {
    clearTimeout(debounce.current)
    if (!query) {
      setSuggestions([])
      return
    }

    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
        const towns = await res.json()
        setSuggestions(towns)
      } catch {
        setSuggestions([])
      }
    }, 250)

    return () => clearTimeout(debounce.current)
  }, [query])

  return (
    <div className="search-wrapper">
      <input type="text"
        value={query}
        placeholder={t("searchPlaceholder")}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((town) => (
            <li key={town.id}
              className="suggestion-item"
              onClick={() => {
                setQuery("")
                setSuggestions([])
                onSelectTown(town) // pass full town object back
              }}
            >
              {town.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
