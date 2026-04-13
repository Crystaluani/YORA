"use client"

import { useState } from "react"
import { supabase } from "@/libs/supabase"

export default function Login() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const login = async () => {

    const { data,error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error){
      alert(error.message)
    } else {
      alert("Logged in!")
    }
  }

  return (

    <div className="p-10 max-w-md">

      <h1 className="text-3xl font-bold mb-6">Login</h1>

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
        onClick={login}
        className="bg-black text-white p-3 w-full"
      >
        Login
      </button>

    </div>
  )
}