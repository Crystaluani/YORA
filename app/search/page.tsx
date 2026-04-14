"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function Search(){

const [query,setQuery] = useState("")
const [results,setResults] = useState<any[]>([])

const handleSearch = async ()=>{

const { data } = await supabase
.from("profiles")
.select("*")
.ilike("skills",`%${query}%`)

setResults(data || [])

}

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
Search Creators
</h1>

<input
placeholder="Search skills or creative fields..."
value={query}
onChange={(e)=>setQuery(e.target.value)}
className="border p-3 rounded w-full mb-4"
/>

<button
onClick={handleSearch}
className="bg-black text-white px-4 py-2 rounded"
>
Search
</button>

<div className="mt-8 space-y-4">

{results.map((creator)=>(
  
<div
key={creator.id}
className="border p-4 rounded-lg"
>

<p className="font-semibold">
{creator.name}
</p>

<p className="text-gray-500">
{creator.skills}
</p>

</div>

))}

</div>

</div>

)
}