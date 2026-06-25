import Link from "next/link"
import { supabase } from "@/libs/supabase"

export default async function Home() {

  const { data: works } = await supabase
    .from("tracks")
    .select("*, profiles(name, avatar_url, creative_field)")
    .order("created_at", { ascending: false })
    .limit(6)

  const { count: creativeCount } = await supabase
    .from("profiles").select("*", { count: "exact", head: true })

  const { count: workCount } = await supabase
    .from("tracks").select("*", { count: "exact", head: true })

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

        /* HERO */
        .hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; text-align: center; }
        .hero-video-wrap { position: absolute; inset: 0; z-index: 0; }
        .hero-video-wrap iframe { position: absolute; width: 180%; height: 180%; top: -40%; left: -40%; border: none; pointer-events: none; }
        .hero-fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #0a0a0a 0%, #111 40%, #0d0d0d 100%); }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.72) 60%, rgba(8,8,8,1) 100%); z-index: 1; }
        .hero-content { position: relative; z-index: 2; max-width: 840px; padding: 0 20px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.25); color: #d4af37; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 28px; }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #d4af37; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        /* MARQUEE */
        .marquee-wrap { overflow: hidden; padding: 22px 0; }
        .marquee-track { display: flex; gap: 12px; animation: marquee 32s linear infinite; width: max-content; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .m-pill { padding: 9px 20px; border: 1px solid #1f1f1f; border-radius: 999px; font-size: 13px; color: #555; background: #0a0a0a; white-space: nowrap; }

        /* BUTTONS */
        .btn-gold { display: inline-block; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans',sans-serif; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: opacity 0.2s; }
        .btn-gold:hover { opacity: 0.85; }
        .btn-ghost { display: inline-block; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); font-family: 'DM Sans',sans-serif; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #d4af37; color: #d4af37; }

        /* STATS */
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        .stat-card { text-align: center; padding: 28px 20px; border: 1px solid #1a1a1a; border-radius: 16px; background: #0a0a0a; }
        .stat-num { font-family: 'Syne',sans-serif; font-size: 44px; font-weight: 800; color: #d4af37; margin: 0 0 6px; letter-spacing: -0.03em; line-height: 1; }
        .stat-label { font-size: 13px; color: #555; margin: 0; }

        /* HOW IT WORKS */
        .steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .step-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; padding: 32px; position: relative; overflow: hidden; }
        .step-num { font-family: 'Syne',sans-serif; font-size: 88px; font-weight: 800; color: rgba(255,255,255,0.03); position: absolute; top: -10px; right: 16px; line-height: 1; }
        .step-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }

        /* WORK CARDS */
        .works-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .work-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; transition: transform 0.25s, border-color 0.25s; display: block; color: inherit; text-decoration: none; }
        .work-card:hover { transform: translateY(-5px); border-color: rgba(212,175,55,0.4); }
        .gtag { font-size: 11px; color: #d4af37; border: 1px solid rgba(212,175,55,0.25); padding: 3px 10px; border-radius: 999px; display: inline-block; margin-top: 8px; }

        /* FOR VENUES */
        .bookers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .booker-features { display: flex; flex-direction: column; gap: 14px; }
        .booker-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 16px; padding: 22px; display: flex; gap: 16px; align-items: flex-start; }
        .booker-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* CATEGORIES */
        .active-pills { display: flex; flex-wrap: wrap; gap: 10px; }
        .active-pill { padding: 10px 20px; border: 1px solid rgba(212,175,55,0.35); border-radius: 999px; font-size: 14px; color: #d4af37; background: rgba(212,175,55,0.05); text-decoration: none; transition: all 0.2s; }
        .active-pill:hover { background: rgba(212,175,55,0.12); }
        .soon-pills { display: flex; flex-wrap: wrap; gap: 10px; }
        .soon-pill { padding: 10px 20px; border: 1px solid #1f1f1f; border-radius: 999px; font-size: 14px; color: #333; background: transparent; cursor: default; }

        /* CTA */
        .cta-box { background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 24px; padding: 72px 40px; text-align: center; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }

        /* SCROLL */
        .scroll-indicator { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; }
        .scroll-mouse { width: 22px; height: 36px; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 999px; display: flex; justify-content: center; padding-top: 6px; }
        .scroll-wheel { width: 3px; height: 8px; background: rgba(255,255,255,0.3); border-radius: 999px; animation: scroll-anim 2s infinite; }
        @keyframes scroll-anim { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(10px)} }

        .empty { border: 1px dashed #1a1a1a; border-radius: 16px; padding: 60px 24px; text-align: center; color: #333; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .f1{animation:fadeUp 0.9s ease both}
        .f2{animation:fadeUp 0.9s 0.1s ease both}
        .f3{animation:fadeUp 0.9s 0.25s ease both}
        .f4{animation:fadeUp 0.9s 0.4s ease both}

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .steps-grid { grid-template-columns: 1fr; }
          .works-grid { grid-template-columns: repeat(2,1fr); }
          .bookers-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 600px) {
          .section { padding: 56px 16px; }
          .stats-grid { grid-template-columns: repeat(2,1fr); gap: 10px; }
          .stat-num { font-size: 32px; }
          .works-grid { grid-template-columns: 1fr; }
          .cta-box { padding: 48px 20px; }
          .bookers-grid { gap: 32px; }
        }
      `}</style>

      <div className="home">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-video-wrap">
            <div className="hero-video-fallback" />
            <iframe
              src="https://www.youtube.com/embed/N5Fzkvoi9w0?autoplay=1&mute=1&controls=0&loop=1&playlist=N5Fzkvoi9w0&playsinline=1"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          <div className="hero-overlay" />

          <div className="hero-content">
            <div className="hero-badge f1">
              <span className="hero-dot" />
              The Creative Economy Platform
            </div>

            <h1 className="syne f2" style={{ fontSize: "clamp(42px, 9vw, 92px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.03em", margin: "0 0 24px" }}>
              Where creative talent<br />meets <span className="accent">real opportunities.</span>
            </h1>

            <p className="f3" style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(15px,2.5vw,18px)", maxWidth: 540, margin: "0 auto 44px", lineHeight: 1.8, fontWeight: 300 }}>
              Discover verified creatives or get booked for your next project, event, or performance — all in one structured platform.
            </p>

            <div className="f4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/signup" className="btn-gold">Get Discovered</Link>
              <Link href="/search" className="btn-ghost">Find Talent</Link>
            </div>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          </div>
        </section>

        <hr className="divider" />

        {/* ── MARQUEE ── */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...["Singers","DJs","Live Bands","Producers","Instrumentalists","Musical Artists","Performers","Creative Talent","Vocalists","Afrobeats","Gospel Artists","Rappers"],
              ...["Singers","DJs","Live Bands","Producers","Instrumentalists","Musical Artists","Performers","Creative Talent","Vocalists","Afrobeats","Gospel Artists","Rappers"]
            ].map((t, i) => <span key={i} className="m-pill">{t}</span>)}
          </div>
        </div>

        <hr className="divider" />

        {/* ── STATS ── */}
        <section className="section">
          <div className="stats-grid">
            {[
              { num: `${creativeCount || 0}+`, label: "Creative professionals" },
              { num: `${workCount || 0}+`,     label: "Portfolio pieces shared" },
              { num: `${bookingCount || 0}`,   label: "Booking requests sent" },
              { num: "Free",                    label: "To join and get discovered" },
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
            From profile to booked<br />in 3 steps
          </h2>
          <p style={{ color: "#555", fontSize: 15, margin: "0 0 48px", lineHeight: 1.7, maxWidth: 480 }}>
            YORA removes the friction between great talent and real opportunities.
          </p>

          <div className="steps-grid">
            {[
              {
                n: "01",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                title: "Create your creative profile",
                desc: "Set up in minutes. Add your creative field, bio, location, portfolio, and pricing so the right clients can find you."
              },
              {
                n: "02",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
                title: "Showcase your work",
                desc: "Upload samples of your work — music, performances, recordings. Clients hear exactly what they're booking before committing."
              },
              {
                n: "03",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
                title: "Get booked for creative work",
                desc: "Clients find you, send a structured booking request, and you manage everything from your dashboard. No middlemen."
              }
            ].map((step, i) => (
              <div key={i} className="step-card">
                <span className="step-num">{step.n}</span>
                <div className="step-icon">{step.icon}</div>
                <h3 className="syne" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 10px" }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "#555", margin: 0, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link href="/signup" className="btn-gold">Create your profile free</Link>
          </div>
        </section>

        <hr className="divider" />

        {/* ── FEATURED WORK ── */}
        <section className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="label">Right now</span>
              <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
                Featured Creative Work
              </h2>
            </div>
            <Link href="/feed" style={{ color: "#d4af37", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
              See all →
            </Link>
          </div>

          {!works || works.length === 0 ? (
            <div className="empty">
              <p style={{ fontSize: 18, marginBottom: 8 }}>No work posted yet</p>
              <p style={{ fontSize: 13, marginBottom: 24 }}>Be the first creative to get discovered on YORA</p>
              <Link href="/upload-track" className="btn-gold" style={{ fontSize: 14, padding: "10px 24px" }}>
                Upload your work
              </Link>
            </div>
          ) : (
            <div className="works-grid">
              {works.map((work: any) => (
                <Link href={`/artists/${work.creator_id}`} key={work.id} className="work-card">
                  <img
                    src={work.image_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600"}
                    alt={work.title}
                    style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 3px", color: "#fff" }}>{work.title || "Untitled"}</p>
                    <p style={{ fontSize: 13, color: "#555", margin: 0 }}>{(work.profiles as any)?.name || "Unknown"}</p>
                    {(work.genre || (work.profiles as any)?.creative_field) && (
                      <span className="gtag">{work.genre || (work.profiles as any)?.creative_field}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <hr className="divider" />

        {/* ── FOR VENUES ── */}
        <section className="section">
          <div className="bookers-grid">
            <div>
              <span className="label">For venues & event organizers</span>
              <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 18px", lineHeight: 1.05 }}>
                Find your next creative professional
              </h2>
              <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8, margin: "0 0 32px" }}>
                Stop searching through social media and personal contacts. YORA gives you direct access to vetted creative talent — with structured bookings and no hassle.
              </p>
              <Link href="/search" className="btn-gold">Find Creative Talent</Link>
            </div>

            <div className="booker-features">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
                  title: "Hear their work before booking",
                  desc: "Every creative has a real portfolio. Know exactly what you're getting before you commit."
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
                  title: "Search by creative field & location",
                  desc: "Find a live musician for your restaurant, a performer for your event — in seconds."
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.61a16 16 0 0 0 6 6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                  title: "One structured booking request",
                  desc: "Send your event details, date, location, and budget directly. The creative responds from their dashboard."
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>,
                  title: "Only available talent",
                  desc: "Every profile shows availability upfront. No wasted time on creatives who can't make it."
                },
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

        {/* ── CATEGORIES (music-first + coming soon) ── */}
        <section className="section">
          <span className="label">Creative fields on YORA</span>
          <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 40px" }}>
            Currently onboarding
          </h2>

          {/* Active */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, color: "#d4af37", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
              ✓ Now active
            </p>
            <div className="active-pills">
              {["Singer / Songwriter","DJ","Live Band","Music Producer","Instrumentalist","Rapper / MC","Gospel Artist","Afrobeats Artist","Spoken Word Artist"].map((f, i) => (
                <Link key={i} href={`/search?field=${f}`} className="active-pill">{f}</Link>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div style={{ paddingTop: 28, borderTop: "1px solid #111" }}>
            <p style={{ fontSize: 12, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
              Coming soon
            </p>
            <div className="soon-pills">
              {["Photographer","Videographer","Dancer","Model","Makeup Artist","Host / Emcee","Visual Artist","Content Creator"].map((f, i) => (
                <span key={i} className="soon-pill">{f}</span>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ── CTA ── */}
        <section className="section">
          <div className="cta-box">
            <div className="cta-glow" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="label" style={{ display: "block" }}>Join YORA today</span>
              <h2 className="syne" style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.0 }}>
                Your next opportunity is<br /><span className="accent">one profile away.</span>
              </h2>
              <p style={{ color: "#555", fontSize: 16, margin: "0 auto 40px", maxWidth: 460, lineHeight: 1.75, fontWeight: 300 }}>
                Join free. Build your profile, share your work, and start getting booked by clients, venues, and event organizers — through a platform built for the creative economy.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/signup" className="btn-gold">Get Discovered — it's free</Link>
                <Link href="/search" className="btn-ghost" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  I'm looking for talent
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}