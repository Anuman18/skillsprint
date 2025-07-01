'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Task = {
  id: string
  day: number
  content: string
  status: 'todo' | 'done'
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { data, error } = await supabase
        .from('learning_goals')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!data) return

      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('goal_id', data.id)
        .order('day', { ascending: true })

      setTasks(taskData || [])
      setLoading(false)
    }

    fetchTasks()
  }, [])

  const toggleStatus = async (id: string, status: 'todo' | 'done') => {
    const newStatus = status === 'todo' ? 'done' : 'todo'
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    )
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">📅 Daily Task Board</h1>

      {loading && <p className="text-center">Loading...</p>}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={cn(
              'transition-all duration-300 shadow-sm',
              task.status === 'done' && 'opacity-70 bg-green-50'
            )}
          >
            <CardContent className="py-4 px-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Day {task.day}</p>
                <p className="font-medium">{task.content}</p>
              </div>

              <Button
                variant={task.status === 'done' ? 'outline' : 'default'}
                onClick={() => toggleStatus(task.id, task.status)}
              >
                {task.status === 'done' ? 'Undo' : 'Mark Done ✅'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
