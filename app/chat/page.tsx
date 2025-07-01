'use client'

import { useState } from 'react'
import { genAI } from '@/lib/gemini'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [reply, setReply] = useState('')

  const handleAsk = async () => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: input }] }],
    })
    const text = await result.response.text()
    setReply(text)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">💬 Ask AI Anything</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask your mentor..."
        className="w-full p-3 border rounded mb-4"
      />
      <button onClick={handleAsk} className="bg-black text-white px-4 py-2 rounded">
        Ask 🔍
      </button>
      {reply && (
        <div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">{reply}</div>
      )}
    </div>
  )
}
