import GoalInputForm from '@/components/GoalInputForm'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-center mb-2">👨🏻‍🏫 SkillSprint</h1>
      <p className="text-center text-lg text-gray-600 mb-6">
        Your AI-powered personal learning coach
      </p>
      <GoalInputForm />
    </main>
  )
}
