"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function UploadProject(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [file,setFile] = useState<File | null>(null)

const handleUpload = async()=>{

const { data:userData } = await supabase.auth.getUser()
const userId = userData.user?.id

if(!file) return

const fileName = `${Date.now()}-${file.name}`

const { data } = await supabase.storage
.from("projects")
.upload(fileName,file)

const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${data?.path}`

await supabase
.from("projects")
.insert({

creator_id:userId,
title,
description,
image_url:imageUrl

})

alert("Project uploaded!")

}

return(

<div className="max-w-xl mx-auto p-10">

<h1 className="text-3xl font-bold mb-6">
Upload Project
</h1>

<input
type="text"
placeholder="Project title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="border w-full p-3 mb-4"
/>

<textarea
placeholder="Project description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="border w-full p-3 mb-4"
/>

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
className="mb-4"
/>

<button
onClick={handleUpload}
className="bg-black text-white px-6 py-3 rounded"
>
Upload Project
</button>

</div>

)

}