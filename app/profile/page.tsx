"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/hooks/use-cart"
import { useLikes } from "@/hooks/use-likes"
import { supabase } from "@/lib/supabase"
import { Calendar, Heart, ShoppingBag, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { tString } = useLanguage()
  const { items } = useCart()
  const { likes } = useLikes()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchProfile()
    }
  }, [user, loading, router])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      setProfile(
        data || {
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          avatar_url: "",
          created_at: user.created_at,
        },
      )
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user) return

    setUpdating(true)
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setProfile({ ...profile, ...updates })
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {getInitials(profile?.full_name || user.email || "U")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{profile?.full_name || tString("user")}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {tString("joined")} {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Heart className="w-4 h-4" />
                    {likes.length} {tString("likedItems")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ShoppingBag className="w-4 h-4" />
                    {items.length} {tString("cartItems")}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{tString("overview")}</TabsTrigger>
            <TabsTrigger value="orders">{tString("orders")}</TabsTrigger>
            <TabsTrigger value="settings">{tString("settings")}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Likes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    {tString("recentLikes")}
                  </CardTitle>
                  <CardDescription>{tString("likedProducts")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {likes.length > 0 ? (
                    <div className="space-y-3">
                      {likes.slice(0, 3).map((like) => (
                        <Link href={`/products/${like.product_id}`} key={like.id}>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="relative w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <Image
                                src={like.product?.image_url || "/placeholder.svg"}
                                alt={like.product?.name || tString("product")}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">{like.product?.name || tString("product")}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {like.product?.brand || tString("brand")}
                              </p>
                              <p className="text-sm font-semibold text-purple-600">
                                {like.product?.new_price?.toLocaleString()} {tString("currency")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {likes.length > 3 && (
                        <Link href="/likes">
                          <Button variant="outline" className="w-full">
                            {tString("viewAllLikes")} ({likes.length})
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{tString("noLikedProducts")}</p>
                      <Link href="/products">
                        <Button variant="outline">{tString("exploreProducts")}</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cart Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-500" />
                    {tString("cartSummary")}
                  </CardTitle>
                  <CardDescription>{tString("cartItems")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {items.length > 0 ? (
                    <div className="space-y-3">
                      {items.slice(0, 3).map((item) => (
                        <Link href="/cart" key={item.id}>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="relative w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <Image
                                src={item.product.image_url || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">{item.product.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {tString("quantity")}: {item.quantity} • {(item.product.new_price * item.quantity).toLocaleString()} {tString("currency")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">{tString("total")}:</span>
                          <span className="font-semibold text-purple-600">
                            {items.reduce((sum, item) => sum + item.product.new_price * item.quantity, 0).toLocaleString()} {tString("currency")}
                          </span>
                        </div>
                        <Link href="/cart">
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-full"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            {tString("viewCart")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{tString("cartEmpty")}</p>
                      <Link href="/products">
                        <Button
                          size="lg"
                          variant="outline"
                          className="px-8 py-3 rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          {tString("continueShopping")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {tString("orders")}
                </CardTitle>
                <CardDescription>{tString("ordersDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Link href="/orders">{tString("viewAllOrders")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {tString("accountSettings")}
                </CardTitle>
                <CardDescription>{tString("updateProfile")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{tString("fullName")}</Label>
                  <Input
                    id="fullName"
                    value={profile?.full_name || ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{tString("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tString("emailCannotChange")}</p>
                </div>

                <Button
                  onClick={() => updateProfile({ full_name: profile?.full_name })}
                  disabled={updating}
                  className="w-full"
                >
                  {updating ? tString("updating") : tString("updateProfile")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
