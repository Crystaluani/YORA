"use client"

import { useState } from "react"

export default function AICollaborators() {

const [results,setResults] = useState<string[]>([])

const findCollaborators = async () => {

const res = await fetch("/api/ai-collab")

const data = await res.json()

setResults(data.suggestions)

}

return (

<div className="mt-6">

<button
onClick={findCollaborators}
className="bg-purple-600 text-white px-5 py-2 rounded"
>

Find AI Collaborators

</button>

<div className="mt-4">

{results.map((item,i)=>(

<p key={i} className="border p-2 rounded mb-2">
{item}
</p>

))}

</div>

</div>

)

}