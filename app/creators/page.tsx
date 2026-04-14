"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"
import Link from "next/link"

export default function CreatorsPage(){

const [creators,setCreators] = useState<any[]>([])
const [search,setSearch] = useState("")

useEffect(()=>{

const fetchCreators = async () => {

const { data } = await supabase
.from("profiles")
.select("*")

if(data){
setCreators(data)
}

}

fetchCreators()

},[])

const filteredCreators = creators.filter((creator)=>
creator.name?.toLowerCase().includes(search.toLowerCase()) ||
creator.creative_field?.toLowerCase().includes(search.toLowerCase()) ||
creator.location?.toLowerCase().includes(search.toLowerCase())
)

return(

<div className="p-10">

<h1 className="text-4xl font-bold mb-6">
Discover Creators
</h1>

<input
className="border p-3 w-full mb-8"
placeholder="Search creators, skills, location..."
onChange={(e)=>setSearch(e.target.value)}
/>

<div className="grid grid-cols-3 gap-6">

{filteredCreators.map((creator)=>(
  
<Link key={creator.id} href={`/creators/${creator.id}`}>

<div className="border rounded-lg p-6 shadow cursor-pointer">

<h2 className="text-xl font-semibold">
{creator.name}
</h2>

<p className="text-gray-600">
{creator.creative_field}
</p>

<p className="text-sm mt-2">
{creator.location}
</p>

</div>

</Link>

))}

</div>

</div>

)

}