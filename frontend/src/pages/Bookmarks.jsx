import { useEffect, useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { Trash2, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../styles/Bookmarks.css"

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
      setLoading(false)
      return
    }

    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`/api/bookmarks`, {
          method: "GET",
          credentials: "include",
        })
        if (res.status === 401) {
          navigate("/login")
          return
        }
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setBookmarks(data.bookmarks || [])
      } catch (err) {
        console.error("Failed to load bookmarks", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookmarks()
  }, [])

  const deleteBookmark = async (townName, departmentCode) => {
    try {
      const res = await fetch(`/api/bookmarks`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ town_name: townName, code: departmentCode }),
      })

      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setBookmarks((bs) => bs.filter((b) => !(b.town_name === townName && b.department_code === departmentCode)))
    } catch (err) {
      console.error("Failed to delete bookmark.", err)
    }
  }

  if (loading)
    return (
      <div className="bookmarks-page-container">
        <div className="bookmarks-container">
          <p className="loading-message">{t("loading-towns")}</p>
        </div>
      </div>
    )

  const user = JSON.parse(localStorage.getItem("user"))
  if (!user) {
    return (
      <div className="bookmarks-page-container">
        <div className="bookmarks-container">
          <p className="no-user-message">{t("mustBeLoggedIn")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bookmarks-page-container">
      <div className="bookmarks-container">
        <h2 className="bookmarks-title">{t("bookmarksTitle")}</h2>
        {bookmarks.length === 0 && <p className="no-bookmarks-message">{t("noBookmarks")}</p>}
        <div className="bookmarks-list">
          {bookmarks.map((bookmark, idx) => (
            <div key={idx} className="bookmark-item">
              <h3 className="bookmark-town-name">{bookmark.town_name}</h3>
              <p className="bookmark-subheader">{bookmark.department_name} - {bookmark.region_name}</p>
              <div className="bookmark-buttons">
                <button
                  className="view-bookmark-button"
                  onClick={() => navigate("/discover", { state: { townName: bookmark.town_name, code: bookmark.department_code }})}
                  aria-label={`${t("view")} ${bookmark.town_name}`}
                >
                  <MapPin size={15} />
                  <span>{t("view")}</span>
                </button>
                <button
                  className="delete-bookmark-button"
                  onClick={() => deleteBookmark(bookmark.town_name, bookmark.department_code)}
                  aria-label={`${t("delete")} ${bookmark.town_name}`}
                >
                  <Trash2 size={15} />
                  <span>{t("delete")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
