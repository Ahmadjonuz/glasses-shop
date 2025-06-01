"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ShoppingCart, User, Moon, Sun, Menu, Heart, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import { useLikes } from "@/hooks/use-likes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, tString } = useLanguage()
  const { user, signOut } = useAuth()
  const { items } = useCart()
  const { likes } = useLikes()
  const router = useRouter()

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const likesCount = likes.length

  const handleLanguageChange = (value: string) => {
    setLanguage(value as "uz" | "ru" | "en")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const openCart = () => {
    router.push("/cart")
  }

  const openLikes = () => {
    router.push("/likes")
  }

  const handleLogout = () => {
    signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              VisionVogue
            </span>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="hover:text-purple-600">
                  {tString("home")}
                </Link>
                <Link href="/products" className="hover:text-purple-600">
                  {tString("productsLink")}
                </Link>
                <Link href="/about" className="hover:text-purple-600">
                  {tString("aboutLink")}
                </Link>
                <Link href="/contact" className="hover:text-purple-600">
                  {tString("contactLink")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-purple-600">
              {tString("home")}
            </Link>
            <Link href="/products" className="hover:text-purple-600">
              {tString("productsLink")}
            </Link>
            <Link href="/about" className="hover:text-purple-600">
              {tString("aboutLink")}
            </Link>
            <Link href="/contact" className="hover:text-purple-600">
              {tString("contactLink")}
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">O'zbek</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" onClick={openCart}>
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </Button>

            {/* Likes */}
            <Button variant="ghost" size="icon" onClick={openLikes}>
              <div className="relative">
                <Heart className="h-5 w-5" />
                {likesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {likesCount}
                  </span>
                )}
              </div>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    {tString("profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    {tString("myOrders")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>{tString("logout")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => router.push("/login")}>
                <LogIn className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
