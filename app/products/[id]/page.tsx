"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/hooks/use-cart"
import { useLikes } from "@/hooks/use-likes"
import { useToast } from "@/hooks/use-toast"
import { Heart, ShoppingCart, ArrowLeft, Star, Truck, Shield, RotateCcw } from "lucide-react"
import Link from "next/link"
import { RelatedProducts } from "@/components/related-products"

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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { tString } = useLanguage()
  const { addToCart } = useCart()
  const { likes, toggleLike } = useLikes()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const productId = params.id as string
  const isLiked = likes.some((like) => like.product_id === productId)
  const isOutOfStock = product?.quantity === 0

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

      if (error) throw error

      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: tString("errorMessage"),
        description: tString("productNotFoundMessage"),
        variant: "destructive",
      })
      router.push("/products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: tString("authRequiredMessage"),
        description: tString("loginToAddCart"),
        variant: "destructive",
      })
      return
    }

    if (isOutOfStock) {
      toast({
        title: tString("outOfStockMessage"),
        description: tString("productOutOfStock"),
        variant: "destructive",
      })
      return
    }

    setAddingToCart(true)
    try {
      await addToCart(productId, quantity)
      toast({
        title: tString("addedToCart"),
        description: `${product?.name} ${tString("addedToCartDesc")}`,
      })
    } catch (error) {
      toast({
        title: tString("errorMessage"),
        description: tString("failedToAddCart"),
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const handleToggleLike = async () => {
    if (!user) {
      toast({
        title: tString("authRequiredMessage"),
        description: tString("loginToLike"),
        variant: "destructive",
      })
      return
    }

    try {
      await toggleLike(productId)
    } catch (error) {
      toast({
        title: tString("errorMessage"),
        description: tString("failedToUpdateLike"),
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{tString("productNotFoundMessage")}</h2>
          <Link href="/products">
            <Button>{tString("backToProductsList")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const discountPercentage = Math.round(((product.old_price - product.new_price) / product.old_price) * 100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-purple-600">
            {tString("home")}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-purple-600">
            {tString("productsLink")}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {tString("backToProductsList")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={product.image_url || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">{tString("featured")}</Badge>
              )}
              {isOutOfStock && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  {tString("outOfStockMessage")}
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute bottom-4 left-4 bg-red-500 text-white">-{discountPercentage}%</Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.gender}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{product.brand}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-purple-600">
                {product.new_price.toLocaleString()} {tString("currencySymbol")}
              </span>
              {product.old_price > product.new_price && (
                <span className="text-xl text-gray-500 line-through">
                  {product.old_price.toLocaleString()} {tString("currencySymbol")}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.quantity > 10 ? "bg-green-500" : product.quantity > 0 ? "bg-yellow-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">
                {product.quantity > 10
                  ? tString("inStockStatus")
                  : product.quantity > 0
                    ? `${tString("lowStockStatus")} (${product.quantity} ${tString("itemsLeft")})`
                    : tString("outOfStockMessage")}
              </span>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <label className="font-medium">{tString("quantityLabel")}:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {addingToCart ? tString("addingStatus") : isOutOfStock ? tString("outOfStockMessage") : tString("addToCartButton")}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleLike}
                className={`${isLiked ? "text-red-500 border-red-500" : ""}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-purple-600" />
                <span>{tString("freeShipping")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>{tString("warranty")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                <span>{tString("returns")}</span>
              </div>
            </div>

            <Separator />

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">{tString("descriptionTab")}</TabsTrigger>
                <TabsTrigger value="specifications">{tString("specificationsTab")}</TabsTrigger>
                <TabsTrigger value="reviews">{tString("reviewsTab")}</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{tString("brand")}:</span>
                        <span>{product.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{tString("category")}:</span>
                        <span>{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{tString("gender")}:</span>
                        <span>{product.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{tString("availabilityLabel")}:</span>
                        <span>
                          {product.quantity} {tString("inStockStatus")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{tString("noReviewsYet")}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{tString("beFirstReviewMessage")}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts currentProductId={product.id} category={product.category} brand={product.brand} />
        </div>
      </div>
    </div>
  )
}
