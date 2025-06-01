"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface Like {
  id: string
  product_id: string
  user_id: string
}

export function useLikes() {
  const [likes, setLikes] = useState<Like[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchLikes()
    } else {
      setLikes([])
      setLoading(false)
    }
  }, [user])

  const fetchLikes = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("user_likes").select("*").eq("user_id", user.id)

      if (error) throw error

      setLikes(data || [])
    } catch (error) {
      console.error("Error fetching likes:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (productId: string) => {
    if (!user) throw new Error("User not authenticated")

    const existingLike = likes.find((like) => like.product_id === productId)

    if (existingLike) {
      // Remove like
      const { error } = await supabase.from("user_likes").delete().eq("id", existingLike.id)

      if (error) throw error

      setLikes(likes.filter((like) => like.id !== existingLike.id))
    } else {
      // Add like
      const { data, error } = await supabase
        .from("user_likes")
        .insert({
          user_id: user.id,
          product_id: productId,
        })
        .select()
        .single()

      if (error) throw error

      setLikes([...likes, data])
    }
  }

  return {
    likes,
    loading,
    toggleLike,
    refetch: fetchLikes,
  }
}
