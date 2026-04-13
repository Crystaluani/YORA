import Link from "next/link"
import { supabase } from "@/libs/supabase"

export default async function Home() {

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 HERO */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">

        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Get Your Music Heard. Get Discovered. Get Booked.
        </h1>

        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
          A platform for emerging artists to showcase their sound, grow their audience, and access real opportunities.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            href="/feed"
            className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Discover Music
          </Link>

          <Link
            href="/artists"
            className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Join as an Artist
          </Link>

        </div>

      </div>

      {/* 🔥 TRENDING TRACKS */}
      <div className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-2xl font-semibold mb-8">
          Trending Tracks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {projects?.map((project: any) => (
            <Link
              href={`/artists/${project.creator_id}`}
              key={project.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >

              <img
                src={project.image_url}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <p className="font-semibold">
                  {project.title}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  @{project.artist_name || "emerging_artist"}
                </p>
              </div>

            </Link>
          ))}

        </div>

      </div>

      {/* 🔥 BROWSE BY GENRE */}
      <div className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-2xl font-semibold mb-8">
          Browse by Genre
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            {
              title: "Afrobeats",
              img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
            },
            {
              title: "Hip-Hop",
              img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
            },
            {
              title: "R&B",
              img: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae"
            }
          ].map((item, i) => (

            <div
              key={i}
              className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition cursor-pointer"
            >

              <img
                src={item.img}
                className="rounded-lg mb-3 h-40 w-full object-cover"
              />

              <p className="font-semibold">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* 🔥 CTA SECTION */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">

        <h2 className="text-3xl font-bold mb-4">
          Ready to share your sound?
        </h2>

        <p className="text-gray-500 mb-8">
          Join a growing community of artists and start getting discovered today.
        </p>

        <Link
          href="/artists"
          className="bg-black text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
        >
          Create Your Artist Profile
        </Link>

      </div>

    </div>
  )
} 