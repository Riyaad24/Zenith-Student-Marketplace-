"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const university = formData.get("university") as string
  const studentNumber = formData.get("studentNumber") as string

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      return { error: error.message }
    }

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        university,
        student_number: studentNumber,
      })

      if (profileError) {
        return { error: profileError.message }
      }
    }

    return { success: true, message: "Account created successfully!" }
  } catch (error) {
    return { error: "Failed to create account" }
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const { error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    redirect("/dashboard")
  } catch (error) {
    return { error: "Failed to sign in" }
  }
}

export async function signOut() {
  try {
    await supabaseAdmin.auth.signOut()
    redirect("/")
  } catch (error) {
    return { error: "Failed to sign out" }
  }
}
