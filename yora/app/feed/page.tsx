import { supabase } from "@/libs/supabase"
import ProjectCard from "@/components/ProjectCard"
import CreateProjectWithAI from "@/components/CreateProjectWithAI"

export default async function Feed() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

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
    .order("created_at", { ascending: false })

  const formattedProjects = projects?.map((project: any) => ({
    ...project,
    likeCount: project.project_likes.length,
    isLiked: project.project_likes.some(
      (like: any) => like.user_id === user?.id
    )
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-2xl mx-auto space-y-10">

        {/* 🔥 HERO HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Discover Creative Work
          </h1>
          <p className="text-gray-500 mt-2">
            Explore, create, and collaborate with creators
          </p>
        </div>

        {/* 🤖 AI CREATION */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <CreateProjectWithAI />
        </div>

        {/* 🧱 FEED */}
        <div className="space-y-6">

          {formattedProjects?.length === 0 && (
            <p className="text-center text-gray-400">
              No projects yet
            </p>
          )}

          {formattedProjects?.map((project: any) => (
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
          ))}

        </div>

      </div>

    </div>
  )
}