// app/auth/login/page.tsx
import AuthForm from '@/components/AuthForm'
import React from 'react'

export default function LoginPage() {
  return <AuthForm />
}

// Example: define user before using it
const user = { id: 'some-user-id' }; // Replace with actual user fetching logic

// Import and initialize supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

await supabase
  .from('profiles')
  .upsert({ id: user.id, username: 'anumanmodi' }) // or get input from user
