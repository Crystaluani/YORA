"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/libs/supabase"

export default function CreativeProfile() {

  const params = useParams()
  const id = params?.id as string

  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [followers, setFollowers] = useState<number>(0)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {

      // PROFILE
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single()

      // PROJECTS
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("creator_id", id)

      // FOLLOWERS COUNT
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", id)

      setProfile(profileData)
      setProjects(projectsData || [])
      setFollowers(count || 0)
    }

    fetchData()
  }, [id])

  if (!profile) {
    return <p className="p-10">Loading...</p>
  }

  return (
    <div className="max-w-6xl mx-auto p-10">

      {/* Banner */}
      {profile.banner_url && (
        <img
          src={profile.banner_url}
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
      )}

      {/* Profile */}
      <div className="flex items-center gap-6 mb-10">

        <img
          src={profile.avatar_url || "/default-avatar.png"}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div>

          <h1 className="text-3xl font-bold">
            {profile.name}
          </h1>

          <p className="text-gray-600">
            {profile.creative_field}
          </p>

          <p className="text-sm mt-2">
            {profile.location}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {followers} followers
          </p>

        </div>

      </div>

      {/* Bio */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700">{profile.bio}</p>
      </div>

      {/* Skills */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <p>{profile.skills}</p>
      </div>

      {/* Projects */}
      <h2 className="text-2xl font-semibold mb-6">Projects</h2>

      <div className="grid grid-cols-3 gap-6">

        {projects.map((project: any) => (
          <div key={project.id} className="border rounded-lg overflow-hidden shadow">

            <img
              src={project.media_url || project.image_url}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold">
                {project.title}
              </h3>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}