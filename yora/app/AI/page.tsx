"use client"

import { useState } from "react"

export default function AIAssistant() {

const [field,setField] = useState("")
const [goal,setGoal] = useState("")
const [response,setResponse] = useState("")

const generateIdeas = async () => {

const res = await fetch("/api/ai")

const data = await res.json()

setResponse(data.message)

}

return (

<div className="p-10 max-w-2xl mx-auto">

<h1 className="text-3xl font-bold mb-6">
YORA AI Creative Assistant
</h1>

<select
value={field}
onChange={(e)=>setField(e.target.value)}
className="border w-full p-3 rounded mb-4"
>

<option value="">Select Creative Field</option>
<option>Photographer</option>
<option>Musician</option>
<option>Filmmaker</option>
<option>Designer</option>
<option>Content Creator</option>

</select>

<select
value={goal}
onChange={(e)=>setGoal(e.target.value)}
className="border w-full p-3 rounded mb-4"
>

<option value="">What help do you need?</option>
<option>Content Ideas</option>
<option>Grow Audience</option>
<option>Promote Music</option>
<option>Find Collaborators</option>

</select>

<button
onClick={generateIdeas}
className="bg-black text-white px-6 py-2 rounded"
>
Generate AI Suggestions
</button>

<div className="mt-6 p-4 border rounded">

{response || "AI suggestions will appear here"}

</div>

</div>

)
}