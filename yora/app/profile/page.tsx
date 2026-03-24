"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabase"

export default function ProfilePage() {

  const [user,setUser] = useState<any>(null)

  useEffect(()=>{

    const getUser = async () => {

      const { data } = await supabase.auth.getUser()

      setUser(data.user)
    }

    getUser()

  },[])

  return(

    <div className="p-10 max-w-xl">

      <h1 className="text-4xl font-bold mb-6">
        Creator Profile
      </h1>

      {user && (

        <div className="border rounded-lg p-6 shadow">

          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>

          <p className="mb-2">
            <strong>Creative Field:</strong> Not set
          </p>

          <p className="mb-2">
            <strong>Bio:</strong> Add your bio
          </p>

        </div>

      )}

    </div>

  )
}