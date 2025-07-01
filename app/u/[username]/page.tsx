import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Props = {
  params: {
    username: string
  }
}

export default async function PublicProfile({ params }: Props) {
  const { username } = params

  const { data: user } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!user) return notFound()

  const { data: goalData } = await supabase
    .from('learning_goals')
    .select('id, goal_text, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!goalData) return notFound()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('goal_id', goalData.id)

  const completed = tasks?.filter((t) => t.status === 'done').length || 0

  return (
    <div className="max-w-2xl mx-auto mt-12">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">@{user.username}</h1>
          <p className="text-gray-600 text-sm">Joined {new Date(user.created_at).toDateString()}</p>
        </div>
      </div>

      {/* Goal Card */}
      <Card className="mb-6">
        <CardContent className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">🏁 Current Goal</h2>
          <p>{goalData.goal_text}</p>
          <Badge variant="outline">
            {completed} / {tasks?.length || 0} Tasks Done
          </Badge>
        </CardContent>
      </Card>

      {/* Share */}
      <div className="text-center">
        <button
          className="text-sm underline text-blue-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            alert('Copied profile link to clipboard!')
          }}
        >
          🔗 Copy public profile link
        </button>
      </div>
    </div>
  )
}
