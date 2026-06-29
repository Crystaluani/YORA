import Link from "next/link"
import { supabase } from "@/libs/supabase"

export default async function Home() {

  // Fetch real creatives to showcase
  const { data: creatives } = await supabase
    .from("profiles")
    .select("id, name, creative_field, genre, location, avatar_url, bio")
    .not("name", "is", null)
    .limit(6)

  // Fetch featured work
  const { data: works } = await supabase
    .from("tracks")
    .select("*, profiles(name, avatar_url, creative_field, genre)")
    .order("created_at", { ascending: false })
    .limit(3)

  const { count: creativeCount } = await supabase
    .from("profiles").select("*", { count: "exact", head: true })

  const { count: bookingCount } = await supabase
    .from("booking_requests").select("*", { count: "exact", head: true })

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
        .section { max-width: 1100px; margin: 0 auto; padding: 80px 20px; }

        /* ── HERO ── */
        .hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .hero-video-wrap { position: absolute; inset: 0; z-index: 0; }
        .hero-video-wrap iframe { position: absolute; width: 180%; height: 180%; top: -40%; left: -40%; border: none; pointer-events: none; }
        .hero-fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #0a0a0a 0%, #111 40%, #0d0d0d 100%); }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0.75) 60%, rgba(8,8,8,1) 100%); z-index: 1; }
        .hero-inner { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; padding: 0 20px; width: 100%; }

        /* Hero split */
        .hero-top { text-align: center; margin-bottom: 64px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.25); color: #d4af37; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 28px; }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #d4af37; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        /* Audience split cards */
        .audience-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .audience-card { background: rgba(15,15,15,0.9); border: 1px solid #1f1f1f; border-radius: 20px; padding: 36px 32px; transition: border-color 0.3s; }
        .audience-card:hover { border-color: rgba(212,175,55,0.4); }
        .audience-card.creative { border-top: 3px solid #d4af37; }
        .audience-card.hirer { border-top: 3px solid #555; }
        .audience-card.hirer:hover { border-top-color: #d4af37; }
        .audience-label { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; }
        .audience-points { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 8px; }
        .audience-points li { font-size: 14px; color: #777; display: flex; align-items: center; gap: 8px; }
        .audience-points li::before { content: "→"; color: #d4af37; font-size: 12px; }
        .btn-gold { display: inline-block; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans',sans-serif; padding: 13px 28px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: opacity 0.2s; width: 100%; text-align: center; }
        .btn-gold:hover { opacity: 0.85; }
        .btn-outline { display: inline-block; border: 1px solid #333; color: #aaa; font-family: 'DM Sans',sans-serif; padding: 13px 28px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: all 0.2s; width: 100%; text-align: center; }
        .btn-outline:hover { border-color: #d4af37; color: #d4af37; }

        /* Scroll */
        .scroll-indicator { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 2; }
        .scroll-mouse { width: 22px; height: 36px; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 999px; display: flex; justify-content: center; padding-top: 6px; }
        .scroll-wheel { width: 3px; height: 8px; background: rgba(255,255,255,0.3); border-radius: 999px; animation: scroll-anim 2s infinite; }
        @keyframes scroll-anim { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(10px)} }

        /* ── TALENT SECTION ── */
        .talent-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .talent-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 24px; transition: border-color 0.2s, transform 0.2s; text-decoration: none; color: inherit; display: block; }
        .talent-card:hover { border-color: rgba(212,175,55,0.35); transform: translateY(-3px); }
        .talent-avatar { width: 56px; height: 56px; border-radius: 50%; border: 2px solid #d4af37; overflow: hidden; background: #1a1a1a; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; font-family: 'Syne', sans-serif; color: #d4af37; flex-shrink: 0; margin-bottom: 14px; }
        .talent-field { font-size: 11px; color: #d4af37; border: 1px solid rgba(212,175,55,0.25); padding: 3px 10px; border-radius: 999px; display: inline-block; margin-bottom: 8px; }
        .talent-location { font-size: 12px; color: #444; display: flex; align-items: center; gap: 4px; margin-top: 6px; }

        /* ── OUTCOMES ── */
        .outcomes-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .outcome-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 28px 24px; }
        .outcome-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .outcome-feature { font-size: 11px; color: #555; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 6px; }
        .outcome-result { font-size: 18px; font-weight: 700; font-family: 'Syne', sans-serif; color: #fff; margin: 0 0 8px; }
        .outcome-desc { font-size: 13px; color: #555; margin: 0; line-height: 1.6; }

        /* ── ECOSYSTEM FLOW ── */
        .flow-steps { display: grid; grid-template-columns: repeat(5,1fr); gap: 0; position: relative; }
        .flow-step { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
        .flow-connector { position: absolute; top: 28px; left: 50%; right: -50%; height: 2px; background: linear-gradient(to right, #d4af37, rgba(212,175,55,0.2)); z-index: 0; }
        .flow-step:last-child .flow-connector { display: none; }
        .flow-circle { width: 56px; height: 56px; border-radius: 50%; background: #0f0f0f; border: 2px solid #d4af37; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; margin-bottom: 16px; flex-shrink: 0; }
        .flow-num { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #d4af37; }
        .flow-title { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 6px; }
        .flow-sub { font-size: 12px; color: #555; line-height: 1.5; }
        .flow-arrow { position: absolute; top: 26px; right: -12px; color: #d4af37; font-size: 16px; z-index: 2; }
        .flow-step:last-child .flow-arrow { display: none; }

        /* ── STATS BAR ── */
        .stats-bar { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #111; border: 1px solid #111; border-radius: 16px; overflow: hidden; }
        .stat-item { background: #0a0a0a; padding: 32px 24px; text-align: center; }
        .stat-num { font-family: 'Syne',sans-serif; font-size: 42px; font-weight: 800; color: #d4af37; margin: 0 0 6px; letter-spacing: -0.03em; line-height: 1; }
        .stat-label { font-size: 13px; color: #555; margin: 0; }

        /* ── CTA ── */
        .cta-box { background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 24px; padding: 72px 40px; text-align: center; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-cta-gold { display: inline-block; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans',sans-serif; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: opacity 0.2s; }
        .btn-cta-gold:hover { opacity: 0.85; }
        .btn-cta-ghost { display: inline-block; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); font-family: 'DM Sans',sans-serif; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: all 0.2s; }
        .btn-cta-ghost:hover { border-color: #d4af37; color: #d4af37; }

        .empty { border: 1px dashed #1a1a1a; border-radius: 16px; padding: 60px 24px; text-align: center; color: #333; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .f1{animation:fadeUp 0.9s ease both}
        .f2{animation:fadeUp 0.9s 0.1s ease both}
        .f3{animation:fadeUp 0.9s 0.2s ease both}
        .f4{animation:fadeUp 0.9s 0.3s ease both}

        @media (max-width: 900px) {
          .audience-grid { grid-template-columns: 1fr; }
          .talent-grid { grid-template-columns: repeat(2,1fr); }
          .outcomes-grid { grid-template-columns: repeat(2,1fr); }
          .flow-steps { grid-template-columns: repeat(3,1fr); row-gap: 32px; }
          .flow-step:nth-child(3) .flow-connector { display: none; }
          .stats-bar { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .section { padding: 56px 16px; }
          .talent-grid { grid-template-columns: 1fr; }
          .outcomes-grid { grid-template-columns: 1fr; }
          .flow-steps { grid-template-columns: 1fr; }
          .flow-connector, .flow-arrow { display: none; }
          .cta-box { padding: 48px 20px; }
          .hero-inner { padding: 0 16px; }
        }
      `}</style>

      <div className="home">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-video-wrap">
            <div className="hero-fallback" />
            <iframe
              src="https://www.youtube.com/embed/8oON21G1Bqg?autoplay=1&mute=1&controls=0&loop=1&playlist=8oON21G1Bqg&playsinline=1"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          <div className="hero-overlay" />

          <div className="hero-inner">

            {/* Top centered headline */}
            <div className="hero-top">
              <div className="hero-badge f1">
                <span className="hero-dot" />
                Africa's Creative Economy Platform
              </div>

              <h1 className="syne f2" style={{ fontSize: "clamp(40px, 8vw, 82px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.03em", margin: "0 0 20px", textAlign: "center" }}>
                Where creative talent<br />meets <span className="accent">real opportunity.</span>
              </h1>

              <p className="f3" style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(15px,2.5vw,18px)", maxWidth: 520, margin: "0 auto 52px", lineHeight: 1.8, fontWeight: 300, textAlign: "center" }}>
                The professional network where Africa's creative talent gets discovered, hired, and paid.
              </p>
            </div>

            {/* Dual audience cards */}
            <div className="audience-grid f4">

              {/* For Creatives */}
              <div className="audience-card creative">
                <p className="audience-label" style={{ color: "#d4af37" }}>For Creatives</p>
                <h3 className="syne" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                  Showcase your work.<br />Build your reputation.
                </h3>
                <ul className="audience-points">
                  <li>Create a professional profile in minutes</li>
                  <li>Upload your portfolio and get discovered</li>
                  <li>Receive booking requests directly</li>
                  <li>Connect with brands and collaborators</li>
                </ul>
                <Link href="/signup" className="btn-gold">I'm a Creative →</Link>
              </div>

              {/* For Hirers */}
              <div className="audience-card hirer">
                <p className="audience-label" style={{ color: "#888" }}>For Brands & Venues</p>
                <h3 className="syne" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                  Discover verified talent.<br />Hire with confidence.
                </h3>
                <ul className="audience-points">
                  <li>Browse real portfolios before committing</li>
                  <li>Search by field, location, and availability</li>
                  <li>Send structured booking requests</li>
                  <li>Build your go-to roster of creatives</li>
                </ul>
                <Link href="/search" className="btn-outline">I'm Hiring →</Link>
              </div>

            </div>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          </div>
        </section>

        <hr className="divider" />

        {/* ── MEET THE TALENT ── */}
        <section className="section">
          <span className="label">The people behind YORA</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
            <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.05 }}>
              Meet the talent
            </h2>
            <Link href="/artists" style={{ color: "#d4af37", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
              See all creatives →
            </Link>
          </div>

          {!creatives || creatives.length === 0 ? (
            <div className="empty">
              <p style={{ fontSize: 18, marginBottom: 8 }}>Be the first creative on YORA</p>
              <p style={{ fontSize: 13, marginBottom: 24 }}>Create your profile and get discovered</p>
              <Link href="/signup" className="btn-cta-gold" style={{ fontSize: 14, padding: "10px 24px", display: "inline-block" }}>
                Join now
              </Link>
            </div>
          ) : (
            <div className="talent-grid">
              {creatives.map((creative: any) => (
                <Link key={creative.id} href={`/artists/${creative.id}`} className="talent-card">
                  <div className="talent-avatar">
                    {creative.avatar_url
                      ? <img src={creative.avatar_url} alt={creative.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : creative.name?.[0]?.toUpperCase()
                    }
                  </div>
                  <span className="talent-field">
                    {creative.genre || creative.creative_field || "Creative"}
                  </span>
                  <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 4px", color: "#fff" }}>
                    {creative.name}
                  </p>
                  {creative.bio && (
                    <p style={{ fontSize: 13, color: "#555", margin: "0 0 6px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {creative.bio}
                    </p>
                  )}
                  {creative.location && (
                    <p className="talent-location">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {creative.location}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        <hr className="divider" />

        {/* ── STATS ── */}
        <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="stats-bar">
            {[
              { num: `${creativeCount || 0}+`, label: "Creative professionals on YORA" },
              { num: `${bookingCount || 0}`,   label: "Booking requests sent" },
              { num: "Free",                    label: "To join and get discovered" },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <p className="stat-num">{s.num}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" style={{ marginTop: 0 }} />

        {/* ── WHY YORA: OUTCOMES ── */}
        <section className="section">
          <span className="label">Why YORA</span>
          <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 14px", lineHeight: 1.05 }}>
            Built for outcomes,<br />not just features
          </h2>
          <p style={{ color: "#555", fontSize: 15, margin: "0 0 48px", lineHeight: 1.7, maxWidth: 480 }}>
            Every tool on YORA exists to move your creative career or business forward.
          </p>

          <div className="outcomes-grid">
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>,
                feature: "Portfolio",
                result: "Get discovered",
                desc: "Your work is the pitch. Upload it once and let it speak to every client who finds you."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                feature: "Profile",
                result: "Build credibility",
                desc: "A verified YORA profile signals professionalism before you say a word."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
                feature: "Booking System",
                result: "Find paid work",
                desc: "Structured booking requests replace scattered DMs and unreliable referrals."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
                feature: "Search & Discovery",
                result: "Hire faster",
                desc: "Brands find the right creative in seconds — not days of WhatsApp searching."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                feature: "Network",
                result: "Start collaborations",
                desc: "Connect with other creatives and build projects together through one platform."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
                feature: "Opportunities",
                result: "Grow your income",
                desc: "Brands and venues post opportunities directly on YORA. Apply, get hired, get paid."
              },
            ].map((item, i) => (
              <div key={i} className="outcome-card">
                <div className="outcome-icon">{item.icon}</div>
                <p className="outcome-feature">{item.feature}</p>
                <p className="outcome-result">{item.result}</p>
                <p className="outcome-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ── THE ECOSYSTEM / MARKETPLACE FLOW ── */}
        <section className="section">
          <span className="label">The marketplace</span>
          <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 14px", lineHeight: 1.05 }}>
            How YORA works
          </h2>
          <p style={{ color: "#555", fontSize: 15, margin: "0 0 56px", lineHeight: 1.7, maxWidth: 480 }}>
            From the first upload to a completed booking — everything happens in one place.
          </p>

          <div className="flow-steps">
            {[
              { n: "1", title: "Creative uploads work", sub: "Portfolio, samples, and pricing go live on their profile" },
              { n: "2", title: "Brand discovers them", sub: "Via search, browse, or direct profile link" },
              { n: "3", title: "Booking request sent", sub: "Structured form with event details and budget" },
              { n: "4", title: "Creative accepts", sub: "Reviews the request and confirms via dashboard" },
              { n: "5", title: "Project completed", sub: "Both parties build their reputation on YORA" },
            ].map((step, i, arr) => (
              <div key={i} className="flow-step">
                {i < arr.length - 1 && <div className="flow-connector" />}
                {i < arr.length - 1 && <span className="flow-arrow">›</span>}
                <div className="flow-circle">
                  <span className="flow-num">{step.n}</span>
                </div>
                <p className="flow-title">{step.title}</p>
                <p className="flow-sub">{step.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ── FINAL CTA ── */}
        <section className="section">
          <div className="cta-box">
            <div className="cta-glow" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="label" style={{ display: "block" }}>Ready to start?</span>
              <h2 className="syne" style={{ fontSize: "clamp(30px,5vw,58px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.0 }}>
                Your next opportunity<br />starts <span className="accent">here.</span>
              </h2>
              <p style={{ color: "#555", fontSize: 16, margin: "0 auto 40px", maxWidth: 440, lineHeight: 1.75, fontWeight: 300 }}>
                Whether you're a creative ready to be discovered or a brand looking for talent — YORA is where it happens.
              </p>
              <div className="cta-btns">
                <Link href="/signup" className="btn-cta-gold">Join as a Creative</Link>
                <Link href="/search" className="btn-cta-ghost">Find Talent</Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}