"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"
import { useParams } from "next/navigation"
import ProjectCard from "@/components/ProjectCard"
import FollowButton from "@/components/FollowButton"
import Link from "next/link"
import CreateProjectWithAI from "@/components/CreateProjectWithAI"

export default function CreativeProfile() {

  const params = useParams()
  const id = params?.id as string

  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {

      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single()

      const { data: projectsData } = await supabase
        .from("projects")
        .select(`
          id,
          title,
          description,
          image_url,
          creator_id,
          project_likes ( user_id )
        `)
        .eq("creator_id", id)

      const formatted = projectsData?.map((project: any) => ({
        ...project,
        likeCount: project.project_likes.length,
        isLiked: project.project_likes.some(
          (like: any) => like.user_id === userData.user?.id
        )
      }))

      setProfile(profileData)
      setProjects(formatted || [])
    }

    fetchData()
  }, [id])

  if (!profile) {
    return <p className="p-10">Loading...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-5xl mx-auto px-6">

        {/* AI PROJECT CREATOR */}
        <div className="mb-10">
          <CreateProjectWithAI />
        </div>

        {/* Banner */}
        {profile.banner_url && (
          <img
            src={profile.banner_url}
            className="w-full h-64 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Profile */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">

          <div className="flex gap-6">

            <img
              src={profile.avatar_url || "/default-avatar.png"}
              className="w-24 h-24 rounded-full"
            />

            <div>

              <h1 className="text-2xl font-bold">
                {profile.name}
              </h1>

              <p className="text-gray-500">
                {profile.bio}
              </p>

              <div className="flex gap-4 mt-4">

                <FollowButton creatorId={id} />

                <Link href={`/messages/${id}`}>
                  <button className="border px-4 py-2 rounded-lg">
                    Message
                  </button>
                </Link>

              </div>

            </div>

          </div>

        </div>

        {/* Projects */}
        <h2 className="text-xl font-semibold mb-6">
          Projects
        </h2>

        <div className="grid grid-cols-3 gap-6">

          {projects.length > 0 ? (
            projects.map((project: any) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                image={project.image_url}
                description={project.description}
                creator={project.creator_id}
                likeCount={project.likeCount}
                isLiked={project.isLiked}
              />
            ))
          ) : (
            <p className="text-gray-500">No projects yet</p>
          )}

        </div>

      </div>

    </div>
  )
}