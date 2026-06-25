"use client"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await authClient.signIn.email({ email, password })
    if (res.error) setError(res.error.message || "Sign in failed")
    else router.push("/dashboard")
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #FF0052, #FF0052)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20, margin: "0 auto 16px" }}>S</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>Welcome back</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 14 }}>Sign in to your ShipFlow account</p>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 28, boxShadow: "var(--shadow-md)" }}>
          {error && (
            <div style={{ padding: "10px 14px", background: "var(--error-light)", border: "1px solid #FECACA", borderRadius: "var(--radius-md)", marginBottom: 16, fontSize: 13, color: "var(--error)" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>Email</label>
              <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none", transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-primary)", fontSize: 14, outline: "none", transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = "#FF0052"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <button type="submit" disabled={loading}
              style={{ marginTop: 4, padding: "11px", borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, #FF0052, #FF0052)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, marginTop: 20, color: "var(--text-secondary)" }}>
          No account?{" "}
          <a href="/sign-up" style={{ color: "var(--accent)", fontWeight: 500 }}>Create one free</a>
        </p>
      </div>
    </div>
  )
}
