import "./globals.css"
import { Providers } from "@/components/providers"

export const metadata = {
  title: "ShipFlow AI — Feature to Production",
  description: "AI-powered product delivery platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            } catch(e) {}
          `
        }} />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
