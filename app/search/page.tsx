"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"
import Link from "next/link"

const GENRES = ["All", "Afrobeats", "Hip-Hop", "R&B", "Amapiano", "Gospel", "Pop", "Jazz", "Drill", "Highlife", "Reggae", "Soul", "Other"]

export default function SearchPage() {

  const [query, setQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [availableOnly, setAvailableOnly] = useState(false)
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [trackCounts, setTrackCounts] = useState<Record<string, number>>({})

  // Search on any filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, 300)
    return () => clearTimeout(timer)
  }, [query, selectedGenre, availableOnly])

  // Load all artists on first mount
  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = async () => {
    setLoading(true)

    let q = supabase.from("profiles").select("*")

    // Text search across name, location, bio, skills
    if (query.trim()) {
      q = q.or(
        `name.ilike.%${query}%,location.ilike.%${query}%,bio.ilike.%${query}%,skills.ilike.%${query}%`
      )
    }

    // Genre filter
    if (selectedGenre !== "All") {
      q = q.or(`genre.ilike.%${selectedGenre}%,creative_field.ilike.%${selectedGenre}%`)
    }

    // Availability filter
    if (availableOnly) {
      q = q.eq("available", true)
    }

    const { data } = await q.order("name")
    const results = data || []
    setArtists(results)
    setSearched(true)

    // Fetch track counts for each artist
    if (results.length > 0) {
      const ids = results.map((a: any) => a.id)
      const { data: tracks } = await supabase
        .from("tracks")
        .select("creator_id")
        .in("creator_id", ids)

      const counts: Record<string, number> = {}
      tracks?.forEach((t: any) => {
        counts[t.creator_id] = (counts[t.creator_id] || 0) + 1
      })
      setTrackCounts(counts)
    }

    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .sp { background: #080808; min-height: 100vh; color: #fff; font-family: 'DM Sans', sans-serif; padding: 48px 24px 80px; }
        .sp-syne { font-family: 'Syne', sans-serif; }
        .sp-search { width: 100%; background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 14px; padding: 16px 20px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 16px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .sp-search:focus { border-color: #d4af37; }
        .sp-search::placeholder { color: #333; }
        .genre-pill { padding: 8px 18px; border: 1px solid #1f1f1f; border-radius: 999px; font-size: 13px; color: #666; cursor: pointer; background: transparent; font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .genre-pill:hover { border-color: #333; color: #aaa; }
        .genre-pill.sel { border-color: #d4af37; color: #d4af37; background: rgba(212,175,55,0.06); }
        .artist-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 22px; text-decoration: none; color: inherit; display: block; transition: border-color 0.2s, transform 0.2s; }
        .artist-card:hover { border-color: rgba(212,175,55,0.4); transform: translateY(-3px); }
        .av { width: 52px; height: 52px; border-radius: 50%; border: 2px solid #d4af37; overflow: hidden; background: #1a1a1a; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: #d4af37; font-family: 'Syne', sans-serif; flex-shrink: 0; }
        .genre-tag { font-size: 11px; color: #d4af37; border: 1px solid rgba(212,175,55,0.25); padding: 3px 10px; border-radius: 999px; }
        .avail-badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #4ade80; padding: 3px 10px; border-radius: 999px; font-size: 11px; }
        .avail-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .toggle-btn { display: flex; align-items: center; gap: 8px; background: transparent; border: 1px solid #1f1f1f; border-radius: 999px; padding: 8px 16px; color: #666; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .toggle-btn.active { border-color: #4ade80; color: #4ade80; background: rgba(34,197,94,0.06); }
        .toggle-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
        .empty { border: 1px dashed #1a1a1a; border-radius: 16px; padding: 60px 24px; text-align: center; color: #333; }
        .stat-chip { font-size: 11px; color: #444; display: flex; align-items: center; gap: 4px; }
        .book-btn { display: inline-block; background: #d4af37; color: #000; font-weight: 600; font-size: 12px; font-family: 'DM Sans', sans-serif; padding: 7px 14px; border-radius: 999px; text-decoration: none; transition: opacity 0.2s; margin-left: auto; }
        .book-btn:hover { opacity: 0.85; }
        .spinner { width: 20px; height: 20px; border: 2px solid #1f1f1f; border-top-color: #d4af37; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="sp">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4af37", margin: "0 0 10px" }}>
              Find talent
            </p>
            <h1 className="sp-syne" style={{ fontSize: 34, fontWeight: 800, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              Search Artists
            </h1>

            {/* Search bar */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <svg style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#444" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="sp-search"
                style={{ paddingLeft: 48 }}
                placeholder="Search by name, location, skills..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            {/* Filters row */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {/* Genre pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
                {GENRES.map(g => (
                  <button
                    key={g}
                    className={`genre-pill${selectedGenre === g ? " sel" : ""}`}
                    onClick={() => setSelectedGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Available only toggle */}
              <button
                className={`toggle-btn${availableOnly ? " active" : ""}`}
                onClick={() => setAvailableOnly(!availableOnly)}
              >
                <span className="toggle-dot" />
                Available only
              </button>
            </div>
          </div>

          {/* Results header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            {searched && !loading && (
              <p style={{ fontSize: 13, color: "#444", margin: 0 }}>
                {artists.length === 0
                  ? "No artists found"
                  : `${artists.length} artist${artists.length === 1 ? "" : "s"} found`
                }
              </p>
            )}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="spinner" />
                <span style={{ fontSize: 13, color: "#444" }}>Searching...</span>
              </div>
            )}
          </div>

          {/* Results grid */}
          {!loading && artists.length === 0 && searched ? (
            <div className="empty">
              <p style={{ fontSize: 18, marginBottom: 8 }}>No artists found</p>
              <p style={{ fontSize: 13 }}>
                {query || selectedGenre !== "All"
                  ? "Try a different search or remove some filters"
                  : "No artists have set up profiles yet"
                }
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
              {artists.map(artist => (
                <Link key={artist.id} href={`/artists/${artist.id}`} className="artist-card">

                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div className="av">
                      {artist.avatar_url
                        ? <img src={artist.avatar_url} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : artist.name?.[0]?.toUpperCase() || "A"
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 2px", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {artist.name}
                      </p>
                      <p style={{ fontSize: 12, color: "#555", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {artist.location || "Location not set"}
                      </p>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  {artist.bio && (
                    <p style={{ fontSize: 13, color: "#555", margin: "0 0 14px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {artist.bio}
                    </p>
                  )}

                  {/* Tags row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {(artist.genre || artist.creative_field) && (
                      <span className="genre-tag">{artist.genre || artist.creative_field}</span>
                    )}
                    {artist.available !== false && (
                      <span className="avail-badge"><span className="avail-dot" />Available</span>
                    )}
                  </div>

                  {/* Bottom row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #151515", paddingTop: 12 }}>
                    <div style={{ display: "flex", gap: 14 }}>
                      {trackCounts[artist.id] > 0 && (
                        <span className="stat-chip">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                          {trackCounts[artist.id]} track{trackCounts[artist.id] !== 1 ? "s" : ""}
                        </span>
                      )}
                      {artist.price_range && (
                        <span className="stat-chip">
                          From {artist.price_range}
                        </span>
                      )}
                    </div>
                    <span className="book-btn" onClick={e => e.preventDefault() /* handled by parent Link */}>
                      View →
                    </span>
                  </div>

                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
