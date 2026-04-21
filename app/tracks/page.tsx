"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function TracksPage() {
  const [tracks, setTracks] = useState<any[]>([])

  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: false })
      if (data) {
        setTracks(data)
      }
    }
    fetchTracks()
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Discover Tracks
      </h1>
      <div className="grid grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div key={track.id} className="border rounded-lg p-4 shadow">
            <img
              src={track.media_url}
              className="w-full h-48 object-cover rounded mb-4"
              alt={track.title}
            />
            <h2 className="text-xl font-semibold">
              {track.title}
            </h2>
            <p className="text-gray-600">
              {track.genre}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
