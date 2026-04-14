"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function ProfileSetup(){

const [name,setName] = useState("")
const [field,setField] = useState("")
const [skills,setSkills] = useState("")
const [tools,setTools] = useState("")
const [location,setLocation] = useState("")
const [bio,setBio] = useState("")

const saveProfile = async () => {

const { data:userData } = await supabase.auth.getUser()

const { error } = await supabase
.from("profiles")
.insert({

id:userData.user?.id,
name,
creative_field:field,
skills,
tools,
location,
bio,

})

if(error){
alert(error.message)
}else{
alert("Profile created!")
}

}

return(

<div className="p-10 max-w-xl">

<h1 className="text-3xl font-bold mb-6">
Create Your Creator Profile
</h1>

<input
className="border p-3 w-full mb-4"
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<select
className="border p-3 w-full mb-4"
onChange={(e)=>setField(e.target.value)}
>

<option>Select Creative Field</option>
<option>Photographer</option>
<option>Musician</option>
<option>Filmmaker</option>
<option>Designer</option>
<option>Writer</option>
<option>Model</option>

</select>

<input
className="border p-3 w-full mb-4"
placeholder="Skills"
onChange={(e)=>setSkills(e.target.value)}
/>

<input
className="border p-3 w-full mb-4"
placeholder="Tools Used"
onChange={(e)=>setTools(e.target.value)}
/>

<input
className="border p-3 w-full mb-4"
placeholder="Location"
onChange={(e)=>setLocation(e.target.value)}
/>

<textarea
className="border p-3 w-full mb-4"
placeholder="Bio"
onChange={(e)=>setBio(e.target.value)}
/>
<input
type="text"
placeholder="Skills (example: Photographer, Portrait, Fashion)"
value={skills}
onChange={(e)=>setSkills(e.target.value)}
className="w-full border p-3 rounded mb-4"
/>
<button
onClick={saveProfile}
className="bg-black text-white p-3 w-full"
>
Save Profile
</button>

</div>

)

}