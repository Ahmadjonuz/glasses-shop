"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Parollar bir xil emas")
      toast({
        title: "Xatolik!",
        description: "Parollar bir xil emas. Iltimos, qayta urinib ko'ring.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await signUp(formData.email, formData.password, formData.name)
      toast({
        title: "Muvaffaqiyatli!",
        description: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi. Iltimos, emailingizni tasdiqlang.",
        variant: "default",
      })
      router.push("/login") // Redirect to login page after successful registration
    } catch (error) {
      console.error("Registration failed:", error)
      setError("Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
      toast({
        title: "Xatolik!",
        description: "Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border dark:border-gray-800 dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center dark:text-white">Ro'yxatdan o'tish</CardTitle>
          <CardDescription className="text-center dark:text-gray-400">
            Ro'yxatdan o'tish uchun ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-200">To'liq ism</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="To'liq ismingizni kiriting"
                required
                value={formData.name}
                onChange={handleChange}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email manzilingizni kiriting"
                required
                value={formData.email}
                onChange={handleChange}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-200">Parol</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Parol yarating"
                required
                value={formData.password}
                onChange={handleChange}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-gray-200">Parolni tasdiqlang</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Parolni qayta kiriting"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              disabled={loading}
            >
              {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Hisobingiz bormi?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Tizimga kirish
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
