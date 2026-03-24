"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function Signup() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const signUp = async () => {
    const { data,error } = await supabase.auth.signUp({
      email,
      password
    })

    if(error) alert(error.message)
    else alert("Account created!")
  }

  return (

    <div className="p-10 max-w-md">

      <h1 className="text-3xl font-bold mb-6">Create Account</h1>

      <input
        className="border p-3 w-full mb-4"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-3 w-full mb-4"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        onClick={signUp}
        className="bg-black text-white p-3 w-full"
      >
        Sign Up
      </button>

    </div>
  )
}