// File: app/chat/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import genAI from '@/lib/gemini'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchContext = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return ''

    const { data: goals } = await supabase
      .from('learning_goals')
      .select('id, goal_text')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (!goals || goals.length === 0) return ''

    const { data: tasks } = await supabase
      .from('tasks')
      .select('day, content, status')
      .eq('goal_id', goals[0].id)
      .order('day')

    const done = tasks?.filter(t => t.status === 'done').map(t => `✅ Day ${t.day}: ${t.content}`)
    const todo = tasks?.filter(t => t.status !== 'done').map(t => `🕒 Day ${t.day}: ${t.content}`)

    return `Goal: ${goals[0].goal_text}\nCompleted:\n${done?.join('\n')}\nPending:\n${todo?.join('\n')}`
  }

  const handleAsk = async () => {
    if (!message) return
    setLoading(true)
    const context = await fetchContext()

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const chat = model.startChat({ history: [] })

    const fullPrompt = `${context}\n\nUser question: ${message}`
    const result = await chat.sendMessage(fullPrompt)
    const text = result.response.text()

    setResponse(await text)
    setHistory(prev => [...prev, `You: ${message}`, `AI: ${await text}`])
    setMessage('')
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🧠 Ask Your Mentor</h1>
      <div className="mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded min-h-[80px]"
          placeholder="Ask something like: How should I revise Day 3’s task?"
        ></textarea>
        <button
          onClick={handleAsk}
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
      <div className="space-y-2 text-sm text-gray-800">
        {history.map((line, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded">{line}</div>
        ))}
      </div>
    </div>
  )
}