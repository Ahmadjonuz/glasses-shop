"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { supabase } from "@/lib/supabase"
import { CreditCard, Truck, Shield, ArrowLeft, MapPin, User, Mail, Phone, Building, CheckCircle } from "lucide-react"
import Link from "next/link"

interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth()
  const { items, total, clearCart, refetch, loading: cartLoading } = useCart()
  const { toast } = useToast()
  const { tString } = useLanguage()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review, 4: Success
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [saveAddress, setSaveAddress] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Make sure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Set initial shipping address
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Uzbekistan",
  })

  // Update shipping address when user data is available
  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        email: user.email || "",
        fullName: user.user_metadata?.full_name || "",
      }))
    }
  }, [user])

  // Initial cart data load and auth check
  useEffect(() => {
    const checkAuthAndCart = async () => {
      if (!isClient) return

    if (!authLoading && !user) {
        console.log("User not authenticated, redirecting to login")
      toast({
          title: tString("authRequiredMessage"),
          description: tString("loginToAddCart"),
        variant: "destructive",
      })
      router.push("/login")
        return
      }

      try {
        await refetch()
      } catch (error) {
        console.error("Error loading cart data:", error)
        toast({
          title: tString("errorMessage"),
          description: tString("failedToLoadCart"),
          variant: "destructive",
        })
    }
    }

    checkAuthAndCart()
  }, [isClient, authLoading, user, router, toast, tString, refetch])

  // Check if cart is empty
  useEffect(() => {
    if (!authLoading && !cartLoading && user && (!items || items.length === 0)) {
      console.log("Cart is empty, redirecting to cart page")
      toast({
        title: tString("cartEmpty"),
        description: tString("cartEmptyDesc"),
        variant: "destructive",
      })
      router.push("/cart")
    }
  }, [authLoading, cartLoading, user, items, router, toast, tString])

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const shippingCost = total > 100000 ? 0 : 25000 // Free shipping over 100,000 sum
  const tax = total * 0.12 // 12% tax
  const finalTotal = total + shippingCost + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Shipping form submitted")

    // Validate required fields
    if (
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      toast({
        title: tString("errorMessage"),
        description: tString("fillAllRequiredFields"),
        variant: "destructive",
      })
      return
    }

    setStep(2)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate payment method
    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
        toast({
          title: tString("errorMessage"),
          description: tString("fillCardDetails"),
          variant: "destructive",
        })
        return
      }
    }

    setStep(3)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      console.log("Placing order...")

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user!.id,
          total_amount: finalTotal,
          status: "pending",
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          payment_status: paymentMethod === "cash" ? "pending" : "paid",
        })
        .select()
        .single()

      if (orderError) {
        console.error("Order error:", orderError)
        throw orderError
      }

      console.log("Order created:", order)

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.new_price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("Order items error:", itemsError)
        throw itemsError
      }

      // Save shipping address if requested
      if (saveAddress) {
        const { error: addressError } = await supabase.from("shipping_addresses").insert({
          user_id: user!.id,
          ...shippingAddress,
        })

        if (addressError) {
          console.error("Address save error:", addressError)
          // Don't throw error here, just log it
        }
      }

      // Clear cart
      await clearCart()

      // Show success message
      toast({
        title: tString("orderConfirmed"),
        description: tString("orderSuccess"),
      })

      // Set success step
      setStep(4)
    } catch (error) {
      console.error("Place order error:", error)
      toast({
        title: tString("errorMessage"),
        description: tString("orderError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isClient || authLoading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user || !items || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {tString("checkout")}
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {items.length} {tString("items")}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Form */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    {tString("shippingInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {tString("fullName")}
                        </Label>
                          <Input
                            id="fullName"
                            value={shippingAddress.fullName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                            required
                          />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {tString("email")}
                        </Label>
                          <Input
                            id="email"
                            type="email"
                            value={shippingAddress.email}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                            required
                          />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {tString("phone")}
                        </Label>
                          <Input
                            id="phone"
                          type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                            required
                          />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {tString("address")}
                        </Label>
                        <Input
                          id="address"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                          required
                        />
                    </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {tString("city")}
                        </Label>
                          <Input
                            id="city"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            required
                          />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">{tString("state")}</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">{tString("zipCode")}</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">{tString("country")}</Label>
                        <Input
                          id="country"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        id="saveAddress"
                        checked={saveAddress}
                        onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                      />
                      <label htmlFor="saveAddress" className="text-sm text-gray-600 dark:text-gray-400">
                        {tString("saveAddress")}
                      </label>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      {tString("continueToPayment")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Form */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {tString("paymentMethod")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
                        >
                          <CreditCard className="mb-2 h-6 w-6" />
                          {tString("card")}
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                        <Label
                          htmlFor="cash"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
                        >
                          <Truck className="mb-2 h-6 w-6" />
                          {tString("cash")}
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">{tString("cardNumber")}</Label>
                          <Input
                            id="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">{tString("expiryDate")}</Label>
                            <Input
                              id="expiryDate"
                              value={cardDetails.expiryDate}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cvv">{tString("cvv")}</Label>
                            <Input
                              id="cvv"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">{tString("cardholderName")}</Label>
                          <Input
                            id="cardholderName"
                            value={cardDetails.cardholderName}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        {tString("back")}
                      </Button>
                      <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                        {tString("reviewOrder")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Review Order */}
            {step === 3 && (
                <Card>
                  <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {tString("reviewOrder")}
                  </CardTitle>
                  </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{tString("orderItems")}</h3>
                    <div className="space-y-4">
                    {items.map((item) => (
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
                                {item.product.new_price.toLocaleString()} {tString("currency")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5" />
                      {tString("shippingInfo")}
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                      <p className="font-medium">{shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{shippingAddress.phone}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{shippingAddress.address}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{shippingAddress.country}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                      <CreditCard className="w-5 h-5" />
                      {tString("paymentMethod")}
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="font-medium">{tString(paymentMethod === "card" ? "card" : "cash")}</p>
                      {paymentMethod === "card" && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {cardDetails.cardNumber.slice(-4).padStart(16, "*")}
                          </p>
                      )}
                        </div>
                      </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    {tString("back")}
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {loading ? tString("placingOrder") : tString("placeOrder")}
                  </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success */}
            {step === 4 && (
              <Card>
                <CardContent className="py-16">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">{tString("orderConfirmed")}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{tString("orderSuccess")}</p>
                    <div className="flex gap-4 justify-center">
                      <Link href="/orders">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">{tString("viewOrders")}</Button>
                      </Link>
                      <Link href="/products">
                        <Button variant="outline">{tString("continueShopping")}</Button>
                      </Link>
                </div>
              </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          {step < 4 && (
            <div>
              <Card>
              <CardHeader>
                <CardTitle>{tString("orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                    <span>
                          {item.quantity} × {item.product.name}
                    </span>
                        <span>
                          {(item.quantity * item.product.new_price).toLocaleString()} {tString("currency")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{tString("subtotal")}</span>
                    <span>
                      {total.toLocaleString()} {tString("currency")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{tString("shipping")}</span>
                      <span>
                        {shippingCost === 0 ? tString("free") : `${shippingCost.toLocaleString()} ${tString("currency")}`}
                      </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{tString("tax")}</span>
                    <span>
                      {tax.toLocaleString()} {tString("currency")}
                    </span>
                  </div>
                </div>

                <Separator />

                  <div className="flex justify-between font-semibold">
                  <span>{tString("total")}</span>
                  <span>
                    {finalTotal.toLocaleString()} {tString("currency")}
                  </span>
                </div>

                  <div className="pt-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-4 h-4" />
                        {tString("secureCheckout")}
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
