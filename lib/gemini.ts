// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

export async function generateCustomTasksFromGoal(goal: string, days: number): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) // ✅ valid v1 model

  const prompt = `I want to achieve the goal "${goal}" in ${days} days.
Break it down into exactly ${days} daily tasks like:
- Day 1: ...
- Day 2: ...
Return only that list.`

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  })

  const text = await result.response.text()
  const lines = text.split('\n').filter((line) => line.toLowerCase().includes('day'))

  return lines.map(line => line.replace(/^[-\s]*Day/, 'Day').trim())
}

export { genAI }
