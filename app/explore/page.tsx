import { supabase } from "@/libs/supabase"
import TrackCard from "@/components/TrackCard"

export default async function ExplorePage() {

const { data: projects } = await supabase
.from("projects")
.select("*")
.order("created_at", { ascending: false })

return (

<div className="p-10">

<h1 className="text-3xl font-bold mb-8">
Explore Creative Projects
</h1>

<div className="grid grid-cols-3 gap-6">

{projects?.map((project:any)=>(

<TrackCard
  key={project.id}
  id={project.id}
  title={project.title || "Untitled Project"}
  image={project.image_url || "/placeholder.png"}
  description={project.description || "No description yet"}
  artist={project.creator_id || "unknown"}
  likeCount={project.likes || 0}  // if likes column exists
  isLiked={false}                 // default false
/>

))}

</div>

</div>

)
}