"use client"
import { useSession } from "@/lib/auth-client"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { trpc } from "@/lib/trpc"
import { Nav } from "@/components/nav"

export default function WorkspacePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const { data: workspace } = trpc.workspace.getBySlug.useQuery({ slug })

  useEffect(() => {
    if (!isPending && !session) router.push("/sign-in")
  }, [session, isPending, router])

  if (isPending) return null
  if (!session) return null

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "88px 24px 48px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #FF0052, #FF4080)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
              {slug.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{slug}</h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Free plan · 1 project</p>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 40, textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>��</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Create your first project</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, maxWidth: 360, margin: "0 auto 24px" }}>
            Projects organize your feature requests, PRDs, and GitHub repositories.
          </p>
          <button
            onClick={() => router.push(`/${slug}/projects/new`)}
            style={{ padding: "11px 24px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(255,0,82,0.35)" }}
          >
            Create project →
          </button>
        </div>
      </div>
    </div>
  )
}
