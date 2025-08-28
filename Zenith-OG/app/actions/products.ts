"use server"

import { createServerClient, supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  const supabase = createServerClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const condition = formData.get("condition") as string
  const images = formData.getAll("images") as string[]

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Please sign in to create a product" }
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        title,
        description,
        price,
        category,
        condition,
        images,
        seller_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/browse")
    return { success: true, product: data }
  } catch (error) {
    return { error: "Failed to create product" }
  }
}

export async function getProducts(category?: string, search?: string) {
  try {
    const supabase = createServerClient()

    let query = supabaseAdmin
      .from("products")
      .select(`
        *,
        profiles:seller_id (
          first_name,
          last_name,
          university
        )
      `)
      .eq("status", "active")

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function addToCart(productId: string) {
  const supabase = createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Please sign in to add items to cart" }
    }

    const { data, error } = await supabaseAdmin
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/cart")
    return { success: true, message: "Added to cart!" }
  } catch (error) {
    return { error: "Failed to add to cart" }
  }
}

export async function toggleFavorite(productId: string) {
  const supabase = createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Please sign in to save favorites" }
    }

    // Check if already favorited
    const { data: existing } = await supabaseAdmin
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (existing) {
      // Remove from favorites
      await supabaseAdmin.from("favorites").delete().eq("id", existing.id)

      return { success: true, message: "Removed from favorites" }
    } else {
      // Add to favorites
      await supabaseAdmin.from("favorites").insert({
        user_id: user.id,
        product_id: productId,
      })

      return { success: true, message: "Added to favorites!" }
    }
  } catch (error) {
    return { error: "Failed to update favorites" }
  }
}
