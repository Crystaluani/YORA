"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function ProjectsPage(){

const [projects,setProjects] = useState<any[]>([])

useEffect(()=>{

const fetchProjects = async () => {

const { data } = await supabase
.from("projects")
.select("*")
.order("created_at",{ascending:false})

if(data){
setProjects(data)
}

}

fetchProjects()

},[])

return(

<div className="p-10">

<h1 className="text-4xl font-bold mb-8">
Explore Creative Projects
</h1>

<div className="grid grid-cols-3 gap-6">

{projects.map((project)=> (

<div key={project.id} className="border rounded-lg p-4 shadow">

<img
src={project.media_url}
className="w-full h-48 object-cover rounded mb-4"
/>

<h2 className="text-xl font-semibold">
{project.title}
</h2>

<p className="text-gray-600">
{project.category}
</p>

</div>

))}

</div>

</div>

)

}