"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Package, Truck, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product: {
    name: string
    image_url: string
    brand: string
  }
}

interface Order {
  id: string
  created_at: string
  total_amount: number
  status: string
  payment_method: string
  payment_status: string
  shipping_address: {
    fullName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const { tString } = useLanguage()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const checkAuthAndFetchOrders = async () => {
      if (!isClient) return

      if (!authLoading && !user) {
        toast({
          title: tString("authRequiredMessage"),
          description: tString("loginToAddCart"),
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      if (user) {
        try {
          console.log('Attempting to fetch orders for user:', user.id)
          
          const { data, error } = await supabase
            .from('orders')
            .select(`
              id,
              created_at,
              total_amount,
              status,
              payment_method,
              payment_status,
              shipping_address,
              order_items (
                id,
                quantity,
                price,
                product:products (
                  name,
                  image_url,
                  brand
                )
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            throw new Error(`Failed to fetch orders: ${error.message}`)
          }

          if (!data) {
            throw new Error('No data returned from the database')
          }

          console.log('Successfully fetched orders:', {
            orderCount: data.length,
            firstOrder: data[0]
          })
          
          setOrders(data)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
          console.error('Error details:', {
            message: errorMessage,
            error: error,
            userId: user.id,
            timestamp: new Date().toISOString()
          })
          toast({
            title: tString("errorMessage"),
            description: `${tString("failedToLoadOrders")}: ${errorMessage}`,
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    checkAuthAndFetchOrders()
  }, [isClient, authLoading, user, router, toast, tString])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "processing":
        return <Package className="w-5 h-5 text-blue-600" />
      case "shipping":
        return <Truck className="w-5 h-5 text-purple-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return tString("orderStatusCompleted")
      case "processing":
        return tString("orderStatusProcessing")
      case "shipping":
        return tString("orderStatusShipping")
      default:
        return tString("orderStatusPending")
    }
  }

  if (!isClient || authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {tString("myOrders")}
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {orders.length} {tString("orders")}
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">{tString("noOrders")}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{tString("noOrdersDesc")}</p>
                <Link href="/products">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    {tString("startShopping")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </CardTitle>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image_url || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.product.brand}</p>
                            <div className="flex items-center gap-2 mt-1 text-sm">
                              <span>
                                {tString("quantity")}: {item.quantity}
                              </span>
                              <span>•</span>
                              <span>
                                {item.price.toLocaleString()} {tString("currency")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details */}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{order.shipping_address.fullName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.shipping_address.address}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.shipping_address.city}, {order.shipping_address.state}{" "}
                            {order.shipping_address.zipCode}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.shipping_address.country}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tString("total")}:
                          </p>
                          <p className="text-lg font-semibold">
                            {order.total_amount.toLocaleString()} {tString("currency")}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tString("paymentMethod")}: {tString(order.payment_method)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tString("paymentStatus")}: {tString(order.payment_status)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}