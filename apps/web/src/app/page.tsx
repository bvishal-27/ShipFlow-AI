"use client"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ padding: "0 48px", height: 60, display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #FF0052, #FF0052)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>ShipFlow AI</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button onClick={() => router.push("/sign-in")} style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "none", fontSize: 14, cursor: "pointer", color: "var(--text-primary)" }}>Sign in</button>
          <button onClick={() => router.push("/sign-up")} style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, #FF0052, #FF0052)", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: "var(--accent-light)", color: "var(--accent)", fontSize: 12, fontWeight: 500, marginBottom: 24, border: "1px solid #FFB3CA" }}>
          ✨ AI-powered product delivery
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20, maxWidth: 700, color: "var(--text-primary)" }}>
          Ship features from<br />
          <span style={{ background: "linear-gradient(135deg, #FF0052, #FF0052)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>idea to production</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 520, marginBottom: 36, lineHeight: 1.7 }}>
          ShipFlow AI manages your entire software delivery lifecycle — from feature request to shipped code — with AI at every step.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => router.push("/sign-up")} style={{ padding: "12px 28px", borderRadius: "var(--radius-lg)", border: "none", background: "linear-gradient(135deg, #FF0052, #FF0052)", color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 600, boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
            Start building free →
          </button>
          <button onClick={() => router.push("/sign-in")} style={{ padding: "12px 28px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 15, cursor: "pointer", fontWeight: 500 }}>
            Sign in
          </button>
        </div>

        {/* Pipeline steps */}
        <div style={{ marginTop: 72, display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
          {["Feature Request", "AI Clarifies", "PRD Generated", "Tasks Created", "PR Tracked", "AI Reviews", "Human Approves", "🚀 Shipped"].map((step, i, arr) => (
            <div key={step} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "8px 16px", borderRadius: 99,
                background: i === arr.length - 1 ? "linear-gradient(135deg, #FF0052, #FF0052)" : "var(--bg-card)",
                border: `1px solid ${i === arr.length - 1 ? "transparent" : "var(--border)"}`,
                fontSize: 13, fontWeight: 500,
                color: i === arr.length - 1 ? "#fff" : "var(--text-primary)",
                boxShadow: "var(--shadow-sm)",
                whiteSpace: "nowrap"
              }}>
                {step}
              </div>
              {i < arr.length - 1 && <span style={{ color: "var(--text-tertiary)", margin: "0 4px", fontSize: 12 }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
// deploy
