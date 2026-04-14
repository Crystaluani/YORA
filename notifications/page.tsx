"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function NotificationsPage(){

const [notifications,setNotifications] = useState<any[]>([])

useEffect(()=>{

const fetchNotifications = async()=>{

const { data:userData } = await supabase.auth.getUser()

const { data } = await supabase
.from("notifications")
.select("*")
.eq("user_id",userData.user?.id)
.order("created_at",{ascending:false})

setNotifications(data || [])

}

fetchNotifications()

},[])

return(

<div className="max-w-3xl mx-auto p-10">

<h1 className="text-3xl font-bold mb-6">
Notifications
</h1>

{notifications.map((note)=> (

<div key={note.id} className="border p-4 rounded mb-4">

<p>{note.message}</p>

</div>

))}

</div>

)

}