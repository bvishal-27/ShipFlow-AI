"use client"
import { useParams, useRouter } from "next/navigation"
import { Nav } from "@/components/nav"
import { useState } from "react"

export default function BillingPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PRO", workspaceSlug: slug }),
      })
      const data = await res.json()
      if (data.orderId) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: "INR",
          name: "ShipFlow AI",
          description: "Pro Plan — Monthly",
          order_id: data.orderId,
          handler: async (response: any) => {
            await fetch("/api/billing/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, workspaceSlug: slug }),
            })
            alert("Payment successful! You are now on Pro plan.")
            router.refresh()
          },
          prefill: { name: "Vishal", email: "vishal@example.com" },
          theme: { color: "#FF0052" },
        }
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      current: true,
      features: [
        "1 project",
        "50 AI credits/month",
        "1 GitHub repo",
        "Basic AI review",
        "Community support",
      ],
      cta: "Current Plan",
      disabled: true,
    },
    {
      name: "Pro",
      price: "₹999",
      period: "per month",
      current: false,
      features: [
        "Unlimited projects",
        "500 AI credits/month",
        "Unlimited GitHub repos",
        "Advanced AI review",
        "Priority support",
        "Custom workflows",
      ],
      cta: "Upgrade to Pro",
      disabled: false,
    },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} />
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "88px 24px 48px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Billing & Plans</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Manage your workspace plan and usage</p>
        </div>

        {/* Usage */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 24, marginBottom: 28, boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Current Usage</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "AI Credits Used", value: "12", total: "50", color: "#FF0052" },
              { label: "Projects", value: "1", total: "1", color: "#D97706" },
              { label: "GitHub Repos", value: "1", total: "1", color: "#2563EB" },
            ].map(u => (
              <div key={u.label} style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)" }}>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>{u.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: u.color }}>{u.value}<span style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 400 }}>/{u.total}</span></p>
                <div style={{ marginTop: 8, height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(parseInt(u.value) / parseInt(u.total)) * 100}%`, background: u.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              background: plan.current ? "var(--bg-card)" : "linear-gradient(135deg, rgba(255,0,82,0.05), rgba(255,107,157,0.05))",
              border: plan.current ? "1px solid var(--border)" : "2px solid #FF0052",
              borderRadius: "var(--radius-xl)", padding: 28,
              boxShadow: plan.current ? "var(--shadow-sm)" : "0 8px 30px rgba(255,0,82,0.15)",
              position: "relative",
            }}>
              {!plan.current && (
                <div style={{ position: "absolute", top: -12, right: 20, background: "#FF0052", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 99 }}>
                  RECOMMENDED
                </div>
              )}
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: plan.current ? "var(--text-primary)" : "#FF0052" }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", marginLeft: 6 }}>{plan.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <span style={{ color: "#FF0052", fontWeight: 600 }}>✓</span>
                    <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={plan.disabled ? undefined : handleUpgrade}
                disabled={plan.disabled || loading}
                style={{
                  width: "100%", padding: "11px",
                  borderRadius: "var(--radius-md)", border: "none",
                  background: plan.disabled ? "var(--bg-secondary)" : "#FF0052",
                  color: plan.disabled ? "var(--text-tertiary)" : "#fff",
                  fontSize: 14, fontWeight: 600,
                  cursor: plan.disabled ? "default" : "pointer",
                  boxShadow: plan.disabled ? "none" : "0 4px 14px rgba(255,0,82,0.35)",
                }}>
                {loading && !plan.disabled ? "Processing..." : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
