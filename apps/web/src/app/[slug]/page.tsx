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

  const projects = workspace?.projects || []

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav slug={slug} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "88px 24px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #FF0052, #FF4080)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20 }}>
              {slug.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>{slug}</h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Free plan · {projects.length} project{projects.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button onClick={() => router.push(`/${slug}/projects/new`)}
            style={{ padding: "9px 18px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600, boxShadow: "0 4px 14px rgba(255,0,82,0.3)" }}>
            + New Project
          </button>
        </div>

        {/* Projects list */}
        {projects.length === 0 ? (
          <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius-xl)", padding: 48, textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>No projects yet</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>Create your first project to start shipping features</p>
            <button onClick={() => router.push(`/${slug}/projects/new`)}
              style={{ padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: "#FF0052", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Create project →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projects.map((project: any) => (
              <div key={project.id}
                onClick={() => router.push(`/${slug}/projects/${project.id}`)}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "18px 20px", cursor: "pointer", boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.15s, transform 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-1px)" }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(0)" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      📋
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{project.name}</p>
                      {project.description && (
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{project.description}</p>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
