// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) router.replace('/dashboard')
      else router.replace('/auth/login')
    }
    getSession()
  }, [])

  return <p className="text-center mt-10">Redirecting...</p>
}
