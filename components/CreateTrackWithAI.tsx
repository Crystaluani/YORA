"use client"

import { useState } from "react"
import AIProjectGenerator from "./AIProjectGenerator"
import { supabase } from "@/libs/supabase"

export default function CreateTrackWithAI() {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAI = (data: any) => {
    setTitle(data.title)
    setDescription(data.description)
  }

  const handleSubmit = async () => {
    if (!title || !description) return
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) return

    await supabase.from("tracks").insert({
      title,
      description,
      image_url: image,
      creator_id: user.id
    })

    setTitle("")
    setDescription("")
    setImage("")
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <AIProjectGenerator onGenerate={handleAI} />

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Post a Track</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Track title"
          className="w-full border p-2 rounded"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Track description"
          className="w-full border p-2 rounded"
        />

        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Cover image URL"
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Posting..." : "Post Track"}
        </button>
      </div>
    </div>
  )
}
