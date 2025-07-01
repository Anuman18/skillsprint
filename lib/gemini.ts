// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!

export const genAI = new GoogleGenerativeAI(apiKey)

export async function generateTasksFromGoal(goal: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `Break down the learning goal "${goal}" into a 7-day plan with specific daily tasks. 
Respond with a simple bullet-point list like:
- Day 1: ...
- Day 2: ...
(only list the 7 items, no intro or summary)`

  const result = await model.generateContent(prompt)
  const text = await result.response.text()
  const lines = text.split('\n').filter((line) => line.includes('Day'))

  return lines.map((line) => line.replace(/^\- /, '').trim())
}
