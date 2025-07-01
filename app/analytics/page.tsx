'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabaseClient'

export default function AnalyticsPage() {
  const [taskStats, setTaskStats] = useState({ done: 0, todo: 0 })
  const [dailyData, setDailyData] = useState([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: tasks } = await supabase
        .from('tasks')
        .select('status, created_at')

      if (!tasks) return

      const done = tasks.filter(t => t.status === 'done')
      const todo = tasks.length - done.length

      const last7Days: any[] = []
      const today = new Date()

      for (let i = 6; i >= 0; i--) {
        const day = new Date(today.getTime() - i * 86400000)
        const label = day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        const count = done.filter(t =>
          new Date(t.created_at).toDateString() === day.toDateString()
        ).length
        last7Days.push({ date: label, completed: count })
      }

      setTaskStats({ done: done.length, todo })
      setDailyData(last7Days)
    }

    fetchAnalytics()
  }, [])

  const COLORS = ['#34D399', '#F87171']

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Your Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-center mb-4">Task Completion</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Done', value: taskStats.done },
                  { name: 'Todo', value: taskStats.todo },
                ]}
                dataKey="value"
                outerRadius={80}
                label
              >
                {COLORS.map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-center mb-4">Tasks Done (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="completed" fill="#60A5FA" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
