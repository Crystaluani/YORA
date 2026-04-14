"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"
import { useParams } from "next/navigation"

export default function ProjectPage() {

  const params = useParams()
  const id = params?.id as string

  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    const fetchProject = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()

      setProject(data)
    }

    fetchProject()
  }, [id])

  if (!project) {
    return <p className="p-10">Loading...</p>
  }

  return (
    <div className="max-w-3xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-4">
        {project.title}
      </h1>

      <img
        src={project.image_url}
        className="rounded-lg mb-4"
      />

      <p className="text-gray-600">
        {project.description}
      </p>

    </div>
  )
}