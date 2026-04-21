import Link from "next/link"
import { supabase } from "@/libs/supabase"

export default async function Home() {

  const { data: tracks } = await supabase
    .from("tracks")
    .select("*, profiles(name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(6)

  const { count: artistCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const { count: trackCount } = await supabase
    .from("tracks")
    .select("*", { count: "exact", head: true })

  const { count: bookingCount } = await supabase
    .from("booking_requests")
    .select("*", { count: "exact", head: true })

  const genres = ["Afrobeats", "Hip-Hop", "R&B", "Amapiano", "Gospel", "Pop", "Jazz", "Drill", "Highlife", "Reggae", "Soul", "Dancehall"]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .home { font-family: 'DM Sans', sans-serif; background: #080808; color: #fff; }
        .syne { font-family: 'Syne', sans-serif; }
        .accent { color: #d4af37; }
        .label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #d4af37; font-weight: 500; display: block; margin-bottom: 14px; }
        .divider { border: none; border-top: 1px solid #111; margin: 0; }
        .section { max-width: 1100px; margin: 0 auto; padding: 96px 24px; }
        .section-sm { max-width: 1100px; margin: 0 auto; padding: 72px 24px; }

        /* Hero */
        .hero-glow { position: absolute; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%); top: -200px; left: 50%; transform: translateX(-50%); pointer-events: none; }

        /* Marquee */
        .marquee-wrap { overflow: hidden; }
        .marquee-track { display: flex; gap: 12px; animation: marquee 30s linear infinite; width: max-content; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .m-pill { display: inline-block; padding: 9px 20px; border: 1px solid #1f1f1f; border-radius: 999px; font-size: 13px; color: #555; background: #0a0a0a; white-space: nowrap; }

        /* Buttons */
        .btn-gold { display: inline-block; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans', sans-serif; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: opacity 0.2s; }
        .btn-gold:hover { opacity: 0.85; }
        .btn-ghost { display: inline-block; border: 1px solid #252525; color: #888; font-family: 'DM Sans', sans-serif; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #d4af37; color: #d4af37; }

        /* Track cards */
        .track-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; transition: transform 0.25s, border-color 0.25s; display: block; color: inherit; text-decoration: none; }
        .track-card:hover { transform: translateY(-5px); border-color: rgba(212,175,55,0.4); }

        /* Stats */
        .stat-card { text-align: center; padding: 32px 24px; border: 1px solid #1a1a1a; border-radius: 16px; background: #0a0a0a; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; color: #d4af37; margin: 0 0 6px; letter-spacing: -0.03em; }
        .stat-label { font-size: 14px; color: #555; margin: 0; }

        /* How it works */
        .step-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; padding: 32px; position: relative; overflow: hidden; }
        .step-num { font-family: 'Syne', sans-serif; font-size: 80px; font-weight: 800; color: #111; position: absolute; top: -10px; right: 20px; line-height: 1; pointer-events: none; }
        .step-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }

        /* For bookers */
        .booker-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 28px; display: flex; gap: 20px; align-items: flex-start; }
        .booker-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* Genre grid */
        .genre-card { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 4/3; cursor: pointer; }
        .genre-card img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.3); transition: filter 0.3s, transform 0.4s; }
        .genre-card:hover img { filter: brightness(0.5); transform: scale(1.06); }
        .genre-card-name { position: absolute; bottom: 14px; left: 16px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; pointer-events: none; }

        /* CTA section */
        .cta-box { background: linear-gradient(135deg, #0f0f0f 0%, #141414 100%); border: 1px solid #1f1f1f; border-radius: 24px; padding: 64px 48px; text-align: center; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }

        /* Genre tag */
        .gtag { font-size: 11px; color: #d4af37; border: 1px solid rgba(212,175,55,0.25); padding: 3px 10px; border-radius: 999px; }

        /* Animations */
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .f1{animation:fadeUp 0.8s ease both}
        .f2{animation:fadeUp 0.8s 0.1s ease both}
        .f3{animation:fadeUp 0.8s 0.25s ease both}
        .f4{animation:fadeUp 0.8s 0.4s ease both}
      `}</style>

      <div className="home">

        {/* ── HERO ── */}
        <section style={{ position: "relative", padding: "120px 24px 100px", textAlign: "center", overflow: "hidden" }}>
          <div className="hero-glow" />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto" }}>
            <span className="label f1">The artist discovery & booking platform</span>
            <h1 className="syne f2" style={{ fontSize: "clamp(48px, 9vw, 96px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.03em", margin: "0 0 28px" }}>
              Your sound.<br /><span className="accent">Your stage.</span><br />Your income.
            </h1>
            <p className="f3" style={{ color: "#555", fontSize: 18, maxWidth: 500, margin: "0 auto 44px", lineHeight: 1.75, fontWeight: 300 }}>
              Emerging artists get heard, discovered, and booked — all in one place. No algorithm games. No gatekeepers.
            </p>
            <div className="f4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/signup" className="btn-gold">Start for free</Link>
              <Link href="/artists" className="btn-ghost">Browse artists</Link>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ── MARQUEE ── */}
        <section style={{ padding: "24px 0" }} className="marquee-wrap">
          <div className="marquee-track">
            {[...genres, ...genres].map((g, i) => <span key={i} className="m-pill">{g}</span>)}
          </div>
        </section>

        <hr className="divider" />

        {/* ── STATS ── */}
        <section className="section-sm">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16 }}>
            {[
              { num: artistCount || 0,  label: "Artists on YORA",      suffix: "+" },
              { num: trackCount || 0,   label: "Tracks uploaded",       suffix: "+" },
              { num: bookingCount || 0, label: "Booking requests sent", suffix: "" },
              { num: "Free",            label: "To join and get started", suffix: "" },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <p className="stat-num">{s.num}{s.suffix}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ── HOW IT WORKS ── */}
        <section className="section">
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <span className="label">Simple process</span>
            <h2 className="syne" style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 16px", lineHeight: 1.05 }}>
              From upload to booked in 3 steps
            </h2>
            <p style={{ color: "#555", fontSize: 16, margin: 0, lineHeight: 1.7 }}>
              YORA removes the friction between great music and real opportunities.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 16 }}>
            {[
              {
                n: "01",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                ),
                title: "Create your artist profile",
                desc: "Set up your profile in minutes. Add your bio, genre, location, and starting price so bookers know exactly who you are and what you offer."
              },
              {
                n: "02",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                ),
                title: "Upload your tracks",
                desc: "Share your music directly on your profile. Fans and promoters can listen before they book — no links to streaming platforms, no extra steps."
              },
              {
                n: "03",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
                title: "Get discovered and booked",
                desc: "Bookers browse, find you, and send a booking request with event details and budget. You accept or decline — it's that simple. Your dashboard tracks everything."
              }
            ].map((step, i) => (
              <div key={i} className="step-card">
                <span className="step-num">{step.n}</span>
                <div className="step-icon">{step.icon}</div>
                <h3 className="syne" style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.01em" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "#555", margin: 0, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link href="/signup" className="btn-gold">Create your profile free</Link>
          </div>
        </section>

        <hr className="divider" />

        {/* ── TRENDING TRACKS ── */}
        <section className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <span className="label">Right now</span>
              <h2 className="syne" style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
                Trending Tracks
              </h2>
            </div>
            <Link href="/feed" style={{ color: "#d4af37", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>See all →</Link>
          </div>

          {!tracks || tracks.length === 0 ? (
            <div style={{ border: "1px dashed #1a1a1a", borderRadius: 16, padding: "60px 24px", textAlign: "center", color: "#333" }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>No tracks yet</p>
              <p style={{ fontSize: 13, marginBottom: 24 }}>Be the first to upload your music</p>
              <Link href="/upload-track" className="btn-gold" style={{ fontSize: 14, padding: "10px 24px" }}>Upload now</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 18 }}>
              {tracks.map((track: any) => (
                <Link href={`/artists/${track.creator_id}`} key={track.id} className="track-card">
                  <img
                    src={track.image_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600"}
                    alt={track.title}
                    style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: "16px 18px" }}>
                    <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 4px", color: "#fff" }}>{track.title || "Untitled"}</p>
                    <p style={{ fontSize: 13, color: "#555", margin: "0 0 10px" }}>
                      {(track.profiles as any)?.name || "Unknown Artist"}
                    </p>
                    {track.genre && <span className="gtag">{track.genre}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <hr className="divider" />

        {/* ── FOR BOOKERS ── */}
        <section className="section">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            <div>
              <span className="label">For promoters & event organizers</span>
              <h2 className="syne" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 20px", lineHeight: 1.05 }}>
                Book with confidence,<br />not guesswork
              </h2>
              <p style={{ color: "#555", fontSize: 16, lineHeight: 1.8, margin: "0 0 36px" }}>
                Every artist on YORA has a public profile with real tracks you can listen to before booking. No more risk. No more surprises.
              </p>
              <Link href="/search" className="btn-gold">Find an artist</Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8">
                      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                    </svg>
                  ),
                  title: "Listen before you book",
                  desc: "Every artist has real tracks on their profile. Hear exactly what you're booking — no demos, no guessing."
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  ),
                  title: "Find artists by genre & location",
                  desc: "Filter by genre, city, or availability. Find the right fit for your event in seconds."
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.61a16 16 0 0 0 6 6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  ),
                  title: "One-click booking request",
                  desc: "Send a booking request with your event details, date, and budget. The artist responds directly — no middleman."
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ),
                  title: "Know their availability upfront",
                  desc: "Artists mark themselves available or unavailable. You only see artists who are open for bookings."
                },
              ].map((item, i) => (
                <div key={i} className="booker-card">
                  <div className="booker-icon">{item.icon}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 5px", color: "#fff" }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <hr className="divider" />

        {/* ── BROWSE BY GENRE ── */}
        <section className="section">
          <span className="label">Explore</span>
          <h2 className="syne" style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 36px" }}>
            Browse by Genre
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 12 }}>
            {[
              { name: "Afrobeats", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400" },
              { name: "Hip-Hop",   img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=400" },
              { name: "R&B",       img: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=400" },
              { name: "Amapiano",  img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400" },
              { name: "Gospel",    img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400" },
              { name: "Jazz",      img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400" },
            ].map((g, i) => (
              <Link key={i} href={`/search?genre=${g.name}`} className="genre-card" style={{ textDecoration: "none", color: "inherit" }}>
                <img src={g.img} alt={g.name} />
                <p className="genre-card-name">{g.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ── FINAL CTA ── */}
        <section className="section">
          <div className="cta-box">
            <div className="cta-glow" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="label" style={{ justifyContent: "center", display: "block" }}>Join YORA today</span>
              <h2 className="syne" style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.0 }}>
                Your next gig is<br /><span className="accent">one profile away.</span>
              </h2>
              <p style={{ color: "#555", fontSize: 17, margin: "0 auto 44px", maxWidth: 460, lineHeight: 1.75, fontWeight: 300 }}>
                Join YORA free. Create your profile, upload your tracks, and start getting discovered by promoters and fans who are actively looking for talent like yours.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/signup" className="btn-gold">Create your profile — it's free</Link>
                <Link href="/search" className="btn-ghost">I'm looking for artists</Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
