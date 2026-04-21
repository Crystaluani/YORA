"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/libs/supabase"

export default function Navbar() {

  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoaded(true)
    })

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        .nav { width: 100%; background: rgba(8,8,8,0.92); border-bottom: 1px solid #151515; backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; font-family: 'DM Sans', sans-serif; }
        .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; justify-content: space-between; align-items: center; }
        .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #fff; text-decoration: none; letter-spacing: -0.02em; }
        .nav-logo span { color: #d4af37; }
        .nav-links { display: flex; align-items: center; gap: 24px; }
        .nav-link { color: #555; text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .nav-btn-gold { background: #d4af37; color: #000; font-weight: 600; font-size: 13px; padding: 8px 18px; border-radius: 999px; text-decoration: none; transition: opacity 0.2s; font-family: 'DM Sans', sans-serif; }
        .nav-btn-gold:hover { opacity: 0.85; }
        .nav-btn-ghost { border: 1px solid #222; color: #777; font-size: 13px; padding: 7px 16px; border-radius: 999px; text-decoration: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .nav-btn-ghost:hover { border-color: #444; color: #aaa; }
        .nav-logout { background: none; border: none; color: #444; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: color 0.2s; padding: 0; }
        .nav-logout:hover { color: #888; }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">

          <Link href="/" className="nav-logo">
            YOR<span>A</span>
          </Link>

          <div className="nav-links">
            <Link href="/search" className="nav-link">Search</Link>
            <Link href="/feed" className="nav-link">Feed</Link>
            <Link href="/artists" className="nav-link">Artists</Link>
            <Link href="/opportunities" className="nav-link">Opportunities</Link>

            {loaded && (
              user ? (
                // Logged in
                <>
                  <Link href="/upload-track" className="nav-link">Upload</Link>
                  <Link href="/dashboard" className="nav-btn-gold">Dashboard</Link>
                  <button onClick={handleLogout} className="nav-logout">Sign out</button>
                </>
              ) : (
                // Logged out
                <>
                  <Link href="/login" className="nav-btn-ghost">Sign in</Link>
                  <Link href="/signup" className="nav-btn-gold">Join free</Link>
                </>
              )
            )}
          </div>

        </div>
      </nav>
    </>
  )
}
