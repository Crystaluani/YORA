"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function EditProfile(){

const [avatar,setAvatar] = useState<File | null>(null)
const [banner,setBanner] = useState<File | null>(null)

const uploadImages = async()=>{

const { data:userData } = await supabase.auth.getUser()
const userId = userData.user?.id

if(avatar){

const { data } = await supabase.storage
.from("avatars")
.upload(`${userId}.png`,avatar,{upsert:true})

const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${data?.path}`

await supabase
.from("profiles")
.update({ avatar_url:url })
.eq("id",userId)

}

if(banner){

const { data } = await supabase.storage
.from("banners")
.upload(`${userId}.png`,banner,{upsert:true})

const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/banners/${data?.path}`

await supabase
.from("profiles")
.update({ banner_url:url })
.eq("id",userId)

}

alert("Profile updated!")

}

return(

<div className="max-w-xl mx-auto p-10">

<h1 className="text-3xl font-bold mb-6">
Edit Profile
</h1>

<p className="mb-2">Upload Avatar</p>

<input
type="file"
onChange={(e)=>setAvatar(e.target.files?.[0] || null)}
className="mb-6"
/>

<p className="mb-2">Upload Banner</p>

<input
type="file"
onChange={(e)=>setBanner(e.target.files?.[0] || null)}
className="mb-6"
/>

<button
onClick={uploadImages}
className="bg-black text-white px-6 py-2 rounded"
>
Save Images
</button>

</div>

)

}