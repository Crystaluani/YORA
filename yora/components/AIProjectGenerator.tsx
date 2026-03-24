"use client"

import { useState } from "react"

export default function AIProjectGenerator({
  onGenerate
}: {
  onGenerate: (data: any) => void
}) {

  const [idea, setIdea] = useState("")
  const [loading, setLoading] = useState(false)

  const generateProject = async () => {
    if (!idea) return

    setLoading(true)

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        prompt: idea,
        type: "project"
      })
    })

    const data = await res.json()

    try {
      const parsed = JSON.parse(data.result)

      // 🔥 SEND DATA TO FORM
      onGenerate(parsed)

    } catch {
      console.error("AI parsing failed")
    }

    setLoading(false)
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">

      <h2 className="font-semibold mb-2">
        AI Project Generator
      </h2>

      <input
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe your idea..."
        className="w-full border p-2 rounded mb-2"
      />

      <button
        onClick={generateProject}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate with AI"}
      </button>

    </div>
  )
}