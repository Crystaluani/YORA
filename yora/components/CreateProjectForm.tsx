"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function CreateProjectForm() {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !description) return

    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      setLoading(false)
      return
    }

    await supabase.from("projects").insert({
      title,
      description,
      image_url: image,
      creator_id: user.id
    })

    // reset
    setTitle("")
    setDescription("")
    setImage("")
    setLoading(false)
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">

      <h2 className="font-semibold">Create Project</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project title"
        className="w-full border p-2 rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project description"
        className="w-full border p-2 rounded"
      />

      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Posting..." : "Post Project"}
      </button>

    </div>
  )
}