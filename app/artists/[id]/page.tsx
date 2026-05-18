"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/libs/supabase"
import AudioPlayer from "@/components/AudioPlayer"

export default function ArtistProfilePage() {

  const params = useParams()
  const id = params?.id as string

  const [artist, setArtist] = useState<any>(null)
  const [tracks, setTracks] = useState<any[]>([])
  const [likeCount, setLikeCount] = useState(0)
  const [showBooking, setShowBooking] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    requester_name: "", requester_email: "", event_date: "",
    event_location: "", event_type: "", budget: "", message: ""
  })

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setPageLoading(true)
      const { data: artistData, error } = await supabase
        .from("profiles").select("*").eq("id", id).single()
      if (error || !artistData) { setNotFound(true); setPageLoading(false); return }
      setArtist(artistData)

      const { data: trackData } = await supabase
        .from("tracks").select("*").eq("creator_id", id).order("created_at", { ascending: false })
      setTracks(trackData || [])

      if (trackData && trackData.length > 0) {
        const { count } = await supabase
          .from("track_likes").select("*", { count: "exact", head: true })
          .in("track_id", trackData.map((t: any) => t.id))
        setLikeCount(count || 0)
      }
      setPageLoading(false)
    }
    load()
  }, [id])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: `${artist.name} on YORA`, url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleBooking = async () => {
    if (!form.requester_name || !form.requester_email || !form.event_date || !form.event_location || !form.event_type) {
      alert("Please fill in all required fields"); return
    }
    setLoading(true)

    // 1. Save booking to DB
    const { error } = await supabase.from("booking_requests").insert({ artist_id: id, ...form })
    if (error) { alert(error.message); setLoading(false); return }

    // 2. Save notification in DB
    await supabase.from("notifications").insert({
      user_id: artist.id, type: "booking",
      message: `New booking request from ${form.requester_name} for ${form.event_type}`,
      link: "/dashboard"
    })

    // 3. Get artist email from auth (via API)
    const { data: { user } } = await supabase.auth.getUser()

    // 4. Send email notification to artist
    try {
      await fetch("/api/notify-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistEmail: artist.email || `${artist.id}@yora.placeholder`,
          artistName: artist.name,
          requesterName: form.requester_name,
          requesterEmail: form.requester_email,
          eventType: form.event_type,
          eventDate: form.event_date,
          eventLocation: form.event_location,
          budget: form.budget,
          message: form.message,
        })
      })
    } catch (e) {
      // Email failed silently — booking still saved
      console.error("Email send failed:", e)
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (pageLoading) return (
    <div style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: "2px solid #1f1f1f", borderTopColor: "#d4af37", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#444", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>Loading profile...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (notFound) return (
    <div style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#d4af37", fontFamily: "'Syne',sans-serif", fontSize: 48, fontWeight: 800, margin: "0 0 12px" }}>404</p>
        <p style={{ color: "#555", fontFamily: "'DM Sans',sans-serif", fontSize: 16 }}>Artist not found</p>
        <a href="/artists" style={{ color: "#d4af37", fontFamily: "'DM Sans',sans-serif", fontSize: 14, display: "block", marginTop: 16 }}>← Browse artists</a>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .ap { background: #080808; min-height: 100vh; color: #fff; font-family: 'DM Sans', sans-serif; }
        .ap-syne { font-family: 'Syne', sans-serif; }
        .ap-stat { text-align: center; padding: 16px 12px; border: 1px solid #1f1f1f; border-radius: 12px; background: #0f0f0f; }
        .ap-stat-num { font-size: 22px; font-weight: 700; font-family: 'Syne', sans-serif; color: #d4af37; margin: 0; }
        .ap-stat-label { font-size: 10px; color: #555; margin-top: 4px; letter-spacing: 0.1em; text-transform: uppercase; }
        .ap-track { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; transition: border-color 0.2s; }
        .ap-track:hover { border-color: #2a2a2a; }
        .ap-book-btn { background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans',sans-serif; font-size: 15px; padding: 12px 26px; border-radius: 999px; border: none; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; }
        .ap-book-btn:hover { opacity: 0.85; }
        .ap-share-btn { background: transparent; border: 1px solid #222; color: #666; font-family: 'DM Sans',sans-serif; font-size: 13px; padding: 10px 18px; border-radius: 999px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
        .ap-share-btn:hover { border-color: #d4af37; color: #d4af37; }
        .ap-share-btn.copied { border-color: #4ade80; color: #4ade80; }
        .ap-pill { display: inline-block; padding: 4px 14px; border: 1px solid #2a2a2a; border-radius: 999px; font-size: 12px; color: #666; }
        .ap-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); color: #4ade80; padding: 4px 12px; border-radius: 999px; font-size: 12px; }
        .ap-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .genre-tag { font-size: 11px; color: #d4af37; border: 1px solid rgba(212,175,55,0.3); padding: 3px 10px; border-radius: 999px; flex-shrink: 0; }
        .divider { border: none; border-top: 1px solid #151515; margin: 0; }
        .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .modal-box { background: #111; border: 1px solid #1f1f1f; border-radius: 20px; padding: 28px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-input { width: 100%; background: #0a0a0a; border: 1px solid #222; border-radius: 10px; padding: 11px 14px; color: #fff; font-family: 'DM Sans',sans-serif; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .modal-input:focus { border-color: #d4af37; }
        .modal-label { display: block; font-size: 11px; color: #555; margin-bottom: 5px; letter-spacing: 0.08em; text-transform: uppercase; }
        .modal-submit { width: 100%; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans',sans-serif; font-size: 15px; padding: 14px; border-radius: 12px; border: none; cursor: pointer; transition: opacity 0.2s; }
        .modal-submit:hover { opacity: 0.85; }
        .modal-cancel { width: 100%; background: transparent; border: 1px solid #222; color: #555; font-family: 'DM Sans',sans-serif; font-size: 14px; padding: 12px; border-radius: 12px; cursor: pointer; margin-top: 10px; }
        .modal-cancel:hover { border-color: #444; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 480px) {
          .two-col { grid-template-columns: 1fr; }
          .ap-book-btn { font-size: 14px; padding: 11px 20px; }
          .modal-box { padding: 20px 16px; }
        }
      `}</style>

      <div className="ap">

        {/* BANNER */}
        <div style={{ width: "100%", height: 200, background: "#111", overflow: "hidden" }}>
          {artist.banner_url
            ? <img src={artist.banner_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
            : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)" }} />
          }
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>

          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: -40, marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid #d4af37", overflow: "hidden", background: "#1a1a1a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: "#d4af37" }}>
                {artist.avatar_url
                  ? <img src={artist.avatar_url} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : artist.name?.[0]?.toUpperCase()
                }
              </div>
              <div style={{ paddingBottom: 4 }}>
                <h1 className="ap-syne" style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{artist.name}</h1>
                <p style={{ color: "#555", fontSize: 13, margin: "0 0 8px" }}>
                  {artist.genre || artist.creative_field || "Artist"}{artist.location ? ` · ${artist.location}` : ""}
                </p>
                {artist.available !== false && (
                  <span className="ap-badge"><span className="ap-dot" />Available for bookings</span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button className={`ap-share-btn${copied ? " copied" : ""}`} onClick={handleShare}>
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    Share
                  </>
                )}
              </button>
              <button className="ap-book-btn" onClick={() => setShowBooking(true)}>Book Artist</button>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>
            <div className="ap-stat"><p className="ap-stat-num">{tracks.length}</p><p className="ap-stat-label">Tracks</p></div>
            <div className="ap-stat"><p className="ap-stat-num">{likeCount}</p><p className="ap-stat-label">Total Likes</p></div>
            <div className="ap-stat"><p className="ap-stat-num">{artist.price_range || "—"}</p><p className="ap-stat-label">Starting From</p></div>
          </div>

          {/* BIO */}
          {artist.bio && <p style={{ color: "#777", lineHeight: 1.8, fontSize: 15, maxWidth: 600, marginBottom: 22 }}>{artist.bio}</p>}

          {/* SKILLS */}
          {artist.skills && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {artist.skills.split(",").map((s: string, i: number) => (
                <span key={i} className="ap-pill">{s.trim()}</span>
              ))}
            </div>
          )}

          <hr className="divider" style={{ marginBottom: 28 }} />

          {/* TRACKS */}
          <div style={{ marginBottom: 80 }}>
            <h2 className="ap-syne" style={{ fontSize: 19, fontWeight: 700, marginBottom: 16 }}>
              Tracks {tracks.length > 0 ? `(${tracks.length})` : ""}
            </h2>

            {tracks.length === 0 ? (
              <div style={{ border: "1px dashed #1f1f1f", borderRadius: 14, padding: "40px 24px", textAlign: "center", color: "#333" }}>
                No tracks uploaded yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tracks.map((track: any) => (
                  <div key={track.id} className="ap-track">
                    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
                      <img
                        src={track.image_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200"}
                        alt={track.title}
                        style={{ width: 50, height: 50, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 15, margin: 0, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</p>
                        <p style={{ fontSize: 12, color: "#555", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{track.genre || "Music"}</p>
                      </div>
                      {track.genre && <span className="genre-tag">{track.genre}</span>}
                    </div>
                    {track.audio_url && (
                      <div style={{ padding: "0 16px 14px" }}>
                        <AudioPlayer url={track.audio_url} title={track.title} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showBooking && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setShowBooking(false) }}>
          <div className="modal-box">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3 className="ap-syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Request Sent!</h3>
                <p style={{ color: "#555", lineHeight: 1.7, marginBottom: 24 }}>
                  Your booking request has been sent to {artist.name}. They'll be in touch via email soon.
                </p>
                <button className="modal-cancel" onClick={() => { setShowBooking(false); setSubmitted(false) }}>Close</button>
              </div>
            ) : (
              <>
                <h3 className="ap-syne" style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Book {artist.name}</h3>
                <p style={{ color: "#555", fontSize: 13, marginBottom: 22 }}>Fill in your details and {artist.name} will get back to you.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  <div className="two-col">
                    <div>
                      <label className="modal-label">Your Name *</label>
                      <input className="modal-input" placeholder="John Doe" value={form.requester_name} onChange={e => setForm({ ...form, requester_name: e.target.value })} />
                    </div>
                    <div>
                      <label className="modal-label">Email *</label>
                      <input className="modal-input" type="email" placeholder="you@email.com" value={form.requester_email} onChange={e => setForm({ ...form, requester_email: e.target.value })} />
                    </div>
                  </div>
                  <div className="two-col">
                    <div>
                      <label className="modal-label">Event Date *</label>
                      <input className="modal-input" type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
                    </div>
                    <div>
                      <label className="modal-label">Event Type *</label>
                      <select className="modal-input" value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })} style={{ cursor: "pointer" }}>
                        <option value="">Select type</option>
                        <option>Concert / Show</option>
                        <option>Club Night</option>
                        <option>Private Event</option>
                        <option>Corporate Event</option>
                        <option>Festival</option>
                        <option>Wedding</option>
                        <option>Online / Virtual</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="modal-label">Location *</label>
                    <input className="modal-input" placeholder="Lagos, Nigeria" value={form.event_location} onChange={e => setForm({ ...form, event_location: e.target.value })} />
                  </div>
                  <div>
                    <label className="modal-label">Budget (optional)</label>
                    <input className="modal-input" placeholder="e.g. ₦200,000 – ₦500,000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
                  </div>
                  <div>
                    <label className="modal-label">Message (optional)</label>
                    <textarea className="modal-input" placeholder="Tell the artist about your event..." rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: "vertical" }} />
                  </div>
                  <button className="modal-submit" onClick={handleBooking} disabled={loading}>
                    {loading ? "Sending..." : "Send Booking Request"}
                  </button>
                  <button className="modal-cancel" onClick={() => setShowBooking(false)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
