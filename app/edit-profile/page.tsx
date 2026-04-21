"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/libs/supabase"

const GENRES = ["Afrobeats", "Hip-Hop", "R&B", "Amapiano", "Gospel", "Pop", "Jazz", "Drill", "Highlife", "Reggae", "Soul", "Other"]

export default function EditProfilePage() {

  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"info" | "images" | "booking">("info")

  const [form, setForm] = useState({
    name: "",
    genre: "",
    location: "",
    bio: "",
    skills: "",
    price_range: "",
    available: true,
  })

  const [avatar, setAvatar] = useState<File | null>(null)
  const [banner, setBanner] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)
  const [currentBanner, setCurrentBanner] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setUserId(user.id)

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile) {
        setForm({
          name: profile.name || "",
          genre: profile.genre || profile.creative_field || "",
          location: profile.location || "",
          bio: profile.bio || "",
          skills: profile.skills || "",
          price_range: profile.price_range || "",
          available: profile.available !== false,
        })
        setCurrentAvatar(profile.avatar_url || null)
        setCurrentBanner(profile.banner_url || null)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBanner(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!userId) return
    if (!form.name) return alert("Name is required")
    setSaving(true)

    let avatar_url = currentAvatar
    let banner_url = currentBanner

    // Upload new avatar if selected
    if (avatar) {
      const { error } = await supabase.storage
        .from("avatars")
        .upload(`${userId}.png`, avatar, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(`${userId}.png`)
        avatar_url = data.publicUrl + `?t=${Date.now()}`
      }
    }

    // Upload new banner if selected
    if (banner) {
      const { error } = await supabase.storage
        .from("banners")
        .upload(`${userId}.png`, banner, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from("banners").getPublicUrl(`${userId}.png`)
        banner_url = data.publicUrl + `?t=${Date.now()}`
      }
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name,
        genre: form.genre,
        creative_field: form.genre,
        location: form.location,
        bio: form.bio,
        skills: form.skills,
        price_range: form.price_range,
        available: form.available,
        ...(avatar_url ? { avatar_url } : {}),
        ...(banner_url ? { banner_url } : {}),
      })
      .eq("id", userId)

    if (error) {
      alert(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#444", fontFamily: "'DM Sans',sans-serif" }}>Loading...</p>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .ep { background: #080808; min-height: 100vh; color: #fff; font-family: 'DM Sans', sans-serif; padding: 48px 24px 80px; }
        .ep-syne { font-family: 'Syne', sans-serif; }
        .ep-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; padding: 32px; max-width: 600px; }
        .ep-input { width: 100%; background: #080808; border: 1px solid #1f1f1f; border-radius: 10px; padding: 12px 16px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .ep-input:focus { border-color: #d4af37; }
        .ep-input::placeholder { color: #333; }
        .ep-label { display: block; font-size: 11px; color: #555; margin-bottom: 6px; letter-spacing: 0.09em; text-transform: uppercase; }
        .ep-save { background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 13px 32px; border-radius: 12px; border: none; cursor: pointer; transition: opacity 0.2s; }
        .ep-save:hover:not(:disabled) { opacity: 0.85; }
        .ep-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .ep-save.saved { background: #22c55e; }
        .ep-ghost { background: transparent; border: 1px solid #222; color: #666; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px 24px; border-radius: 12px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .ep-ghost:hover { border-color: #444; color: #aaa; }
        .genre-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .genre-btn { padding: 9px 8px; border: 1px solid #1f1f1f; border-radius: 10px; font-size: 12px; color: #666; cursor: pointer; text-align: center; transition: all 0.2s; background: transparent; font-family: 'DM Sans', sans-serif; }
        .genre-btn:hover { border-color: #333; color: #aaa; }
        .genre-btn.sel { border-color: #d4af37; color: #d4af37; background: rgba(212,175,55,0.06); }
        .tab { background: transparent; border: none; color: #555; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; padding: 9px 18px; border-radius: 999px; cursor: pointer; transition: all 0.2s; }
        .tab.active { background: #1a1a1a; color: #fff; }
        .img-upload { border: 1px dashed #222; border-radius: 12px; cursor: pointer; position: relative; transition: border-color 0.2s; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .img-upload:hover { border-color: #d4af37; }
        .img-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .toggle-wrap { display: flex; align-items: center; gap: 14px; cursor: pointer; }
        .toggle-track { width: 44px; height: 24px; border-radius: 999px; background: #1f1f1f; border: 1px solid #2a2a2a; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .toggle-track.on { background: rgba(212,175,55,0.15); border-color: #d4af37; }
        .toggle-thumb { width: 18px; height: 18px; border-radius: 50%; background: #333; position: absolute; top: 2px; left: 2px; transition: all 0.25s; }
        .toggle-thumb.on { background: #d4af37; transform: translateX(20px); }
        .success-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #22c55e; color: #000; font-weight: 600; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px 24px; border-radius: 999px; z-index: 999; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .divider { border: none; border-top: 1px solid #111; margin: 28px 0; }
      `}</style>

      {saved && <div className="success-toast">✓ Profile saved</div>}

      <div className="ep">
        <div style={{ maxWidth: 600, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="ep-syne" style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                Edit Profile
              </h1>
              <p style={{ color: "#555", fontSize: 13, margin: 0 }}>
                Changes are visible to bookers and fans immediately
              </p>
            </div>
            {userId && (
              <a href={`/artists/${userId}`} className="ep-ghost" style={{ fontSize: 13 }}>
                View public profile →
              </a>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#0a0a0a", padding: 4, borderRadius: 999, width: "fit-content", border: "1px solid #111" }}>
            {(["info", "images", "booking"] as const).map(tab => (
              <button
                key={tab}
                className={`tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "info" ? "Info" : tab === "images" ? "Photos" : "Booking"}
              </button>
            ))}
          </div>

          <div className="ep-card">

            {/* ── INFO TAB ── */}
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                <div>
                  <label className="ep-label">Artist Name *</label>
                  <input
                    className="ep-input"
                    placeholder="Your stage name"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="ep-label">Genre</label>
                  <div className="genre-grid">
                    {GENRES.map(g => (
                      <button
                        key={g}
                        className={`genre-btn${form.genre === g ? " sel" : ""}`}
                        onClick={() => set("genre", g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="ep-label">Location</label>
                  <input
                    className="ep-input"
                    placeholder="Lagos, Nigeria"
                    value={form.location}
                    onChange={e => set("location", e.target.value)}
                  />
                </div>

                <div>
                  <label className="ep-label">Bio</label>
                  <textarea
                    className="ep-input"
                    placeholder="Tell bookers and fans who you are..."
                    rows={4}
                    value={form.bio}
                    onChange={e => set("bio", e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div>
                  <label className="ep-label">Skills / Style Tags</label>
                  <input
                    className="ep-input"
                    placeholder="e.g. Live performer, songwriter, producer"
                    value={form.skills}
                    onChange={e => set("skills", e.target.value)}
                  />
                  <p style={{ fontSize: 11, color: "#444", margin: "5px 0 0" }}>Separate with commas</p>
                </div>

              </div>
            )}

            {/* ── IMAGES TAB ── */}
            {activeTab === "images" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Avatar */}
                <div>
                  <label className="ep-label">Profile Photo</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "2px solid #d4af37", background: "#1a1a1a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#d4af37", fontFamily: "'Syne',sans-serif" }}>
                      {(avatarPreview || currentAvatar)
                        ? <img src={avatarPreview || currentAvatar!} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : form.name?.[0]?.toUpperCase() || "A"
                      }
                    </div>
                    <div className="img-upload" style={{ flex: 1, padding: "20px", flexDirection: "column", gap: 4 }}>
                      <input type="file" accept="image/*" onChange={handleAvatarChange} />
                      <p style={{ fontSize: 14, color: "#555", margin: 0 }}>Click to change photo</p>
                      <p style={{ fontSize: 12, color: "#333", margin: 0 }}>Square image, min 400×400px</p>
                    </div>
                  </div>
                </div>

                <hr className="divider" style={{ margin: "4px 0" }} />

                {/* Banner */}
                <div>
                  <label className="ep-label">Banner Image</label>
                  <div className="img-upload" style={{ width: "100%", height: 160, flexDirection: "column", gap: 6 }}>
                    <input type="file" accept="image/*" onChange={handleBannerChange} />
                    {(bannerPreview || currentBanner) ? (
                      <img
                        src={bannerPreview || currentBanner!}
                        alt="banner"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <>
                        <p style={{ fontSize: 14, color: "#555", margin: 0 }}>Click to upload banner</p>
                        <p style={{ fontSize: 12, color: "#333", margin: 0 }}>Wide image, 1500×500px recommended</p>
                      </>
                    )}
                  </div>
                  {(bannerPreview || currentBanner) && (
                    <button
                      onClick={() => { setBanner(null); setBannerPreview(null) }}
                      style={{ marginTop: 8, background: "none", border: "1px solid #222", color: "#555", fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: "5px 12px", borderRadius: 8, cursor: "pointer" }}
                    >
                      Remove banner
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* ── BOOKING TAB ── */}
            {activeTab === "booking" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                <div>
                  <label className="ep-label">Starting Price</label>
                  <input
                    className="ep-input"
                    placeholder="e.g. ₦150,000 or $500"
                    value={form.price_range}
                    onChange={e => set("price_range", e.target.value)}
                  />
                  <p style={{ fontSize: 11, color: "#444", margin: "6px 0 0", lineHeight: 1.5 }}>
                    This appears on your profile so bookers know what to expect. You can always negotiate.
                  </p>
                </div>

                <hr className="divider" style={{ margin: "4px 0" }} />

                {/* Availability toggle */}
                <div>
                  <label className="ep-label" style={{ marginBottom: 14 }}>Availability</label>
                  <div className="toggle-wrap" onClick={() => set("available", !form.available)}>
                    <div className={`toggle-track${form.available ? " on" : ""}`}>
                      <div className={`toggle-thumb${form.available ? " on" : ""}`} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 2px", color: form.available ? "#fff" : "#555" }}>
                        {form.available ? "Available for bookings" : "Not available right now"}
                      </p>
                      <p style={{ fontSize: 12, color: "#444", margin: 0 }}>
                        {form.available
                          ? "Bookers can send you requests"
                          : "Your profile is still visible, booking is paused"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="divider" style={{ margin: "4px 0" }} />

                {/* Preview of what bookers see */}
                <div style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 12, padding: "16px 18px" }}>
                  <p style={{ fontSize: 11, color: "#444", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    What bookers see on your profile
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Starting From", value: form.price_range || "Not set" },
                      { label: "Status",         value: form.available ? "Available for bookings" : "Not available" },
                      { label: "Genre",          value: form.genre || "Not set" },
                      { label: "Location",       value: form.location || "Not set" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, color: "#555" }}>{item.label}</span>
                        <span style={{ fontSize: 13, color: item.value.includes("Not") ? "#333" : "#aaa" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Save button */}
          <div style={{ display: "flex", gap: 12, marginTop: 24, alignItems: "center" }}>
            <button
              className={`ep-save${saved ? " saved" : ""}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
            </button>
            {userId && (
              <a href={`/artists/${userId}`} className="ep-ghost">
                View profile
              </a>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
