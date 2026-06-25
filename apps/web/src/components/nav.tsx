"use client"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "@/lib/auth-client"

export function Nav({ slug, projectId }: { slug?: string; projectId?: string }) {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 56,
      background: "rgba(250,250,249,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "0 24px",
      gap: 8,
    }}>
      <div
        onClick={() => router.push(slug ? `/${slug}` : "/dashboard")}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginRight: 16 }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "linear-gradient(135deg, #FF0052, #FF0052)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: "#fff", fontWeight: 700
        }}>S</div>
        <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>ShipFlow</span>
      </div>

      {slug && (
        <>
          <span style={{ color: "var(--border)", fontSize: 16 }}>/</span>
          <button
            onClick={() => router.push(`/${slug}`)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--text-secondary)", padding: "4px 8px", borderRadius: "var(--radius-sm)" }}
          >
            {slug}
          </button>
        </>
      )}

      {slug && projectId && (
        <>
          <span style={{ color: "var(--border)", fontSize: 16 }}>/</span>
          <button
            onClick={() => router.push(`/${slug}/projects/${projectId}`)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--text-secondary)", padding: "4px 8px", borderRadius: "var(--radius-sm)" }}
          >
            project
          </button>
        </>
      )}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        {session && (
          <>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #FF0052, #FF0052)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, color: "#fff", fontWeight: 600
            }}>
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => signOut().then(() => router.push("/sign-in"))}
              style={{
                background: "none", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "5px 12px",
                fontSize: 13, color: "var(--text-secondary)", cursor: "pointer"
              }}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
