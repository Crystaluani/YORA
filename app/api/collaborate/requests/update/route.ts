import { supabase } from "@/libs/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request){

const formData = await req.formData()

const request_id = formData.get("request_id")
const status = formData.get("status")

const { error } = await supabase
.from("collaboration_requests")
.update({ status })
.eq("id", request_id)

if(error){
return NextResponse.json({error:error.message})
}

return NextResponse.json({success:true})

}