// components/AuthForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the login link!')
  }

  return (
    <div className="max-w-sm mx-auto mt-16 text-center">
      <h1 className="text-2xl font-semibold mb-4">Login to SkillSprint</h1>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border rounded mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send Magic Link
      </button>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  )
}
