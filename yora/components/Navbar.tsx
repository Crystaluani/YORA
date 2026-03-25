import Link from "next/link"

export default function Navbar() {
  return (
    <div className="w-full border-b bg-white">

      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          YORA
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">

          <Link href="/feed" className="hover:text-black text-gray-600">
            Feed
          </Link>

          <Link href="/search" className="hover:text-black text-gray-600">
            Search
          </Link>

          <Link href="/jobs" className="hover:text-black text-gray-600">
            Jobs
          </Link>

          <Link href="/events" className="hover:text-black text-gray-600">
            Events
          </Link>

          <Link href="/opportunities" className="hover:text-black text-gray-600">
            Opportunities
          </Link>

          <Link href="/collaborations" className="hover:text-black text-gray-600">
            Collaborations
          </Link>

          <Link href="/messages" className="hover:text-black text-gray-600">
            Messages
          </Link>

          <Link href="/notifications" className="hover:text-black text-gray-600">
            Notifications
          </Link>

          <Link
            href="/dashboard"
            className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Dashboard
          </Link>

        </div>

      </div>

    </div>
  )
}