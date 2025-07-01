'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RewardsPage() {
  const [tasksDone, setTasksDone] = useState(0)
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [badge, setBadge] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: tasks } = await supabase
        .from('tasks')
        .select('status, created_at')
        .eq('status', 'done')

      if (!tasks || tasks.length === 0) return

      const completedToday = new Set()
      const now = new Date()
      const oneDay = 86400000
      let localStreak = 0

      tasks.forEach((t) => {
        const date = new Date(t.created_at).toDateString()
        completedToday.add(date)
      })

      for (let i = 0; i < 7; i++) {
        const check = new Date(now.getTime() - i * oneDay).toDateString()
        if (completedToday.has(check)) localStreak++
        else break
      }

      setStreak(localStreak)
      setTasksDone(tasks.length)
      setXp(tasks.length * 1)

      if (tasks.length >= 10) setBadge('🏅 Achiever')
      else if (tasks.length >= 5) setBadge('🎖️ Starter')
      else setBadge('✨ Beginner')
    }

    fetchStats()
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 rounded-lg bg-gray-50 shadow">
      <h1 className="text-3xl font-bold text-center mb-6">🎁 Your Progress</h1>
      <div className="space-y-4 text-lg text-center">
        <p>✅ Tasks Completed: <strong>{tasksDone}</strong></p>
        <p>🔥 Current Streak: <strong>{streak} day{streak !== 1 ? 's' : ''}</strong></p>
        <p>⚡ XP Points: <strong>{xp}</strong></p>
        <p>🎖️ Badge: <strong>{badge}</strong></p>
      </div>
    </div>
  )
}
