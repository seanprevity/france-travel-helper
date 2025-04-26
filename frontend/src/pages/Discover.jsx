import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom'
import Map from "../components/Map"
import SearchBar from "../components/SearchBar"
import DescriptionCard from "../components/DescriptionCard"
import { useLanguage } from "../context/LanguageContext"
import "../styles/Discover.css"

export default function Discover() {
  const { lang, t } = useLanguage()
  const [selectedTown, setSelectedTown] = useState(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const incoming = location.state?.townName
  const incomingCode = location.state?.code;
  const[images, setImages] = useState([])

  useEffect(() => {
    if (incoming) {
      handleSelectTown({ name: incoming, department: incomingCode })
    }
  }, [incoming, incomingCode])

  // called by SearchBar or map clicks
  const handleSelectTown = async (suggestion) => {
    setSelectedTown(null)
    setDescription("")
    setImages([])
    setLoading(true)
    try {
      const res = await fetch(
        `/api/location?name=${encodeURIComponent(suggestion.name)}&lang=${lang}&code=${encodeURIComponent(suggestion.department)}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Fetch failed")

      setSelectedTown({
        name: suggestion.name,
        latitude: suggestion.latitude ?? data.metadata.latitude,
        longitude: suggestion.longitude ?? data.metadata.longitude,
        code: data.metadata.code,
        department: data.metadata.department,
        department_name: data.metadata.department_name,
        region_name: data.metadata.region_name,
      })
      setDescription(data.description)
      setImages(data.images || [])
    } catch {
      setDescription(t("errorFetch"))
      setSelectedTown(null)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="discover-page-container">
      <div className="discover-page-decoration decoration-map-pin"></div>
      <div className="discover-container">
        <div className="search-container">
          <SearchBar onSelectTown={handleSelectTown} />
        </div>
        <div className="map-container">
          <Map onTownClick={handleSelectTown} selectedTown={selectedTown} />
        </div>
        <div className="description-container">
          {loading ? (
            <div className="loading-location">{t("loading")}</div>
          ) : (
            <DescriptionCard
              town={selectedTown?.name}
              townCode={selectedTown?.code}
              department={selectedTown?.department}
              departmentName={selectedTown?.department_name}
              regionName={selectedTown?.region_name}
              description={description}
              loading={loading}
              images={images}
            />
          )}
        </div>
      </div>
    </div>
  )
}
