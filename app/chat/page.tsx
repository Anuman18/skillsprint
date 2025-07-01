'use client'

import { useState } from 'react'
import { genAI } from '@/lib/gemini'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Message = {
  role: 'user' | 'ai'
  content: string
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: input }] }],
    })

    const reply = await result.response.text()
    setMessages((prev) => [...prev, { role: 'ai', content: reply }])
    setInput('')
    setLoading(false)
  }

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-[calc(100vh-100px)]">
      <h1 className="text-2xl font-bold text-center my-4">💬 SkillMentor Chat</h1>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-md shadow-inner border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              'max-w-sm p-3 rounded-lg whitespace-pre-wrap',
              msg.role === 'user'
                ? 'bg-blue-100 ml-auto text-right'
                : 'bg-gray-200 text-left'
            )}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="bg-gray-200 p-3 rounded-lg max-w-sm text-left animate-pulse">
            🤖 Typing...
          </div>
        )}
      </div>

      <div className="flex mt-4 gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your mentor anything..."
        />
        <Button onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  )
}
