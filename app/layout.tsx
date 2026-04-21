import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "YORA — Artist Discovery Platform",
  description: "Emerging artists get heard, discovered, and booked.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ background: "#080808", color: "#fff", margin: 0, padding: 0 }}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
