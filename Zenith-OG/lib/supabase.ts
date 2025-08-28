import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bjqwjqnqqttpbqafixdy.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcXdqcW5xcXR0cGJxYWZpeGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDg7NzAsImV4cCI6MjA2NjE4NDc3MH0.zw1b2rVGGds6BkY9G7vwwXznPJEWg8gVI8AAVMGdWm8"
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcXdqcW5xcXR0cGJxYWZpeGR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYwODc3MCwiZXhwIjoyMDY2MTg0NzcwfQ.CYGMbdzFRZu72k9wc3mMN95d-OgUjI9ivQifxThoLBs"

// Client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for server-side admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Create client for server components
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
