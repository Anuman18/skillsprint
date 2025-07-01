// components/GoalInputForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function GoalInputForm() {
  const [goal, setGoal] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!goal) return setMessage('Goal cannot be empty.')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setMessage('Please log in first.')

    const { error } = await supabase
      .from('learning_goals')
      .insert([{ user_id: user.id, goal_text: goal }])

    if (error) setMessage(error.message)
    else {
      setMessage('Goal saved!')
      router.push('/dashboard')
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-3 items-center">
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="e.g. Become a Flutter Developer"
        className="w-full max-w-md p-3 rounded border"
      />
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Let’s Go 🚀
      </button>
      {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
    </div>
  )
}
