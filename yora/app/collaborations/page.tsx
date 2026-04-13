"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function CollaborationInbox(){

const [requests,setRequests] = useState<any[]>([])

useEffect(()=>{

loadRequests()

},[])

const loadRequests = async ()=>{

const { data:{ user } } = await supabase.auth.getUser()

const { data } = await supabase
.from("collaboration_requests")
.select("*")
.eq("receiver_id",user?.id)

setRequests(data || [])

}

const updateStatus = async(id:string,status:string)=>{

await supabase
.from("collaboration_requests")
.update({status})
.eq("id",id)

loadRequests()

}

return(

<div className="py-10">

<h1 className="text-3xl font-bold mb-8">
Collaboration Requests
</h1>

<div className="space-y-6">

{requests.map((req)=>(

<div
key={req.id}
className="border p-6 rounded-lg shadow"
>

<p className="mb-4">{req.message}</p>

<p className="text-sm text-gray-500 mb-4">
Status: {req.status}
</p>

<div className="flex gap-4">

<button
onClick={()=>updateStatus(req.id,"accepted")}
className="bg-green-600 text-white px-4 py-10 rounded"
>
Accept
</button>

<button
onClick={()=>updateStatus(req.id,"declined")}
className="bg-red-600 text-white px-4 py-10 rounded"
>
Decline
</button>

</div>

</div>

))}

</div>

</div>

)

}