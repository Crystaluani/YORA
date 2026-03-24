"use client"

import { supabase } from "@/libs/supabase"
import ProjectCard from "@/components/ProjectCard"
import AICollaborators from "@/components/AICollaborators"
import FollowButton from "@/components/FollowButton"
import CollabRequestButton from "@/components/CollabRequestButton"
import AIProjectGenerator from "@/components/AIProjectGenerator"
import Link from "next/link"
import CreateProjectWithAI from "@/components/CreateProjectWithAI"

<CreateProjectWithAI />
export default async function CreativeProfile({ params }: any) {

  const { id } = params

  // ✅ Get current user (for likes)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  // ✅ FIXED PROJECT QUERY
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      image_url,
      creator_id,
      project_likes (
        user_id
      )
    `)
    .eq("creator_id", id)

  // ✅ FORMAT PROJECTS
  const formattedProjects = projects?.map((project: any) => ({
    ...project,
    likeCount: project.project_likes.length,
    isLiked: project.project_likes.some(
      (like: any) => like.user_id === user?.id
    )
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-5xl mx-auto px-6">

        {/* Banner */}
        {profile?.banner_url && (
          <img
            src={profile.banner_url}
            className="w-full h-64 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">

          <div className="flex items-center gap-6">

            <img
              src={profile?.avatar_url || "/default-avatar.png"}
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div className="flex-1">

              <h1 className="text-2xl font-bold">
                {profile?.name || "Creative"}
              </h1>

              <p className="text-gray-500 mt-1">
                {profile?.skills || "Creative Professional"}
              </p>

              <p className="mt-3 text-gray-700 max-w-xl">
                {profile?.bio || "No bio yet"}
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

        <div className="mb-10">

        </div>

        {/* Projects Section */}
        <h2 className="text-xl font-semibold mb-6">
          Projects
        </h2>

        <div className="grid grid-cols-3 gap-6">

          {formattedProjects && formattedProjects.length > 0 ? (

            formattedProjects.map((project: any) => (
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

            <div className="text-gray-500">
              No projects yet
            </div>

          )}

        </div>

      </div>

    </div>
  )
}
