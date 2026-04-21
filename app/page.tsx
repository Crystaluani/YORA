import Link from "next/link"
import { supabase } from "@/libs/supabase"

export default async function Home() {

  const { data: tracks } = await supabase
    .from("tracks")
    .select("*, profiles(name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(6)

  const { count: artistCount } = await supabase
    .from("profiles").select("*", { count: "exact", head: true })

  const { count: trackCount } = await supabase
    .from("tracks").select("*", { count: "exact", head: true })

  const { count: bookingCount } = await supabase
    .from("booking_requests").select("*", { count: "exact", head: true })

  const genres = ["Afrobeats","Hip-Hop","R&B","Amapiano","Gospel","Pop","Jazz","Drill","Highlife","Reggae","Soul","Dancehall"]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }
        .home { font-family: 'DM Sans', sans-serif; background: #080808; color: #fff; overflow-x: hidden; }
        .syne { font-family: 'Syne', sans-serif; }
        .accent { color: #d4af37; }
        .label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #d4af37; font-weight: 500; display: block; margin-bottom: 14px; }
        .divider { border: none; border-top: 1px solid #111; margin: 0; }

        /* ── VIDEO HERO ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
        }
        .hero-video-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-video-wrap iframe {
          position: absolute;
          width: 180%;
          height: 180%;
          top: -40%;
          left: -40%;
          border: none;
          pointer-events: none;
        }
        /* Fallback gradient shown while video loads */
        .hero-video-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #0a0a0a 0%, #111 40%, #0d0d0d 100%);
        }
        /* Dark overlay on video */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(8,8,8,0.55) 0%,
            rgba(8,8,8,0.7) 60%,
            rgba(8,8,8,1) 100%
          );
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 20px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.25);
          color: #d4af37;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #d4af37;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .hero-title {
          font-size: clamp(44px, 10vw, 100px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin: 0 0 24px;
        }
        .hero-sub {
          color: rgba(255,255,255,0.5);
          font-size: clamp(15px, 2.5vw, 18px);
          max-width: 460px;
          margin: 0 auto 44px;
          line-height: 1.75;
          font-weight: 300;
        }
        .hero-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Scroll indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .scroll-mouse {
          width: 22px; height: 36px;
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }
        .scroll-wheel {
          width: 3px; height: 8px;
          background: rgba(255,255,255,0.3);
          border-radius: 999px;
          animation: scroll-anim 2s infinite;
        }
        @keyframes scroll-anim {
          0%   { opacity:1; transform:translateY(0); }
          100% { opacity:0; transform:translateY(10px); }
        }

        /* ── MARQUEE ── */
        .marquee-wrap { overflow: hidden; padding: 24px 0; }
        .marquee-track { display: flex; gap: 12px; animation: marquee 30s linear infinite; width: max-content; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .m-pill { padding: 9px 20px; border: 1px solid #1f1f1f; border-radius: 999px; font-size: 13px; color: #555; background: #0a0a0a; white-space: nowrap; }

        /* ── BUTTONS ── */
        .btn-gold { display: inline-block; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans',sans-serif; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: opacity 0.2s; }
        .btn-gold:hover { opacity: 0.85; }
        .btn-ghost { display: inline-block; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); font-family: 'DM Sans',sans-serif; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: all 0.2s; backdrop-filter: blur(4px); }
        .btn-ghost:hover { border-color: #d4af37; color: #d4af37; }

        /* ── SECTIONS ── */
        .section { max-width: 1100px; margin: 0 auto; padding: 80px 20px; }

        /* ── STATS ── */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .stat-card { text-align: center; padding: 28px 20px; border: 1px solid #1a1a1a; border-radius: 16px; background: #0a0a0a; }
        .stat-num { font-family: 'Syne',sans-serif; font-size: 44px; font-weight: 800; color: #d4af37; margin: 0 0 6px; letter-spacing: -0.03em; line-height: 1; }
        .stat-label { font-size: 13px; color: #555; margin: 0; }

        /* ── HOW IT WORKS ── */
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .step-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; padding: 32px; position: relative; overflow: hidden; }
        .step-num { font-family: 'Syne',sans-serif; font-size: 88px; font-weight: 800; color: rgba(255,255,255,0.03); position: absolute; top: -10px; right: 16px; line-height: 1; pointer-events: none; }
        .step-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; flex-shrink: 0; }

        /* ── TRACK CARDS ── */
        .tracks-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .track-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; transition: transform 0.25s, border-color 0.25s; display: block; color: inherit; text-decoration: none; }
        .track-card:hover { transform: translateY(-5px); border-color: rgba(212,175,55,0.4); }
        .track-card img { width: 100%; height: 190px; object-fit: cover; display: block; }
        .gtag { font-size: 11px; color: #d4af37; border: 1px solid rgba(212,175,55,0.25); padding: 3px 10px; border-radius: 999px; display: inline-block; margin-top: 8px; }

        /* ── FOR BOOKERS ── */
        .bookers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .booker-features { display: flex; flex-direction: column; gap: 14px; }
        .booker-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 22px; display: flex; gap: 16px; align-items: flex-start; }
        .booker-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* ── GENRE GRID ── */
        .genre-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
        .genre-card { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 3/4; cursor: pointer; text-decoration: none; display: block; }
        .genre-card img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.3); transition: filter 0.3s, transform 0.4s; }
        .genre-card:hover img { filter: brightness(0.55); transform: scale(1.06); }
        .genre-card-name { position: absolute; bottom: 12px; left: 14px; font-family: 'Syne',sans-serif; font-weight: 700; font-size: 14px; pointer-events: none; }

        /* ── CTA ── */
        .cta-box { background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 24px; padding: 72px 40px; text-align: center; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .f1{animation:fadeUp 0.9s ease both}
        .f2{animation:fadeUp 0.9s 0.1s ease both}
        .f3{animation:fadeUp 0.9s 0.25s ease both}
        .f4{animation:fadeUp 0.9s 0.4s ease both}

        /* ── EMPTY STATE ── */
        .empty { border: 1px dashed #1a1a1a; border-radius: 16px; padding: 60px 24px; text-align: center; color: #333; }

        /* ── MOBILE RESPONSIVE ── */
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: 1fr; }
          .tracks-grid { grid-template-columns: repeat(2, 1fr); }
          .bookers-grid { grid-template-columns: 1fr; gap: 40px; }
          .genre-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .section { padding: 56px 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .stat-num { font-size: 32px; }
          .stat-card { padding: 20px 14px; }
          .tracks-grid { grid-template-columns: 1fr; }
          .genre-grid { grid-template-columns: repeat(2, 1fr); }
          .step-card { padding: 24px 20px; }
          .cta-box { padding: 48px 20px; }
          .hero-btns { flex-direction: column; align-items: center; }
          .btn-gold, .btn-ghost { width: 100%; max-width: 320px; text-align: center; }
          .bookers-grid { gap: 32px; }
          .booker-card { padding: 16px; gap: 12px; }
          .hero-video-wrap iframe { width: 300%; height: 300%; top: -100%; left: -100%; }
        }
      `}</style>

      <div className="home">

        {/* ── VIDEO HERO ── */}
        <section className="hero">

          {/* Video background */}
          <div className="hero-video-wrap">
            <div className="hero-video-fallback" />
            {/*
              🎬 SWAP VIDEO: Change the YouTube video ID below to any concert/music video.
              Find a video on YouTube, copy the ID from the URL (youtube.com/watch?v=VIDEO_ID)
              Make sure it's a public video. Muted autoplay works best with ambient concert footage.
            */}
            <iframe
              src="https://www.youtube.com/embed/6xd4oIP6Uws?autoplay=1&mute=1&controls=0&loop=1&playlist=6xd4oIP6Uws"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>

          {/* Overlay */}
          <div className="hero-overlay" />

          {/* Content */}
          <div className="hero-content">
            <div className="hero-badge f1">
              <span className="hero-badge-dot" />
              Now live — join the platform
            </div>

            <h1 className="syne hero-title f2">
              Your sound.<br />
              <span className="accent">Your stage.</span><br />
              Your income.
            </h1>

            <p className="hero-sub f3">
              The platform where emerging artists get heard, discovered, and booked. No algorithm games. No gatekeepers.
            </p>

            <div className="hero-btns f4">
              <Link href="/signup" className="btn-gold">Start for free</Link>
              <Link href="/artists" className="btn-ghost">Browse artists</Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel" />
            </div>
          </div>

        </section>

        <hr className="divider" />

        {/* ── MARQUEE ── */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...genres, ...genres].map((g, i) => <span key={i} className="m-pill">{g}</span>)}
          </div>
        </div>

        <hr className="divider" />

        {/* ── STATS ── */}
        <section className="section">
          <div className="stats-grid">
            {[
              { num: `${artistCount || 0}+`, label: "Artists on YORA" },
              { num: `${trackCount || 0}+`,  label: "Tracks uploaded" },
              { num: `${bookingCount || 0}`,  label: "Booking requests" },
              { num: "Free",                   label: "To join and start" },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <p className="stat-num">{s.num}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ── HOW IT WORKS ── */}
        <section className="section">
          <span className="label">Simple process</span>
          <h2 className="syne" style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 14px", lineHeight: 1.05 }}>
            From upload to booked<br />in 3 steps
          </h2>
          <p style={{ color: "#555", fontSize: 15, margin: "0 0 48px", lineHeight: 1.7, maxWidth: 480 }}>
            YORA removes the friction between great music and real opportunities.
          </p>

          <div className="steps-grid">
            {[
              {
                n: "01",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                title: "Create your artist profile",
                desc: "Set up in minutes. Add your bio, genre, location, and starting price so bookers know exactly who you are."
              },
              {
                n: "02",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
                title: "Upload your tracks",
                desc: "Share your music on your profile. Fans and promoters listen before they book — no extra steps."
              },
              {
                n: "03",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                title: "Get discovered and booked",
                desc: "Bookers find you, send a request with event details and budget. You accept or decline from your dashboard."
              }
            ].map((step, i) => (
              <div key={i} className="step-card">
                <span className="step-num">{step.n}</span>
                <div className="step-icon">{step.icon}</div>
                <h3 className="syne" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.01em" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="label">Right now</span>
              <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
                Trending Tracks
              </h2>
            </div>
            <Link href="/feed" style={{ color: "#d4af37", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
              See all →
            </Link>
          </div>

          {!tracks || tracks.length === 0 ? (
            <div className="empty">
              <p style={{ fontSize: 18, marginBottom: 8 }}>No tracks yet</p>
              <p style={{ fontSize: 13, marginBottom: 24 }}>Be the first to upload your music</p>
              <Link href="/upload-track" className="btn-gold" style={{ fontSize: 14, padding: "10px 24px" }}>Upload now</Link>
            </div>
          ) : (
            <div className="tracks-grid">
              {tracks.map((track: any) => (
                <Link href={`/artists/${track.creator_id}`} key={track.id} className="track-card">
                  <img
                    src={track.image_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600"}
                    alt={track.title}
                  />
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 3px", color: "#fff" }}>{track.title || "Untitled"}</p>
                    <p style={{ fontSize: 13, color: "#555", margin: 0 }}>{(track.profiles as any)?.name || "Unknown Artist"}</p>
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
          <div className="bookers-grid">
            <div>
              <span className="label">For promoters & event organizers</span>
              <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 18px", lineHeight: 1.05 }}>
                Book with confidence,<br />not guesswork
              </h2>
              <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8, margin: "0 0 32px" }}>
                Every artist on YORA has real tracks you can listen to before booking. No more risk. No more surprises.
              </p>
              <Link href="/search" className="btn-gold">Find an artist</Link>
            </div>

            <div className="booker-features">
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>, title: "Listen before you book", desc: "Real tracks on every profile. Hear exactly what you're booking." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>, title: "Search by genre & location", desc: "Filter to find the perfect fit for your event in seconds." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.61a16 16 0 0 0 6 6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, title: "One-click booking request", desc: "Send event details and budget directly. No middleman." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>, title: "Know availability upfront", desc: "Only see artists who are open for bookings right now." },
              ].map((item, i) => (
                <div key={i} className="booker-card">
                  <div className="booker-icon">{item.icon}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 4px", color: "#fff" }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
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
          <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 32px" }}>
            Browse by Genre
          </h2>
          <div className="genre-grid">
            {[
              { name: "Afrobeats", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400" },
              { name: "Hip-Hop",   img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=400" },
              { name: "R&B",       img: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=400" },
              { name: "Amapiano",  img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400" },
              { name: "Gospel",    img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400" },
              { name: "Jazz",      img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400" },
            ].map((g, i) => (
              <Link key={i} href={`/search?genre=${g.name}`} className="genre-card">
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
              <span className="label" style={{ display: "block" }}>Join YORA today</span>
              <h2 className="syne" style={{ fontSize: "clamp(30px,5vw,60px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.0 }}>
                Your next gig is<br /><span className="accent">one profile away.</span>
              </h2>
              <p style={{ color: "#555", fontSize: 16, margin: "0 auto 40px", maxWidth: 440, lineHeight: 1.75, fontWeight: 300 }}>
                Create your profile free, upload your tracks, and start getting discovered by promoters and fans today.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/signup" className="btn-gold">Create your profile — it's free</Link>
                <Link href="/search" className="btn-ghost" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  I'm looking for artists
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
