"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, Heart, RefreshCw, AlertCircle } from "lucide-react"

export default function CartPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const { items, loading, error, updateQuantity, removeFromCart, total, refetch } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setUpdating(itemId)
    try {
      await updateQuantity(itemId, newQuantity)
      toast({
        title: "Yangilandi",
        description: "Mahsulot miqdori yangilandi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Miqdorni yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
      toast({
        title: "O'chirildi",
        description: "Mahsulot savatdan o'chirildi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Mahsulotni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: t("authRequired"),
        description: t("loginToAddCart"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      // Avval savatcha ma'lumotlarini yangilaymiz
      await refetch()
      
      // Savatcha bo'sh emasligini tekshiramiz
    if (!items || items.length === 0) {
      toast({
        title: t("cartEmpty"),
        description: t("cartEmptyDesc"),
        variant: "destructive",
      })
      return
    }

      // Checkout sahifasiga o'tamiz
      router.push("/checkout")
    } catch (e) {
      console.error("Checkout error:", e)
      toast({
        title: t("error"),
        description: "Checkout sahifasiga o'tishda xatolik yuz berdi.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    try {
      await refetch()
      toast({
        title: "Yangilandi",
        description: "Savatcha ma'lumotlari yangilandi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const shippingCost = total > 100000 ? 0 : 25000
  const tax = total * 0.12
  const finalTotal = total + shippingCost + tax

  if (!isClient || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!loading && items.length === 0) {
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
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Savatcha
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t("cartEmptyDesc")}
              </p>
            </div>
            {/* Refresh button might not be needed if cart is truly empty */}
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Savatchangiz bo'sh</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Hali savatchangizga mahsulot qo'shmagansiz</p>
              <div className="space-y-3">
                <Link href="/products">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Xaridni boshlash
                  </Button>
                </Link>
                <Link href="/likes">
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Yoqtirilganlarni ko'rish
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Savatcha
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {loading ? "Yuklanmoqda..." : `${items.length} ta mahsulot savatchangizda`}
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Yangilash
          </Button>
        </div>

        {/* Debug Information (remove in production) */}
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">Debug Ma'lumotlari:</h3>
          <p>Foydalanuvchi ID: {user?.id}</p>
          <p>Mahsulotlar soni: {items.length}</p>
          <p>Yuklanmoqda: {loading ? "Ha" : "Yo'q"}</p>
          <p>Xatolik: {error || "Yo'q"}</p>
          <p>Jami summa: {total.toLocaleString()} so'm</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Xatolik: {error}
              <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
                Qayta urinish
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Savatcha yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Cart Content */}
        {!loading && (
          <>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="relative w-full sm:w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <Image
                              src={item.product?.image_url || "/placeholder.svg?height=128&width=128"}
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{item.product?.name || "Noma'lum mahsulot"}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                  {item.product?.brand || "Noma'lum brend"}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-purple-600">
                                  {(item.product?.new_price || 0).toLocaleString()} so'm
                                </span>
                                {item.product?.old_price && item.product.old_price > item.product.new_price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {item.product.old_price.toLocaleString()} so'm
                                  </span>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={updating === item.id || item.quantity <= 1}
                                  className="h-8 w-8"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const newQuantity = Number.parseInt(e.target.value)
                                    if (newQuantity > 0) {
                                      handleQuantityChange(item.id, newQuantity)
                                    }
                                  }}
                                  className="w-16 text-center"
                                  min="1"
                                  max={item.product?.quantity || 999}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={updating === item.id || item.quantity >= (item.product?.quantity || 999)}
                                  className="h-8 w-8"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                              <span>Omborda: {item.product?.quantity || 0} ta</span>
                              <span className="font-semibold">
                                Jami: {((item.product?.new_price || 0) * item.quantity).toLocaleString()} so'm
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Buyurtma xulosasi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Jami ({items.length} ta mahsulot)</span>
                          <span>{total.toLocaleString()} so'm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Yetkazib berish</span>
                          <span>{shippingCost === 0 ? "Bepul" : `${shippingCost.toLocaleString()} so'm`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Soliq</span>
                          <span>{tax.toLocaleString()} so'm</span>
                        </div>
                        {total > 100000 && (
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Bepul yetkazib berish!
                            </Badge>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Umumiy summa</span>
                        <span>{finalTotal.toLocaleString()} so'm</span>
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={handleCheckout}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3"
                          disabled={items.length === 0 || loading}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          To'lovga o'tish
                        </Button>

                        <Link href="/products" className="block">
                          <Button variant="outline" className="w-full">
                            Xaridni davom ettirish
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Savatchangiz bo'sh</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Hali savatchangizga mahsulot qo'shmagansiz</p>
                  <div className="space-y-3">
                    <Link href="/products">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Xaridni boshlash
                      </Button>
                    </Link>
                    <Link href="/likes">
                      <Button variant="outline" className="w-full">
                        <Heart className="w-4 h-4 mr-2" />
                        Yoqtirilganlarni ko'rish
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
