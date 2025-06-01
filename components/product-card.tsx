"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/hooks/use-cart"
import { useLikes } from "@/hooks/use-likes"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const { likes, toggleLike } = useLikes()
  const { toast } = useToast()

  const isLiked = likes.some((like) => like.product_id === product.id)
  const isOutOfStock = product.quantity === 0

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Tizimga kirish kerak",
        description: "Savatga qo'shish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    if (isOutOfStock) {
      toast({
        title: "Mahsulot tugagan",
        description: "Bu mahsulot hozirda mavjud emas",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("Adding product to cart:", product.id)
      await addToCart(product.id, 1)

      toast({
        title: "Savatga qo'shildi!",
        description: `${product.name} savatchangizga qo'shildi`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Xatolik",
        description: "Mahsulotni savatga qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleLike = async () => {
    if (!user) {
      toast({
        title: "Tizimga kirish kerak",
        description: "Yoqtirish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    try {
      await toggleLike(product.id)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Yoqtirishni yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div className="relative overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleToggleLike}
            className={`rounded-full ${isLiked ? "text-red-500" : "text-gray-600"}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>

          <Link href={`/products/${product.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">{product.category}</Badge>
          {product.featured && (
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              Tavsiya etilgan
            </Badge>
          )}
          {isOutOfStock && <Badge variant="destructive">Tugagan</Badge>}
        </div>

        {/* Gender badge */}
        <Badge className="absolute top-2 right-2 bg-blue-500">{product.gender}</Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{product.brand}</span>
            <div className="flex items-center gap-2">
              {product.old_price > product.new_price && (
                <span className="text-sm text-gray-500 line-through">{product.old_price.toLocaleString()} so'm</span>
              )}
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {product.new_price.toLocaleString()} so'm
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mavjud: {product.quantity} ta</div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || isOutOfStock}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isLoading ? "Qo'shilmoqda..." : isOutOfStock ? "Tugagan" : "Savatga qo'shish"}
        </Button>
      </CardFooter>
    </Card>
  )
}
