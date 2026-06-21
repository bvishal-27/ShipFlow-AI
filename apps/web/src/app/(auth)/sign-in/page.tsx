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
    if (res.error) {
      setError(res.error.message || "Sign in failed")
    } else {
      router.push("/dashboard")
    }
    setLoading(false)
  }

  async function handleGithub() {
    await authClient.signIn.social({ provider: "github" })
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 360, padding: 32, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Sign in</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Welcome back to ShipFlow AI</p>
        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div style={{ textAlign: "center", margin: "16px 0", color: "#9ca3af", fontSize: 13 }}>or</div>
        <button
          onClick={handleGithub}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#fff", border: "1px solid #e5e7eb", fontSize: 14, cursor: "pointer" }}
        >
          Continue with GitHub
        </button>
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 16, color: "#6b7280" }}>
          No account? <a href="/sign-up" style={{ color: "#18181b", fontWeight: 500 }}>Sign up</a>
        </p>
      </div>
    </div>
  )
}
