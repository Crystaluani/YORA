"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"
import Link from "next/link"

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase.from("profiles").select("*")
      if (data) setArtists(data)
    }
    fetchArtists()
  }, [])

  const filtered = artists.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.genre?.toLowerCase().includes(search.toLowerCase()) ||
    a.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        .al { background: #080808; min-height: 100vh; color: #fff; font-family: 'DM Sans', sans-serif; padding: 60px 24px 80px; }
        .al-syne { font-family: 'Syne', sans-serif; }
        .al-search { width: 100%; background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 12px; padding: 14px 18px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .al-search:focus { border-color: #d4af37; }
        .al-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 24px; text-decoration: none; color: inherit; display: block; transition: border-color 0.2s, transform 0.2s; }
        .al-card:hover { border-color: #d4af37; transform: translateY(-3px); }
        .al-avatar { width: 56px; height: 56px; border-radius: 50%; border: 2px solid #d4af37; overflow: hidden; background: #1a1a1a; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; font-family: 'Syne', sans-serif; color: #d4af37; flex-shrink: 0; }
        .al-badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #4ade80; padding: 3px 10px; border-radius: 999px; font-size: 11px; }
        .al-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; }
        .genre-tag { font-size: 11px; color: #d4af37; border: 1px solid rgba(212,175,55,0.3); padding: 3px 10px; border-radius: 999px; }
      `}</style>

      <div className="al">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4af37", marginBottom: 10 }}>
              Discover
            </p>
            <h1 className="al-syne" style={{ fontSize: 36, fontWeight: 800, margin: "0 0 28px", letterSpacing: "-0.02em" }}>
              Artists
            </h1>
            <input
              className="al-search"
              placeholder="Search by name, genre or location..."
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div style={{ border: "1px dashed #1a1a1a", borderRadius: 16, padding: "60px 24px", textAlign: "center", color: "#333" }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>No artists yet</p>
              <p style={{ fontSize: 13 }}>Be the first to create a profile</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 16 }}>
              {filtered.map(artist => (
                <Link key={artist.id} href={`/artists/${artist.id}`} className="al-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div className="al-avatar">
                      {artist.avatar_url
                        ? <img src={artist.avatar_url} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : artist.name?.[0]?.toUpperCase()
                      }
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 3px" }}>{artist.name}</p>
                      <p style={{ fontSize: 12, color: "#555", margin: 0 }}>{artist.location || "Location not set"}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {artist.genre
                      ? <span className="genre-tag">{artist.genre}</span>
                      : <span />
                    }
                    {artist.available !== false && (
                      <span className="al-badge"><span className="al-dot" />Available</span>
                    )}
                  </div>

                  {artist.price_range && (
                    <p style={{ fontSize: 12, color: "#444", margin: "12px 0 0" }}>
                      From {artist.price_range}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}