/*
  SkillSprint - Full code up to Step 3: Login + Landing + Gemini Goal Planner
  Structure:
  - /app: Next.js App Router
  - /components: UI elements
  - /lib: Clients for Supabase & Gemini
*/

// File: lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// File: lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!

export const genAI = new GoogleGenerativeAI(apiKey)

export async function generateTasksFromGoal(goal: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `Break down the learning goal "${goal}" into a 7-day plan with specific daily tasks. 
Respond in this format:
- Day 1: ...
- Day 2: ...
(no introduction or summary)`

  const result = await model.generateContent(prompt)
  const text = await result.response.text()
  const lines = text.split('\n').filter((line) => line.includes('Day'))

  return lines.map((line) => line.replace(/^\- /, '').trim())
}


// File: components/GoalInputForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { generateTasksFromGoal } from '@/lib/gemini'

export default function GoalInputForm() {
  const [goal, setGoal] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!goal) return setMessage('Goal cannot be empty.')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setMessage('Please log in first.')

    const { data: insertedGoal, error } = await supabase
      .from('learning_goals')
      .insert([{ user_id: user.id, goal_text: goal }])
      .select()
      .single()

    if (error || !insertedGoal) {
      setMessage(error?.message || 'Failed to save goal')
      return
    }

    const tasks = await generateTasksFromGoal(goal)

    const taskData = tasks.map((task, index) => ({
      goal_id: insertedGoal.id,
      day: index + 1,
      content: task,
      status: 'todo',
    }))

    const { error: taskError } = await supabase.from('tasks').insert(taskData)
    if (taskError) return setMessage('Failed to save tasks: ' + taskError.message)

    setMessage('Goal and tasks created successfully!')
    router.push('/dashboard')
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
