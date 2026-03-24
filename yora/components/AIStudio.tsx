"use client"

import { useState } from "react"

export default function AIStudio(){

const [input,setInput] = useState("")
const [result,setResult] = useState("")

const generate = async ()=>{

const res = await fetch("/api/ai",{
method:"POST",
body: JSON.stringify({ prompt: input })
})

const data = await res.json()
setResult(data.result)

}

return(

<div className="max-w-2xl mx-auto p-6 border rounded-lg mt-10">

<h2 className="text-xl font-semibold mb-4">
AI Creative Assistant
</h2>

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Describe your content idea..."
className="w-full border p-2 rounded mb-3"
/>

<button
onClick={generate}
className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
>
Generate
</button>

{result && (
<div className="mt-6 whitespace-pre-line">
{result}
</div>
)}

</div>

)

}