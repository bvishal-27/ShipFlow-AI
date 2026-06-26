"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

type Theme = "dark" | "light"

// Robust entry animation wrapper using clean CSS transitions triggered via IntersectionObserver
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true)
          observer.unobserve(el) // Stop tracking once animated in for better rendering performance
        }
      },
      { 
        threshold: 0.05,     // Triggers as soon as 5% of the element enters the screen
        rootMargin: "0px 0px -40px 0px" // Slight offset so it springs up naturally
      }
    )
    
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      opacity: hasEntered ? 1 : 0,
      transform: hasEntered ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      willChange: "transform, opacity"
    }}>
      {children}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null
    if (saved === "light") {
      setTheme("light")
      document.documentElement.setAttribute("data-theme", "light")
    } else {
      setTheme("dark")
      document.documentElement.setAttribute("data-theme", "dark")
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    document.documentElement.setAttribute("data-theme", nextTheme)
    localStorage.setItem("theme", nextTheme)
  }

  const isDark = theme === "dark"
  const colors = {
    bg: isDark ? "#09090b" : "#fafafa",
    textPrimary: isDark ? "#ffffff" : "#09090b",
    textSecondary: isDark ? "#a1a1aa" : "#4b5563",
    textTertiary: isDark ? "#52525b" : "#9ca3af",
    navBg: isDark ? "rgba(9, 9, 11, 0.7)" : "rgba(250, 250, 250, 0.7)",
    navBorder: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    cardBg: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.7)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
    cardShadow: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.05)",
    btnSecondaryBg: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
    btnSecondaryBorder: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
  }

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
    <div style={{ minHeight: "100vh", background: colors.bg, color: colors.textPrimary, overflowX: "hidden", fontFamily: "sans-serif", transition: "background 0.3s ease, color 0.3s ease" }}>

      {/* Premium Gradient mesh blobs background */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,0,82,${isDark ? "0.15" : "0.08"}) 0%, transparent 75%)`, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,0,82,${isDark ? "0.1" : "0.05"}) 0%, transparent 75%)`, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,107,157,${isDark ? "0.08" : "0.04"}) 0%, transparent 75%)`, filter: "blur(60px)" }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 60,
        background: colors.navBg,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${colors.navBorder}`,
        display: "flex", alignItems: "center",
        padding: "0 48px", gap: 8,
        transition: "background 0.3s ease, border-bottom 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #FF0052, #FF4080)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, boxShadow: "0 4px 12px rgba(255,0,82,0.4)" }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: colors.textPrimary }}>ShipFlow AI</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          
          <button onClick={toggleTheme} style={{ background: colors.btnSecondaryBg, border: `1px solid ${colors.btnSecondaryBorder}`, backdropFilter: "blur(10px)", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: 15, color: colors.textSecondary, lineHeight: 1, transition: "all 0.15s" }}>
            {isDark ? "☀️" : "🌙"}
          </button>

          <button onClick={() => router.push("/sign-in")}
            style={{ padding: "8px 16px", borderRadius: "6px", border: `1px solid ${colors.btnSecondaryBorder}`, background: "transparent", fontSize: 14, cursor: "pointer", color: colors.textPrimary, fontWeight: 500, transition: "all 0.2s" }}>
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

          <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 28, maxWidth: 850, margin: "0 auto 28px", color: colors.textPrimary }}>
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

          <p style={{ fontSize: 20, color: colors.textSecondary, maxWidth: 540, margin: "0 auto 44px", lineHeight: 1.7 }}>
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
              style={{ padding: "14px 36px", borderRadius: "8px", border: `1px solid ${colors.btnSecondaryBorder}`, background: colors.btnSecondaryBg, backdropFilter: "blur(10px)", color: colors.textPrimary, fontSize: 16, cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = colors.btnSecondaryBg}
            >
              Sign in
            </button>
          </div>
        </AnimatedSection>

        {/* Floating stats */}
        <AnimatedSection delay={150}>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {[
              { value: "8", label: "Pipeline Phases", icon: "🔄" },
              { value: "AI", label: "Code Reviews", icon: "🤖" },
              { value: "100%", label: "Type Safe", icon: "⚡" },
              { value: "Live", label: "GitHub Sync", icon: "🔀" },
            ].map((s, index) => (
              <div key={s.label} style={{
                padding: "20px 24px", borderRadius: "12px",
                background: colors.cardBg,
                backdropFilter: "blur(20px)",
                border: `1px solid ${colors.cardBorder}`,
                boxShadow: `0 4px 24px ${colors.cardShadow}`,
                textAlign: "center", minWidth: 120,
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border 0.3s, box-shadow 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#FF4080", letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
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
            <h2 style={{ fontSize: 40, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 48, color: colors.textPrimary }}>
              From idea to shipped in 8 steps
            </h2>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {steps.map((s, i) => (
              <AnimatedSection key={s.step} delay={i * 60}>
                <div style={{
                  background: i === steps.length - 1
                    ? "linear-gradient(135deg, rgba(255,0,82,0.15), rgba(255,107,157,0.05))"
                    : colors.cardBg,
                  backdropFilter: "blur(20px)",
                  border: i === steps.length - 1 ? "1px solid rgba(255,0,82,0.4)" : `1px solid ${colors.cardBorder}`,
                  borderRadius: "12px", padding: "24px 20px",
                  boxShadow: `0 4px 20px ${colors.cardShadow}`,
                  transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border 0.3s, box-shadow 0.3s",
                  height: "100%",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${colors.cardShadow}` }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: i === steps.length - 1 ? "#FF4080" : colors.textTertiary, marginBottom: 10, letterSpacing: "0.08em" }}>{s.step}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>{s.desc}</div>
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
            <h2 style={{ fontSize: 40, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 12, color: colors.textPrimary }}>
              Everything you need to ship faster
            </h2>
            <p style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center", marginBottom: 52 }}>
              AI handles the boring parts. You focus on building.
            </p>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 80}>
                <div style={{
                  background: colors.cardBg,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: "16px", padding: 28,
                  boxShadow: `0 4px 20px ${colors.cardShadow}`,
                  transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border 0.3s, box-shadow 0.3s",
                  height: "100%",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 50px ${isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${colors.cardShadow}` }}
                >
                  <div style={{ fontSize: 32, marginBottom: 14, animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}>{f.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: colors.textPrimary, marginBottom: 10 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.7 }}>{f.desc}</div>
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
            background: isDark ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.6)",
            backdropFilter: "blur(30px)",
            border: `1px solid ${colors.cardBorder}`,
            boxShadow: `0 8px 40px ${isDark ? "rgba(255,0,82,0.15)" : "rgba(255,0,82,0.06)"}`,
            transition: "background 0.3s, border 0.3s, box-shadow 0.3s"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: "float 2s ease-in-out infinite" }}>🚀</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16, color: colors.textPrimary }}>
              Ready to ship smarter?
            </h2>
            <p style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 32, lineHeight: 1.7 }}>
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
      <div style={{ position: "relative", zIndex: 1, padding: "20px 48px", borderTop: `1px solid ${colors.navBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "border-top 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#FF0052", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>S</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>ShipFlow AI</span>
        </div>
        <p style={{ fontSize: 12, color: colors.textTertiary }}>© 2026 ShipFlow AI · Built with ❤️ by BV</p>
      </div>
    </div>
  )
}