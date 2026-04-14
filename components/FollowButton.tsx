"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/libs/supabase"

export default function FollowButton({ creatorId }: any){

const [following,setFollowing] = useState(false)

useEffect(()=>{
checkFollow()
},[])

const checkFollow = async ()=>{
const { data:userData } = await supabase.auth.getUser()

if(!userData.user) return

const { data } = await supabase
.from("followers")
.select("*")
.eq("follower_id",userData.user.id)
.eq("following_id",creatorId)
.single()

if(data) setFollowing(true)
}

const handleFollow = async ()=>{

const { data:userData } = await supabase.auth.getUser()

if(!userData.user) return

if(following){

await supabase
.from("followers")
.delete()
.eq("follower_id",userData.user.id)
.eq("following_id",creatorId)

setFollowing(false)

}else{

await supabase
.from("notifications")
.insert({
user_id: creatorId,
type: "follow",
message: "Someone followed you"
})


setFollowing(true)

}

}

return(

<button
onClick={handleFollow}
className="mt-4 bg-black text-white px-5 py-2 rounded"
>
{following ? "Following" : "Follow"}
</button>

)

}