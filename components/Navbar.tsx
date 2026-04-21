"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/libs/supabase"

export default function Navbar() {

  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoaded(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .nav {
          width: 100%;
          background: rgba(8,8,8,0.95);
          border-bottom: 1px solid #151515;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .nav-logo span { color: #d4af37; }

        /* Desktop links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-link {
          color: #555;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #fff; }
        .nav-btn-gold {
          background: #d4af37;
          color: #000;
          font-weight: 600;
          font-size: 13px;
          padding: 8px 18px;
          border-radius: 999px;
          text-decoration: none;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .nav-btn-gold:hover { opacity: 0.85; }
        .nav-btn-ghost {
          border: 1px solid #222;
          color: #777;
          font-size: 13px;
          padding: 7px 16px;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .nav-btn-ghost:hover { border-color: #444; color: #aaa; }
        .nav-logout {
          background: none;
          border: none;
          color: #444;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
          white-space: nowrap;
        }
        .nav-logout:hover { color: #888; }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 101;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: rgba(8,8,8,0.98);
          border-bottom: 1px solid #1a1a1a;
          backdrop-filter: blur(20px);
          padding: 20px;
          flex-direction: column;
          gap: 4px;
          z-index: 99;
          animation: slideDown 0.2s ease;
        }
        .mobile-menu.open { display: flex; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-link {
          color: #888;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          padding: 14px 16px;
          border-radius: 12px;
          transition: all 0.2s;
          display: block;
          font-family: 'DM Sans', sans-serif;
        }
        .mobile-link:hover { color: #fff; background: #111; }
        .mobile-divider { border: none; border-top: 1px solid #111; margin: 8px 0; }
        .mobile-btn-gold {
          background: #d4af37;
          color: #000;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 16px;
          border-radius: 12px;
          text-decoration: none;
          display: block;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          margin-top: 4px;
        }
        .mobile-logout {
          background: none;
          border: none;
          color: #444;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          cursor: pointer;
          padding: 14px 16px;
          text-align: left;
          width: 100%;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .mobile-logout:hover { color: #888; background: #111; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">YOR<span>A</span></Link>

          {/* Desktop */}
          <div className="nav-links">
            <Link href="/feed" className="nav-link">Feed</Link>
            <Link href="/artists" className="nav-link">Artists</Link>
            <Link href="/search" className="nav-link">Search</Link>
            <Link href="/opportunities" className="nav-link">Opportunities</Link>
            {loaded && user && <Link href="/upload-track" className="nav-link">Upload</Link>}
            {loaded && (
              user ? (
                <>
                  <Link href="/dashboard" className="nav-btn-gold">Dashboard</Link>
                  <button onClick={handleLogout} className="nav-logout">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-btn-ghost">Sign in</Link>
                  <Link href="/signup" className="nav-btn-gold">Join free</Link>
                </>
              )
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <Link href="/feed" className="mobile-link">Feed</Link>
        <Link href="/artists" className="mobile-link">Artists</Link>
        <Link href="/search" className="mobile-link">Search</Link>
        <Link href="/opportunities" className="mobile-link">Opportunities</Link>
        {loaded && user && <Link href="/upload-track" className="mobile-link">Upload Track</Link>}
        <hr className="mobile-divider" />
        {loaded && (
          user ? (
            <>
              <Link href="/dashboard" className="mobile-btn-gold">Dashboard</Link>
              <button onClick={handleLogout} className="mobile-logout">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/signup" className="mobile-btn-gold">Join free</Link>
              <Link href="/login" className="mobile-link" style={{ textAlign: "center" }}>Sign in</Link>
            </>
          )
        )}
      </div>
    </>
  )
}
