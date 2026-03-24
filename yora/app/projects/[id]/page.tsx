import { supabase } from "@/libs/supabase"

export default async function ProjectPage({ params }: any) {

const { data: project } = await supabase
.from("projects")
.select("*")
.eq("id", params.id)
.single()

return (

<div className="p-10 max-w-4xl mx-auto">

<img
src={project?.media_url}
className="w-full rounded-lg mb-6"
/>

<h1 className="text-3xl font-bold mb-4">
{project?.title}
</h1>

<p className="text-gray-600 mb-6">
{project?.description}
</p>

<p className="text-sm">
Tools used: {project?.tools}
</p>

</div>

)

}