"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const id = params.id
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    fetchProject()
  }, [])

  const fetchProject = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
    setProject(data)
  }

  return (
    <div className="p-6">
      {project ? (
        <>
          <h1 className="font-bold text-2xl mb-4">{project.title}</h1>
          <img src={project.image_url} className="mb-4 rounded-lg" />
          <p>{project.description}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}