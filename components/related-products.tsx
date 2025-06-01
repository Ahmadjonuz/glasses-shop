"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/contexts/language-context"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

interface RelatedProductsProps {
  currentProductId: string
  category: string
  brand: string
}

export function RelatedProducts({ currentProductId, category, brand }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useLanguage()

  const productsPerView = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  }

  // Get current window width
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Determine how many products to show based on screen size
  const getProductsPerView = () => {
    if (windowWidth < 640) return productsPerView.sm
    if (windowWidth < 768) return productsPerView.md
    if (windowWidth < 1024) return productsPerView.lg
    return productsPerView.xl
  }

  const visibleProducts = getProductsPerView()

  useEffect(() => {
    fetchRelatedProducts()
  }, [currentProductId, category, brand])

  const fetchRelatedProducts = async () => {
    try {
      // First try to get products from the same category
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", currentProductId)
        .limit(8)

      if (error) throw error

      // If not enough products from the same category, add some from the same brand
      if (data.length < 4) {
        const { data: brandData, error: brandError } = await supabase
          .from("products")
          .select("*")
          .eq("brand", brand)
          .neq("id", currentProductId)
          .limit(8 - data.length)

        if (!brandError && brandData) {
          // Filter out duplicates
          const brandProducts = brandData.filter(
            (brandProduct) => !data.some((product) => product.id === brandProduct.id),
          )
          data = [...data, ...brandProducts]
        }
      }

      // If still not enough, get random products
      if (data.length < 4) {
        const { data: randomData, error: randomError } = await supabase
          .from("products")
          .select("*")
          .neq("id", currentProductId)
          .limit(8 - data.length)

        if (!randomError && randomData) {
          // Filter out duplicates
          const randomProducts = randomData.filter(
            (randomProduct) => !data.some((product) => product.id === randomProduct.id),
          )
          data = [...data, ...randomProducts]
        }
      }

      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching related products:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, products.length - visibleProducts + 1))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + Math.max(1, products.length - visibleProducts + 1)) %
        Math.max(1, products.length - visibleProducts + 1),
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t("relatedProducts")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("relatedProducts")}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={products.length <= visibleProducts}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={products.length <= visibleProducts}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)`,
            width: `${(products.length / visibleProducts) * 100}%`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="px-2"
              style={{ width: `${100 / products.length}%`, minWidth: `${100 / visibleProducts}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
