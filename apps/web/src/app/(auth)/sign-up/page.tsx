"use client"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await authClient.signUp.email({ name, email, password })
    if (res.error) {
      setError(res.error.message || "Sign up failed")
    } else {
      router.push("/dashboard")
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 360, padding: 32, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Create account</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Start shipping faster with AI</p>
        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
          />
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
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "10px 12px", borderRadius: 8, background: "#18181b", color: "#fff", fontSize: 14, cursor: "pointer", border: "none" }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 16, color: "#6b7280" }}>
          Already have an account? <a href="/sign-in" style={{ color: "#18181b", fontWeight: 500 }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
