// File: app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Task {
  id: string
  day: number
  content: string
  status: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: goals } = await supabase
        .from('learning_goals')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!goals || goals.length === 0) return

      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('goal_id', goals[0].id)
        .order('day')

      setTasks(tasksData || [])
      setLoading(false)
    }

    fetchTasks()
  }, [])

  const toggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'todo' ? 'done' : 'todo'
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    )
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">📘 Your Learning Tasks</h1>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-4 rounded border cursor-pointer flex items-start justify-between ${
              task.status === 'done' ? 'bg-green-100 line-through' : 'bg-white'
            }`}
            onClick={() => toggleTask(task.id, task.status)}
          >
            <div>
              <strong>Day {task.day}:</strong> {task.content}
            </div>
            <span className="text-xs text-gray-500">[{task.status}]</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
