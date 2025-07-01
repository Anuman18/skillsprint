'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateCustomTasksFromGoal } from '@/lib/gemini'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Home() {
  const [goal, setGoal] = useState('')
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePlan = async () => {
    if (!goal) return alert('Please enter a goal.')
    setLoading(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()
    const user = session?.user

    if (!user) {
      alert('Please login first.')
      setLoading(false)
      return router.push('/auth/login')
    }

    const tasks = await generateCustomTasksFromGoal(goal, days)

    const { data: goalRow } = await supabase
      .from('learning_goals')
      .insert({ user_id: user.id, goal_text: goal })
      .select()
      .single()

    const newTasks = tasks.map((content, i) => ({
      goal_id: goalRow.id,
      day: i + 1,
      content,
      status: 'todo',
    }))

    await supabase.from('tasks').insert(newTasks)
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="max-w-xl mx-auto mt-16">
      <h1 className="text-3xl font-bold text-center mb-4">
        Plan your Learning Goal 🎯
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Tell us what you want to learn and for how many days — AI will break it into a daily plan.
      </p>

      <div className="space-y-4">
        <div>
          <Label>Your Goal</Label>
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder='e.g. Learn full-stack web dev'
          />
        </div>

        <div>
          <Label>Number of Days</Label>
          <Input
            type="number"
            value={days}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDays(parseInt(e.target.value))}
            min={1}
            max={100}
          />
        </div>

        <Button onClick={handlePlan} disabled={loading} className="w-full mt-4">
          {loading ? 'Planning with AI...' : '🚀 Plan with AI'}
        </Button>
      </div>
    </div>
  )
}
