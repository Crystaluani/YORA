import { supabase } from "@/libs/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request){

const formData = await req.formData()

const following_id = formData.get("following_id")

const { data:userData } = await supabase.auth.getUser()

const follower_id = userData.user?.id

const { error } = await supabase
.from("follows")
.insert({ 
follower_id,
following_id
})

await supabase
.from("notifications")
.insert({
user_id: following_id,
message: "Someone started following you",
read: false
})

if(error){
return NextResponse.json({error:error.message})
}

return NextResponse.json({success:true})

}