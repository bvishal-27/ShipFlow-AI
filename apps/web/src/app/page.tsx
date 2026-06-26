"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark")
      setDark(true)
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light")
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <button onClick={toggle} style={{
      background: "none", border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)", padding: "6px 10px",
      cursor: "pointer", fontSize: 15, color: "var(--text-secondary)",
      transition: "all 0.15s", lineHeight: 1,
    }}>
      {dark ? "☀️" : "🌙"}
    </button>
  )
}

export default function Home() {
  const router = useRouter()

  const features = [
    { icon: "🤖", title: "AI Clarification", desc: "AI asks the right questions before writing a single line of requirements" },
    { icon: "📄", title: "Auto PRD Generation", desc: "Full product requirements doc generated in seconds from your idea" },
    { icon: "⚙️", title: "Task Breakdown", desc: "Engineering tasks auto-created from PRD with priorities and kanban board" },
    { icon: "🔀", title: "GitHub Integration", desc: "Real PR tracking via webhooks — no hardcoded data, ever" },
    { icon: "🔍", title: "AI Code Review", desc: "AI reads your actual diff and checks it against acceptance criteria" },
    { icon: "🚀", title: "Human Approval Gate", desc: "Final human decision with full audit trail before shipping" },
  ]

  const steps = [
    { step: "01", title: "Submit Request", desc: "Describe your feature in plain English" },
    { step: "02", title: "AI Clarifies", desc: "AI asks targeted questions to understand requirements" },
    { step: "03", title: "PRD Generated", desc: "Full requirements doc created automatically" },
    { step: "04", title: "Tasks Created", desc: "Engineering tasks on a Kanban board" },
    { step: "05", title: "PR Tracked", desc: "GitHub PR linked via webhook automatically" },
    { step: "06", title: "AI Reviews", desc: "Code checked against PRD criteria" },
    { step: "07", title: "Human Approves", desc: "Final gate before production" },
    { step: "08", title: "Shipped 🚀", desc: "Feature marked as live" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 60, backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        padding: "0 48px", gap: 8,
        background: "var(--bg-card)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #FF0052, #FF4080)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>ShipFlow AI</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <ThemeToggle />
          <button onClick={() => router.push("/sign-in")}
            style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "none", fontSize: 14, cursor: "pointer", color: "var(--text-primary)", fontWeight: 500 }}>
            Sign in
          </button>
          <button onClick={() => router.push("/sign-up")}
            style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600, boxShadow: "0 4px 14px rgba(255,0,82,0.35)" }}>
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: 120, paddingBottom: 80, textAlign: "center", padding: "120px 24px 80px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: "var(--accent-light)", color: "var(--accent)", fontSize: 12, fontWeight: 600, marginBottom: 24, border: "1px solid #FFB3CA" }}>
          ✨ Built for ChaiCode Hackathon 2026
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24, maxWidth: 800, margin: "0 auto 24px", color: "var(--text-primary)" }}>
          Ship features from{" "}
          <span style={{ background: "linear-gradient(135deg, #FF0052, #FF6B9D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            idea to production
          </span>
        </h1>

        <p style={{ fontSize: 20, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          AI manages your entire software delivery lifecycle — from feature request to shipped code — automatically.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/sign-up")}
            style={{ padding: "14px 32px", borderRadius: "var(--radius-lg)", border: "none", background: "#FF0052", color: "#fff", fontSize: 16, cursor: "pointer", fontWeight: 700, boxShadow: "0 4px 20px rgba(255,0,82,0.4)" }}>
            Start building free →
          </button>
          <button onClick={() => router.push("/sign-in")}
            style={{ padding: "14px 32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 16, cursor: "pointer", fontWeight: 500 }}>
            Sign in
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
          {[
            { value: "8", label: "Pipeline Phases" },
            { value: "AI", label: "Powered Reviews" },
            { value: "100%", label: "Type Safe API" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#FF0052", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div style={{ padding: "60px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, textAlign: "center", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 40 }}>
            The Pipeline
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {steps.map((s, i) => (
              <div key={s.step} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", padding: 20,
                boxShadow: "var(--shadow-sm)",
                borderTop: i === steps.length - 1 ? "2px solid #FF0052" : "1px solid var(--border)"
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 8, letterSpacing: "0.05em" }}>{s.step}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 12, color: "var(--text-primary)" }}>
            Everything you need to ship faster
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", textAlign: "center", marginBottom: 48 }}>
            AI handles the boring parts. You focus on building.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)", padding: 24,
                boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16, color: "var(--text-primary)" }}>
            Ready to ship smarter?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32 }}>
            Create your workspace in 30 seconds. No credit card required.
          </p>
          <button onClick={() => router.push("/sign-up")}
            style={{ padding: "16px 40px", borderRadius: "var(--radius-lg)", border: "none", background: "#FF0052", color: "#fff", fontSize: 16, cursor: "pointer", fontWeight: 700, boxShadow: "0 4px 20px rgba(255,0,82,0.4)" }}>
            Start building free →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "24px 48px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#FF0052", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>S</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>ShipFlow AI</span>
        </div>
       <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>© 2026 ShipFlow AI · Built by BV</p>
       </div>
    </div>
  )
}
