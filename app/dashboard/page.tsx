"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"
import Link from "next/link"

export default function Dashboard() {

  const [user, setUser] = useState<any>(null)
  const [trackCount, setTrackCount] = useState(0)
  const [bookings, setBookings] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "bookings">("overview")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { count } = await supabase
        .from("tracks")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", user.id)
      setTrackCount(count || 0)

      const { data: bookingData } = await supabase
        .from("booking_requests")
        .select("*")
        .eq("artist_id", user.id)
        .order("created_at", { ascending: false })
      setBookings(bookingData || [])
    }
    load()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const { error } = await supabase
      .from("booking_requests")
      .update({ status })
      .eq("id", id)
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    }
    setUpdating(null)
  }

  const pending  = bookings.filter(b => b.status === "pending")
  const accepted = bookings.filter(b => b.status === "accepted")

  const statusBg:   Record<string, string> = { pending: "rgba(212,175,55,0.12)", accepted: "rgba(34,197,94,0.1)",  declined: "rgba(239,68,68,0.08)" }
  const statusColor: Record<string, string> = { pending: "#d4af37",              accepted: "#4ade80",              declined: "#f87171" }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .db { background: #080808; min-height: 100vh; color: #fff; font-family: 'DM Sans', sans-serif; padding: 48px 24px 80px; }
        .db-syne { font-family: 'Syne', sans-serif; }
        .db-stat { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 14px; padding: 20px 22px; }
        .db-stat-num { font-size: 30px; font-weight: 800; font-family: 'Syne', sans-serif; color: #d4af37; margin: 0 0 4px; }
        .db-stat-label { font-size: 11px; color: #555; letter-spacing: 0.1em; text-transform: uppercase; margin: 0; }
        .db-tab { background: transparent; border: none; color: #555; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; padding: 9px 18px; border-radius: 999px; cursor: pointer; transition: all 0.2s; }
        .db-tab.active { background: #1a1a1a; color: #fff; }
        .bcard { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 20px 22px; }
        .bstatus { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 11px; border-radius: 999px; letter-spacing: 0.06em; text-transform: uppercase; }
        .btn-accept { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); color: #4ade80; font-family: 'DM Sans',sans-serif; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
        .btn-accept:hover { background: rgba(34,197,94,0.18); }
        .btn-decline { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; font-family: 'DM Sans',sans-serif; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
        .btn-decline:hover { background: rgba(239,68,68,0.14); }
        .btn-gold { display: inline-block; background: #d4af37; color: #000; font-weight: 600; font-family: 'DM Sans',sans-serif; font-size: 14px; padding: 10px 22px; border-radius: 999px; text-decoration: none; transition: opacity 0.2s; }
        .btn-gold:hover { opacity: 0.85; }
        .btn-ghost { display: inline-block; border: 1px solid #222; color: #777; font-family: 'DM Sans',sans-serif; font-size: 14px; padding: 10px 22px; border-radius: 999px; text-decoration: none; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #444; color: #aaa; }
        .qa-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 14px; padding: 18px 20px; text-decoration: none; color: inherit; display: block; transition: border-color 0.2s; }
        .qa-card:hover { border-color: #2a2a2a; }
        .divider { border: none; border-top: 1px solid #111; margin: 32px 0; }
        .empty { border: 1px dashed #1a1a1a; border-radius: 14px; padding: 48px 24px; text-align: center; color: #333; }
      `}</style>

      <div className="db">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="db-syne" style={{ fontSize: 30, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Dashboard</h1>
              <p style={{ color: "#444", fontSize: 13, margin: 0 }}>{user?.email}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/upload-track" className="btn-ghost">Upload Track</Link>
              <Link href={`/artists/${user?.id}`} className="btn-gold">View Profile</Link>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10, marginBottom: 36 }}>
            {[
              { num: trackCount,       label: "Tracks" },
              { num: pending.length,   label: "Pending Bookings" },
              { num: accepted.length,  label: "Confirmed" },
              { num: bookings.length,  label: "Total Requests" },
            ].map((s, i) => (
              <div key={i} className="db-stat">
                <p className="db-stat-num">{s.num}</p>
                <p className="db-stat-label">{s.label}</p>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#0a0a0a", padding: 4, borderRadius: 999, width: "fit-content", border: "1px solid #111" }}>
            <button className={`db-tab${activeTab === "overview" ? " active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
            <button className={`db-tab${activeTab === "bookings" ? " active" : ""}`} onClick={() => setActiveTab("bookings")}>
              Booking Requests{pending.length > 0 ? ` (${pending.length})` : ""}
            </button>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              <h2 className="db-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Quick Actions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 10 }}>
                {[
                  { label: "Upload a Track",      desc: "Add new music to your profile",    href: "/upload-track" },
                  { label: "Edit Profile",         desc: "Update bio, genre and pricing",    href: "/edit-profile" },
                  { label: "View Public Profile",  desc: "See how bookers see you",          href: `/artists/${user?.id}` },
                  { label: "Browse Opportunities", desc: "Find gigs looking for artists",    href: "/opportunities" },
                ].map((item, i) => (
                  <Link key={i} href={item.href} className="qa-card">
                    <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 3px", color: "#fff" }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: "#555", margin: 0 }}>{item.desc}</p>
                  </Link>
                ))}
              </div>

              {pending.length > 0 && (
                <>
                  <hr className="divider" />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h2 className="db-syne" style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>New Requests</h2>
                    <button style={{ background: "none", border: "none", color: "#d4af37", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }} onClick={() => setActiveTab("bookings")}>
                      See all →
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {pending.slice(0, 2).map(b => (
                      <div key={b.id} className="bcard" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 2px" }}>{b.requester_name}</p>
                          <p style={{ fontSize: 12, color: "#555", margin: 0 }}>{b.event_type} · {b.event_location} · {b.event_date}</p>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn-accept" onClick={() => updateStatus(b.id, "accepted")} disabled={updating === b.id}>Accept</button>
                          <button className="btn-decline" onClick={() => updateStatus(b.id, "declined")} disabled={updating === b.id}>Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === "bookings" && (
            <div>
              {bookings.length === 0 ? (
                <div className="empty">
                  <p style={{ fontSize: 16, marginBottom: 8 }}>No booking requests yet</p>
                  <p style={{ fontSize: 13 }}>Share your profile link to start getting booked</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {bookings.map(b => (
                    <div key={b.id} className="bcard">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                            <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>{b.requester_name}</p>
                            <span className="bstatus" style={{ background: statusBg[b.status] || "#1a1a1a", color: statusColor[b.status] || "#666" }}>
                              {b.status}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, color: "#555", margin: 0 }}>{b.requester_email}</p>
                        </div>
                        <p style={{ fontSize: 12, color: "#333", margin: 0 }}>
                          {new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 12, marginBottom: b.message ? 14 : 0 }}>
                        {[
                          { label: "Event",    value: b.event_type },
                          { label: "Date",     value: b.event_date },
                          { label: "Location", value: b.event_location },
                          { label: "Budget",   value: b.budget || "Not specified" },
                        ].map((item, i) => (
                          <div key={i}>
                            <p style={{ fontSize: 11, color: "#444", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</p>
                            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {b.message && (
                        <p style={{ fontSize: 13, color: "#666", background: "#0a0a0a", padding: "10px 14px", borderRadius: 10, margin: "0 0 14px", lineHeight: 1.65 }}>
                          "{b.message}"
                        </p>
                      )}

                      {b.status === "pending" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn-accept" onClick={() => updateStatus(b.id, "accepted")} disabled={updating === b.id}>
                            {updating === b.id ? "..." : "Accept"}
                          </button>
                          <button className="btn-decline" onClick={() => updateStatus(b.id, "declined")} disabled={updating === b.id}>
                            {updating === b.id ? "..." : "Decline"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
