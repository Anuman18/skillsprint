import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = params

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (!profile) return <div className="p-10 text-center">User not found 😕</div>

  const { data: goalData } = await supabase
    .from('learning_goals')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('goal_id', goalData?.id)
    .order('day')

  const xp = tasks?.filter(t => t.status === 'done').length ?? 0
  const total = tasks?.length ?? 0
  const streak = 1 // (optional: reuse streak logic from /rewards)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-2">@{username}</h1>
      <p className="text-center text-gray-600 mb-4">🎯 Goal: {goalData?.goal_text}</p>

      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div><strong>{xp}</strong><br />XP</div>
        <div><strong>{total}</strong><br />Tasks</div>
        <div><strong>{streak}</strong><br />Streak</div>
      </div>

      <ul className="space-y-2">
        {tasks?.map(task => (
          <li key={task.id} className={`p-3 rounded border ${task.status === 'done' ? 'bg-green-100' : 'bg-white'}`}>
            <strong>Day {task.day}:</strong> {task.content}
          </li>
        ))}
      </ul>
    </div>
  )
}
