import { supabase } from "@/libs/supabase"
import ProjectCard from "@/components/ProjectCard"

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

<ProjectCard
key={project.id}
id={project.id}
title={project.title}
image={project.image_url}
/>

))}

</div>

</div>

)
}