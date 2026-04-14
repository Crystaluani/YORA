"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function PostUpdate(){

const [content,setContent] = useState("")

const handlePost = async()=>{

const { data:userData } = await supabase.auth.getUser()

await supabase
.from("updates")
.insert({

creator_id: userData.user?.id,
content

})

setContent("")

alert("Update posted!")

}

return(

<div className="max-w-2xl mx-auto p-10">

<h1 className="text-3xl font-bold mb-6">
Post an Update
</h1>

<textarea
value={content}
onChange={(e)=>setContent(e.target.value)}
placeholder="Share an update with the community..."
className="w-full border p-4 mb-4"
/>

<button
onClick={handlePost}
className="bg-black text-white px-6 py-2 rounded"
>
Post Update
</button>

</div>

)

}