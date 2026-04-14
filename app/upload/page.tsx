"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function UploadPage(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [category,setCategory] = useState("")
const [tags,setTags] = useState("")
const [tools,setTools] = useState("")
const [collaborators,setCollaborators] = useState("")
const [process,setProcess] = useState("")
const [file,setFile] = useState<File | null>(null)

const uploadProject = async () => {

const { data:userData } = await supabase.auth.getUser()

if(!file) return alert("Upload a file")

const filePath = `${Date.now()}-${file.name}`

const { error:uploadError } = await supabase.storage
.from("projects")
.upload(filePath,file)

if(uploadError){
alert(uploadError.message)
return
}

const { data } = supabase
  .storage
  .from("projects")
  .getPublicUrl(filePath)

const mediaUrl = data.publicUrl

const { error } = await supabase
.from("projects")
.insert({

creator_id:userData.user?.id,
title,
description,
category,
tags,
tools,
collaborators,
process,
media_url:mediaUrl

})

if(error){
alert(error.message)
}else{
alert("Project uploaded!")
}

}
return( 

<div className="p-10 max-w-2xl">

<h1 className="text-4xl font-bold mb-6">
Upload Creative Project
</h1>

<input
className="border p-3 w-full mb-4"
placeholder="Project Title"
onChange={(e)=>setTitle(e.target.value)}
/>

<textarea
className="border p-3 w-full mb-4"
placeholder="Project Description"
onChange={(e)=>setDescription(e.target.value)}
/>

<select
className="border p-3 w-full mb-4"
onChange={(e)=>setCategory(e.target.value)}
>

<option value="">Select Creative Field</option>
<option>Photography</option>
<option>Music</option>
<option>Film</option>
<option>Design</option>
<option>Fashion</option>
<option>Writing</option>

</select>

<input
className="border p-3 w-full mb-4"
placeholder="Tags"
onChange={(e)=>setTags(e.target.value)}
/>

<input
className="border p-3 w-full mb-4"
placeholder="Tools Used"
onChange={(e)=>setTools(e.target.value)}
/>

<input
className="border p-3 w-full mb-4"
placeholder="Collaborators"
onChange={(e)=>setCollaborators(e.target.value)}
/>

<textarea
className="border p-3 w-full mb-4"
placeholder="Creative Process"
onChange={(e)=>setProcess(e.target.value)}
/>

<input
type="file"
className="border p-3 w-full mb-4"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
/>

<button
onClick={uploadProject}
className="bg-black text-white p-3 w-full"
>
Upload Project
</button>

</div>

)

}