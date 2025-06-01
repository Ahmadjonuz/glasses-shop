"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useLikes } from "@/hooks/use-likes"
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  brand: string
  category: string
  gender: string
  description: string
  image_url: string
  old_price: number
  new_price: number
  quantity: number
  featured: boolean
}

export default function LikesPage() {
  const [likedProducts, setLikedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { tString } = useLanguage()
  const { likes } = useLikes()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchLikedProducts()
  }, [user, likes, router])

  const fetchLikedProducts = async () => {
    if (!user || likes.length === 0) {
      setLoading(false)
      return
    }

    try {
      const productIds = likes.map((like) => like.product_id)
      const { data, error } = await supabase.from("products").select("*").in("id", productIds)

      if (error) throw error

      setLikedProducts(data || [])
    } catch (error) {
      console.error("Error fetching liked products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {tString("likedProducts")}
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {likes.length} {likes.length === 1 ? tString("product") : tString("products")} {tString("inWishlist")}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : likedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {likedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-12 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-full"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{tString("noLikedProducts")}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{tString("exploreFavorites")}</p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {tString("exploreProducts")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
