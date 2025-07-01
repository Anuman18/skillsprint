export async function generateCustomTasksFromGoal(goal: string, days: number): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `I want to achieve the goal "${goal}" in ${days} days.
Break it down into exactly ${days} daily tasks like:
- Day 1: ...
- Day 2: ...
Return only that list.`

  const result = await model.generateContent(prompt)
  const text = await result.response.text()
  const lines = text.split('\n').filter((line: string) => line.includes('Day'))

  return lines.map((line: string) => line.replace(/^\- /, '').trim())
}
