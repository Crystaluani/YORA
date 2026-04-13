"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function CreateOpportunity(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [requiredField,setRequiredField] = useState("")
const [location,setLocation] = useState("")

const createOpportunity = async () => {

const { data:userData } = await supabase.auth.getUser()

const { error } = await supabase
.from("opportunities")
.insert({

creator_id:userData.user?.id,
title,
description,
required_field:requiredField,
location

})

if(error){
alert(error.message)
}else{
alert("Opportunity posted!")
}

}

return(

<div className="p-10 max-w-xl">

<h1 className="text-3xl font-bold mb-6">
Post Collaboration Opportunity
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
onChange={(e)=>setRequiredField(e.target.value)}
>

<option value="">Needed Creative</option>
<option>Photographer</option>
<option>Musician</option>
<option>Designer</option>
<option>Videographer</option>
<option>Writer</option>

</select>

<input
className="border p-3 w-full mb-4"
placeholder="Location"
onChange={(e)=>setLocation(e.target.value)}
/>

<button
onClick={createOpportunity}
className="bg-black text-white p-3 w-full"
>
Post Opportunity
</button>

</div>

)

}