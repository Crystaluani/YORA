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
          The Career Network for Creatives
        </h1>

        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
          Discover talent, collaborate on projects, and grow your creative career with AI-powered tools.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            href="/feed"
            className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Explore Projects
          </Link>

          <Link
            href="/creatives"
            className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Discover Creators
          </Link>

        </div>

      </div>

      {/* 🔥 TRENDING */}
      <div className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-2xl font-semibold mb-8">
          Trending Creative Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {projects?.map((project: any) => (
            <Link
              href={`/creatives/${project.creator_id}`}
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
              </div>

            </Link>
          ))}

        </div>

      </div>

      {/* 🔥 FEATURED */}
      <div className="max-w-5xl mx-auto px-6 py-16">

        <h2 className="text-2xl font-semibold mb-8">
          Featured Creative Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            {
              title: "Fashion Photography",
              img: "https://images.unsplash.com/photo-1492724441997-5dc865305da7"
            },
            {
              title: "Music Production",
              img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
            },
            {
              title: "Film Direction",
              img: "https://images.unsplash.com/photo-1526947425960-945c6e72858f"
            }
          ].map((item, i) => (

            <div
              key={i}
              className="bg-white rounded-2xl shadow p-4"
            >

              <img
                src={item.img}
                className="rounded-lg mb-3"
              />

              <p className="font-semibold">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}