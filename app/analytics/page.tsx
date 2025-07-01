'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'

const COLORS = ['#4ade80', '#facc15']

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { data: goalData } = await supabase
        .from('learning_goals')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!goalData) return

      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('goal_id', goalData.id)

      setTasks(taskData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const completed = tasks.filter((t) => t.status === 'done').length
  const remaining = tasks.length - completed
  const streak = tasks
    .filter((t) => t.status === 'done')
    .map((t) => t.day)
    .sort((a, b) => a - b)

  const chartData = [
    { name: 'Done', value: completed },
    { name: 'To Do', value: remaining },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-2">📊 Learning Analytics</h1>
      {loading && <p className="text-center">Loading...</p>}

      {!loading && (
        <>
          {/* Pie Chart Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2">Task Completion</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2">Day-wise Progress</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tasks}>
                  <XAxis dataKey="day" />
                  <Tooltip />
                  <Bar dataKey="status" fill="#60a5fa">
                    {tasks.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={entry.status === 'done' ? '#4ade80' : '#facc15'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
