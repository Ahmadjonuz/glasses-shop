"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const { tString } = useLanguage()
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add newsletter subscription logic here
    toast({
      title: tString("subscribeNewsletter"),
      description: tString("subscribeDesc"),
    })
    setEmail("")
  }

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{tString("aboutUsFooter")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-purple-600">
                  {tString("ourStory")}
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="hover:text-purple-600">
                  {tString("ourTeam")}
                </Link>
              </li>
              <li>
                <Link href="/about#values" className="hover:text-purple-600">
                  {tString("ourValues")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{tString("productsFooter")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-purple-600">
                  {tString("featuredProductsTitle")}
                </Link>
              </li>
              <li>
                <Link href="/products?category=new" className="hover:text-purple-600">
                  {tString("newArrivals")}
                </Link>
              </li>
              <li>
                <Link href="/products?category=special" className="hover:text-purple-600">
                  {tString("specialOffers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{tString("contactFooter")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-purple-600">
                  {tString("getInTouch")}
                </Link>
              </li>
              <li>
                <Link href="/contact#location" className="hover:text-purple-600">
                  {tString("visitUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact#hours" className="hover:text-purple-600">
                  {tString("openingHours")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{tString("newsletter")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tString("subscribeDesc")}</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder={tString("enterEmail")}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full">
                {tString("subscribe")}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 VisionVogue. {tString("termsOfService")}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600">
                {tString("privacyPolicy")}
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600">
                {tString("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

