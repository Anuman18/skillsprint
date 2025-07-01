'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { generateCustomTasksFromGoal } from '@/lib/gemini'

export default function GoalInputForm() {
  const [goal, setGoal] = useState('')
  const [days, setDays] = useState(7)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!goal || days < 1 || days > 30) {
      return setMessage('Please enter a goal and valid day count (1–30).')
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setMessage('Please log in first.')

    const { data: insertedGoal, error } = await supabase
      .from('learning_goals')
      .insert([{ user_id: user.id, goal_text: goal }])
      .select()
      .single()

    if (error || !insertedGoal) {
      return setMessage(error?.message || 'Error saving goal.')
    }

    const tasks = await generateCustomTasksFromGoal(goal, days)

    const taskData = tasks.map((task, index) => ({
      goal_id: insertedGoal.id,
      day: index + 1,
      content: task,
      status: 'todo',
    }))

    const { error: taskError } = await supabase.from('tasks').insert(taskData)
    if (taskError) return setMessage('Failed to save tasks: ' + taskError.message)

    setMessage('Goal created with custom plan!')
    router.push('/dashboard')
  }

  return (
    <div className="mt-6 flex flex-col gap-3 items-center">
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="e.g. Become a Full Stack Developer"
        className="w-full max-w-md p-3 rounded border"
      />
      <input
        type="number"
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        placeholder="Number of days"
        min={1}
        max={30}
        className="w-full max-w-md p-3 rounded border"
      />
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Generate Plan 📅
      </button>
      {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
    </div>
  )
}
