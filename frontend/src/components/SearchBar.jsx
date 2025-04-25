import { useState, useEffect, useRef } from "react"
import { useLanguage } from "../context/LanguageContext"
import "../styles/SearchBar.css"

export default function SearchBar({ onSelectTown }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const debounce = useRef(null)
  const inputRef = useRef(null)

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
      <div className={`search-input-container ${isFocused ? "focused" : ""}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={t("searchPlaceholder")}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="search-input"
        />
        {query && (
          <button
            className="clear-button"
            onClick={() => {
              setQuery("")
              inputRef.current?.focus()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((town) => (
            <li
              key={town.id}
              className="suggestion-item"
              onClick={() => {
                setQuery("")
                setSuggestions([])
                onSelectTown(town)
              }}
            >
              <div className="suggestion-content">
                {town.name}
                {town.department}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
