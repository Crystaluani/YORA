"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/libs/supabase"
import Link from "next/link"

export default function SignupPage() {

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async () => {
    if (!email || !password) return setError("Please fill in all fields")
    if (password.length < 6) return setError("Password must be at least 6 characters")

    setLoading(true)
    setError("")

    const { error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Redirect to profile setup immediately after account creation
    router.push("/profile/setup")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .auth { background: #080808; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; font-family: 'DM Sans', sans-serif; color: #fff; }
        .auth-syne { font-family: 'Syne', sans-serif; }
        .auth-card { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; }
        .auth-input { width: 100%; background: #080808; border: 1px solid #1f1f1f; border-radius: 10px; padding: 13px 16px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .auth-input:focus { border-color: #d4af37; }
        .auth-input::placeholder { color: #333; }
        .auth-submit { width: 100%; background: #d4af37; color: #000; font-weight: 700; font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 14px; border-radius: 12px; border: none; cursor: pointer; transition: opacity 0.2s; }
        .auth-submit:hover:not(:disabled) { opacity: 0.85; }
        .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; padding: 12px 14px; border-radius: 10px; font-size: 13px; }
        .auth-link { color: #d4af37; text-decoration: none; font-weight: 500; }
        .auth-link:hover { opacity: 0.8; }
        .auth-divider { border: none; border-top: 1px solid #151515; margin: 24px 0; }
      `}</style>

      <div className="auth">
        <div className="auth-card">

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 className="auth-syne" style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Join <span style={{ color: "#d4af37" }}>YORA</span>
            </h1>
            <p style={{ color: "#555", fontSize: 14, margin: 0 }}>
              Create your artist profile and get discovered
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {error && <div className="auth-error">{error}</div>}

            <div>
              <input
                className="auth-input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => { setEmail(e.target.value); setError("") }}
                onKeyDown={e => e.key === "Enter" && handleSignup()}
              />
            </div>

            <div>
              <input
                className="auth-input"
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={e => { setPassword(e.target.value); setError("") }}
                onKeyDown={e => e.key === "Enter" && handleSignup()}
              />
            </div>

            <button className="auth-submit" onClick={handleSignup} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>

          </div>

          <hr className="auth-divider" />

          <p style={{ textAlign: "center", fontSize: 14, color: "#555", margin: 0 }}>
            Already have an account?{" "}
            <Link href="/login" className="auth-link">Sign in</Link>
          </p>

        </div>
      </div>
    </>
  )
}
