"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/libs/supabase"

const GENRES = ["Afrobeats", "Hip-Hop", "R&B", "Amapiano", "Gospel", "Pop", "Jazz", "Drill", "Highlife", "Reggae", "Soul", "Other"]

export default function ProfileSetup() {

  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.name || !form.genre) {
      alert("Please fill in your name and genre")
      return
    }
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) { setLoading(false); return }

    let avatar_url = null

    // Upload avatar if selected
    if (avatar) {
      const filePath = `${userId}.png`
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
        avatar_url = data.publicUrl
      }
    }

    // Upsert profile
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        name: form.name,
        genre: form.genre,
        creative_field: form.genre,
        location: form.location,
        bio: form.bio,
        skills: form.skills,
        price_range: form.price_range,
        available: form.available,
        ...(avatar_url ? { avatar_url } : {})
      })

    if (error) {
      alert(error.message)
    } else {
      router.push(`/artists/${userId}`)
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .ps { background: #080808; min-height: 100vh; color: #fff; font-family: 'DM Sans', sans-serif; padding: 60px 24px 80px; }
        .ps-syne { font-family: 'Syne', sans-serif; }
        .ps-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; padding: 36px; max-width: 560px; margin: 0 auto; }
        .ps-input { width: 100%; background: #080808; border: 1px solid #1f1f1f; border-radius: 10px; padding: 12px 16px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .ps-input:focus { border-color: #d4af37; }
        .ps-label { display: block; font-size: 11px; color: #555; margin-bottom: 6px; letter-spacing: 0.09em; text-transform: uppercase; }
        .ps-submit { width: 100%; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 14px; border-radius: 12px; border: none; cursor: pointer; transition: opacity 0.2s; }
        .ps-submit:hover { opacity: 0.85; }
        .ps-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .ps-back { background: transparent; border: 1px solid #1f1f1f; color: #555; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.2s; width: 100%; margin-top: 10px; }
        .ps-back:hover { border-color: #333; color: #888; }
        .genre-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .genre-option { padding: 10px 12px; border: 1px solid #1f1f1f; border-radius: 10px; font-size: 13px; color: #666; cursor: pointer; text-align: center; transition: all 0.2s; background: transparent; font-family: 'DM Sans', sans-serif; }
        .genre-option:hover { border-color: #333; color: #aaa; }
        .genre-option.selected { border-color: #d4af37; color: #d4af37; background: rgba(212,175,55,0.06); }
        .step-indicator { display: flex; gap: 6px; margin-bottom: 32px; }
        .step-dot { height: 3px; border-radius: 999px; flex: 1; transition: background 0.3s; }
        .avatar-upload { width: 88px; height: 88px; border-radius: 50%; border: 2px dashed #2a2a2a; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; transition: border-color 0.2s; background: #0a0a0a; }
        .avatar-upload:hover { border-color: #d4af37; }
        .toggle { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .toggle-track { width: 44px; height: 24px; border-radius: 999px; background: #1f1f1f; border: 1px solid #2a2a2a; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .toggle-track.on { background: rgba(212,175,55,0.2); border-color: #d4af37; }
        .toggle-thumb { width: 18px; height: 18px; border-radius: 50%; background: #444; position: absolute; top: 2px; left: 2px; transition: all 0.2s; }
        .toggle-thumb.on { background: #d4af37; transform: translateX(20px); }
      `}</style>

      <div className="ps">
        <div style={{ maxWidth: 560, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 className="ps-syne" style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Set up your profile
            </h1>
            <p style={{ color: "#555", fontSize: 15, margin: 0 }}>
              This is what bookers and fans will see
            </p>
          </div>

          {/* Step indicator */}
          <div className="step-indicator">
            {[1, 2, 3].map(s => (
              <div key={s} className="step-dot" style={{ background: step >= s ? "#d4af37" : "#1f1f1f" }} />
            ))}
          </div>

          <div className="ps-card">

            {/* ── STEP 1: Basics ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <p className="ps-syne" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>The basics</p>
                  <p style={{ color: "#555", fontSize: 13, margin: 0 }}>Your name, photo and location</p>
                </div>

                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <label htmlFor="avatar-input" className="avatar-upload">
                    {avatarPreview
                      ? <img src={avatarPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="preview" />
                      : <span style={{ fontSize: 28, color: "#333" }}>+</span>
                    }
                  </label>
                  <input id="avatar-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 3px" }}>Profile photo</p>
                    <p style={{ fontSize: 12, color: "#555", margin: 0 }}>JPG or PNG, at least 400×400px</p>
                  </div>
                </div>

                <div>
                  <label className="ps-label">Artist Name *</label>
                  <input
                    className="ps-input"
                    placeholder="Your stage name"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="ps-label">Location</label>
                  <input
                    className="ps-input"
                    placeholder="Lagos, Nigeria"
                    value={form.location}
                    onChange={e => set("location", e.target.value)}
                  />
                </div>

                <div>
                  <label className="ps-label">Bio</label>
                  <textarea
                    className="ps-input"
                    placeholder="Tell bookers and fans who you are..."
                    rows={3}
                    value={form.bio}
                    onChange={e => set("bio", e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  className="ps-submit"
                  onClick={() => {
                    if (!form.name) return alert("Please enter your artist name")
                    setStep(2)
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* ── STEP 2: Genre ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <p className="ps-syne" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Your genre</p>
                  <p style={{ color: "#555", fontSize: 13, margin: 0 }}>Pick the one that best describes your sound</p>
                </div>

                <div className="genre-grid">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      className={`genre-option${form.genre === g ? " selected" : ""}`}
                      onClick={() => set("genre", g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="ps-label">Skills / Style Tags</label>
                  <input
                    className="ps-input"
                    placeholder="e.g. Live performer, songwriter, producer"
                    value={form.skills}
                    onChange={e => set("skills", e.target.value)}
                  />
                  <p style={{ fontSize: 11, color: "#444", margin: "5px 0 0" }}>Separate with commas</p>
                </div>

                <button
                  className="ps-submit"
                  onClick={() => {
                    if (!form.genre) return alert("Please select a genre")
                    setStep(3)
                  }}
                >
                  Continue →
                </button>
                <button className="ps-back" onClick={() => setStep(1)}>← Back</button>
              </div>
            )}

            {/* ── STEP 3: Booking ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <p className="ps-syne" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Booking info</p>
                  <p style={{ color: "#555", fontSize: 13, margin: 0 }}>Help bookers know what to expect</p>
                </div>

                <div>
                  <label className="ps-label">Starting Price</label>
                  <input
                    className="ps-input"
                    placeholder="e.g. ₦150,000 or $500"
                    value={form.price_range}
                    onChange={e => set("price_range", e.target.value)}
                  />
                  <p style={{ fontSize: 11, color: "#444", margin: "5px 0 0" }}>
                    This shows on your profile so bookers know your range
                  </p>
                </div>

                {/* Availability toggle */}
                <div>
                  <label className="ps-label">Availability</label>
                  <div
                    className="toggle"
                    onClick={() => set("available", !form.available)}
                  >
                    <div className={`toggle-track${form.available ? " on" : ""}`}>
                      <div className={`toggle-thumb${form.available ? " on" : ""}`} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 2px" }}>
                        {form.available ? "Available for bookings" : "Not available right now"}
                      </p>
                      <p style={{ fontSize: 12, color: "#555", margin: 0 }}>
                        {form.available
                          ? "Bookers can send you requests"
                          : "Your profile is still visible but booking is paused"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 12, padding: "16px 18px" }}>
                  <p style={{ fontSize: 12, color: "#555", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Profile summary</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { label: "Name",     value: form.name },
                      { label: "Genre",    value: form.genre },
                      { label: "Location", value: form.location || "—" },
                      { label: "Price",    value: form.price_range || "—" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, color: "#555" }}>{item.label}</span>
                        <span style={{ fontSize: 13, color: "#aaa" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="ps-submit" onClick={handleSave} disabled={loading}>
                  {loading ? "Creating profile..." : "Create My Profile →"}
                </button>
                <button className="ps-back" onClick={() => setStep(2)}>← Back</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
