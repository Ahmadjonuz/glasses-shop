"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product: {
    id: string
    name: string
    new_price: number
    old_price: number
    image_url: string
    brand: string
    quantity: number
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_id,
          quantity,
          created_at,
          updated_at,
          products!inner (
            id,
            name,
            new_price,
            old_price,
            image_url,
            brand,
            quantity
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const transformedItems = data?.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          created_at: item.created_at,
          updated_at: item.updated_at,
          product: item.products,
      })) || []

        setItems(transformedItems)
    } catch (error: any) {
      console.error("Error fetching cart items:", error)
      setError(error.message || "Failed to fetch cart items")
      toast({
        title: "Xatolik",
        description: "Savatcha ma'lumotlarini yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    fetchCartItems()
  }, [fetchCartItems])

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    try {
      console.log("Adding to cart:", { productId, quantity, userId: user.id })

      // Check if item already exists in cart
      const existingItem = items.find((item) => item.product_id === productId)

      if (existingItem) {
        console.log("Updating existing item:", existingItem.id)
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id)

        if (error) {
          console.error("Error updating cart item:", error)
          throw error
        }
      } else {
        console.log("Adding new item to cart")
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })

        if (error) {
          console.error("Error adding new cart item:", error)
          throw error
        }
      }

      // Refresh cart items
      await fetchCartItems()
      console.log("Cart updated successfully")
    } catch (error) {
      console.error("Error in addToCart:", error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      console.log("Updating quantity:", { itemId, quantity })

      if (quantity <= 0) {
        await removeFromCart(itemId)
        return
      }

      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)

      if (error) {
        console.error("Error updating quantity:", error)
        throw error
      }

      await fetchCartItems()
    } catch (error) {
      console.error("Error in updateQuantity:", error)
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      console.log("Removing from cart:", itemId)

      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) {
        console.error("Error removing from cart:", error)
        throw error
      }

      await fetchCartItems()
    } catch (error) {
      console.error("Error in removeFromCart:", error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      console.log("Clearing cart for user:", user.id)

      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) {
        console.error("Error clearing cart:", error)
        throw error
      }

      setItems([])
      console.log("Cart cleared successfully")
    } catch (error) {
      console.error("Error in clearCart:", error)
      throw error
    }
  }

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.product?.new_price || 0) * item.quantity, 0)
  }, [items])

  // Debug information
  console.log("Cart hook state:", {
    itemsCount: items.length,
    loading,
    error,
    total,
    user: user?.id,
  })

  return {
    items,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    refetch: fetchCartItems,
  }
}
