"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

function ThemeToggle() {
  const [dark, setDark] = useState(true) // Defaulting to dark for premium SaaS feel
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "light") { 
      document.documentElement.setAttribute("data-theme", "light")
      setDark(false) 
    } else {
      document.documentElement.setAttribute("data-theme", "dark")
      setDark(true)
    }
  }, [])
  function toggle() {
    const next = !dark; setDark(next)
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light")
    localStorage.setItem("theme", next ? "dark" : "light")
  }
  return (
    <button onClick={toggle} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: 15, color: "#a1a1aa", lineHeight: 1, transition: "all 0.15s" }}>
      {dark ? "☀️" : "🌙"}
    </button>
  )
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

export default function Home() {
  const router = useRouter()

  const features = [
    { icon: "🤖", title: "AI Clarification Agent", desc: "AI acts as your PM — asks targeted questions before writing a single requirement" },
    { icon: "📄", title: "Auto PRD Generation", desc: "Full 7-section product requirements doc generated in seconds from plain English" },
    { icon: "⚙️", title: "Smart Task Breakdown", desc: "Engineering tasks auto-created from PRD with priorities and Kanban board" },
    { icon: "🔀", title: "Real GitHub Integration", desc: "Live PR tracking via webhooks — reads actual diffs, no hardcoded data" },
    { icon: "🔍", title: "AI Code Review", desc: "AI checks your code against PRD acceptance criteria — blocking vs non-blocking" },
    { icon: "🚀", title: "Human Approval Gate", desc: "Final human decision with full audit trail before anything ships to production" },
  ]

  const steps = [
    { step: "01", title: "Submit Request", desc: "Plain English idea" },
    { step: "02", title: "AI Clarifies", desc: "Targeted questions" },
    { step: "03", title: "PRD Generated", desc: "Full requirements" },
    { step: "04", title: "Tasks Created", desc: "Kanban board" },
    { step: "05", title: "PR Tracked", desc: "Via webhook" },
    { step: "06", title: "AI Reviews", desc: "Checks criteria" },
    { step: "07", title: "Human Approves", desc: "Final gate" },
    { step: "08", title: "Shipped 🚀", desc: "Live in production" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa", overflowX: "hidden", fontFamily: "sans-serif" }}>

      {/* Gradient background blobs */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,0,82,0.15) 0%, transparent 75%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,0,82,0.1) 0%, transparent 75%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 75%)", filter: "blur(60px)" }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 60,
        background: "rgba(9, 9, 11, 0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex", alignItems: "center",
        padding: "0 48px", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #FF0052, #FF4080)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, boxShadow: "0 4px 12px rgba(255,0,82,0.4)" }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#fafafa" }}>ShipFlow AI</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <ThemeToggle />
          <button onClick={() => router.push("/sign-in")}
            style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", fontSize: 14, cursor: "pointer", color: "#fafafa", fontWeight: 500 }}>
            Sign in
          </button>
          <button onClick={() => router.push("/sign-up")}
            style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600, boxShadow: "0 4px 14px rgba(255,0,82,0.4)" }}>
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, padding: "160px 24px 100px", textAlign: "center" }}>
        <AnimatedSection>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 99, background: "rgba(255,0,82,0.1)", color: "#FF4080", fontSize: 12, fontWeight: 600, marginBottom: 28, border: "1px solid rgba(255,0,82,0.25)", backdropFilter: "blur(10px)" }}>
            ✨ AI-powered product delivery platform
          </div>

          <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 28, maxWidth: 850, margin: "0 auto 28px", color: "#ffffff" }}>
            Ship features from{" "}
            <span style={{ background: "linear-gradient(135deg, #FF0052 0%, #FF6B9D 50%, #FF0052 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }}>
              idea to production
            </span>
          </h1>

          <style>{`
            @keyframes shimmer {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
          `}</style>

          <p style={{ fontSize: 20, color: "#a1a1aa", maxWidth: 540, margin: "0 auto 44px", lineHeight: 1.7 }}>
            AI manages your entire software delivery lifecycle — from feature request to shipped code — automatically.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/sign-up")}
              style={{ padding: "14px 36px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #FF0052, #FF4080)", color: "#fff", fontSize: 16, cursor: "pointer", fontWeight: 700, boxShadow: "0 8px 30px rgba(255,0,82,0.4)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,0,82,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,0,82,0.4)" }}
            >
              Start building free →
            </button>
            <button onClick={() => router.push("/sign-in")}
              style={{ padding: "14px 36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", color: "#fafafa", fontSize: 16, cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            >
              Sign in
            </button>
          </div>
        </AnimatedSection>

        {/* Floating stats */}
        <AnimatedSection delay={200}>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {[
              { value: "8", label: "Pipeline Phases", icon: "🔄" },
              { value: "AI", label: "Code Reviews", icon: "🤖" },
              { value: "100%", label: "Type Safe", icon: "⚡" },
              { value: "Live", label: "GitHub Sync", icon: "🔀" },
            ].map(s => (
              <div key={s.label} style={{
                padding: "20px 24px", borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                textAlign: "center", minWidth: 120,
                transition: "transform 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#FF4080", letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#71717a", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Pipeline */}
      <div style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <AnimatedSection>
            <p style={{ fontSize: 12, fontWeight: 700, textAlign: "center", color: "#FF0052", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>The Pipeline</p>
            <h2 style={{ fontSize: 40, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 48, color: "#ffffff" }}>
              From idea to shipped in 8 steps
            </h2>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {steps.map((s, i) => (
              <AnimatedSection key={s.step} delay={i * 80}>
                <div style={{
                  background: i === steps.length - 1
                    ? "linear-gradient(135deg, rgba(255,0,82,0.15), rgba(255,107,157,0.05))"
                    : "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(20px)",
                  border: i === steps.length - 1 ? "1px solid rgba(255,0,82,0.4)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", padding: "24px 20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  height: "100%",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)" }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: i === steps.length - 1 ? "#FF4080" : "#52525b", marginBottom: 10, letterSpacing: "0.08em" }}>{s.step}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <AnimatedSection>
            <p style={{ fontSize: 12, fontWeight: 700, textAlign: "center", color: "#FF0052", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Features</p>
            <h2 style={{ fontSize: 40, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 12, color: "#ffffff" }}>
              Everything you need to ship faster
            </h2>
            <p style={{ fontSize: 16, color: "#a1a1aa", textAlign: "center", marginBottom: 52 }}>
              AI handles the boring parts. You focus on building.
            </p>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 100}>
                <div style={{
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px", padding: 28,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  height: "100%",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.4)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)" }}
                >
                  <div style={{ fontSize: 32, marginBottom: 14, animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}>{f.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 10 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px" }}>
        <AnimatedSection>
          <div style={{
            maxWidth: 640, margin: "0 auto", textAlign: "center",
            padding: 56, borderRadius: 24,
            background: "rgba(255,255,255,0.01)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 8px 40px rgba(255,0,82,0.15)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: "float 2s ease-in-out infinite" }}>🚀</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16, color: "#ffffff" }}>
              Ready to ship smarter?
            </h2>
            <p style={{ fontSize: 16, color: "#a1a1aa", marginBottom: 32, lineHeight: 1.7 }}>
              Create your workspace in 30 seconds.<br />No credit card required.
            </p>
            <button onClick={() => router.push("/sign-up")}
              style={{ padding: "16px 48px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #FF0052, #FF4080)", color: "#fff", fontSize: 16, cursor: "pointer", fontWeight: 700, boxShadow: "0 8px 30px rgba(255,0,82,0.4)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,0,82,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,0,82,0.4)" }}
            >
              Start building free →
            </button>
          </div>
        </AnimatedSection>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1, padding: "20px 48px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#FF0052", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>S</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>ShipFlow AI</span>
        </div>
        <p style={{ fontSize: 12, color: "#52525b" }}>© 2026 ShipFlow AI · Built with ❤️ by BV</p>
      </div>
    </div>
  )
}