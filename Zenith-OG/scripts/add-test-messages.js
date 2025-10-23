const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bjqwjqnqqttpbqafixdy.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcXdqcW5xcXR0cGJxYWZpeGR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYwODc3MCwiZXhwIjoyMDY2MTg0NzcwfQ.CYGMbdzFRZu72k9wc3mMN95d-OgUjI9ivQifxThoLBs"

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function addTestMessages() {
  console.log("Adding test messages...")

  try {
    // Get first two users from the database
    const { data: users, error: usersError } = await supabaseAdmin
      .from("profiles")
      .select("id, first_name, last_name")
      .limit(2)

    if (usersError || !users || users.length < 2) {
      console.error("Need at least 2 users to create test messages:", usersError)
      return
    }

    const user1 = users[0]
    const user2 = users[1]

    console.log(`Creating conversation between ${user1.first_name} and ${user2.first_name}`)

    // Create test messages
    const testMessages = [
      {
        sender_id: user1.id,
        receiver_id: user2.id,
        content: "Hi! I'm interested in your calculus textbook. Is it still available?",
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        sender_id: user2.id,
        receiver_id: user1.id,
        content: "Yes, it's still available! It's in great condition. Are you a student at UCT?",
        read: false,
        created_at: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
      },
      {
        sender_id: user1.id,
        receiver_id: user2.id,
        content: "Perfect! Yes, I'm a first-year engineering student. How much are you asking for it?",
        read: false,
        created_at: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
      },
      {
        sender_id: user2.id,
        receiver_id: user1.id,
        content: "I'm asking R450. It's the latest edition and barely used. We could meet on campus if you'd like to see it first.",
        read: false,
        created_at: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
      },
      {
        sender_id: user1.id,
        receiver_id: user2.id,
        content: "That sounds fair! Can we meet tomorrow around 2 PM at the library?",
        read: false,
        created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      },
    ]

    // Insert test messages
    const { data: insertedMessages, error: messagesError } = await supabaseAdmin
      .from("messages")
      .insert(testMessages)
      .select()

    if (messagesError) {
      console.error("Error inserting test messages:", messagesError)
      return
    }

    console.log(`✅ Successfully created ${insertedMessages.length} test messages`)
    console.log("Test conversation created between users:")
    console.log(`- ${user1.first_name} ${user1.last_name} (${user1.id})`)
    console.log(`- ${user2.first_name} ${user2.last_name} (${user2.id})`)

  } catch (error) {
    console.error("Error adding test messages:", error)
  }
}

addTestMessages()