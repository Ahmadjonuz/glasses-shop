"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/contexts/language-context"
import { Search, Filter, X } from "lucide-react"

// Product interface'ni yangilaymiz
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [genders, setGenders] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState<string>("all")
  const { t, tString } = useLanguage()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedGender, sortBy])

  // fetchProducts funksiyasini yangilaymiz va genders qo'shamiz
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*")

      if (error) throw error

      setProducts(data || [])

      // Extract unique categories, brands, and genders
      const uniqueCategories = [...new Set(data?.map((p) => p.category) || [])]
      const uniqueBrands = [...new Set(data?.map((p) => p.brand) || [])]
      const uniqueGenders = [...new Set(data?.map((p) => p.gender) || [])]

      setCategories(uniqueCategories)
      setBrands(uniqueBrands)
      setGenders(uniqueGenders)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // filterAndSortProducts funksiyasini yangilaymiz
  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Brand filter
    if (selectedBrand && selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    // Gender filter
    if (selectedGender && selectedGender !== "all") {
      filtered = filtered.filter((product) => product.gender === selectedGender)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.new_price - b.new_price
        case "price-high":
          return b.new_price - a.new_price
        case "name":
          return a.name.localeCompare(b.name)
        case "featured":
          return b.featured ? 1 : -1
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  // clearFilters funksiyasini yangilaymiz
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedBrand("all")
    setSelectedGender("all")
    setSortBy("name")
  }

  // hasActiveFilters'ni yangilaymiz
  const hasActiveFilters = searchTerm || selectedCategory || selectedBrand || selectedGender

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {tString("ourProducts")}
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {tString("productsSubtitle")}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={tString("searchProducts")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={tString("category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tString("allCategories")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Brand Filter */}
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={tString("brand")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tString("allBrands")}</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gender Filter */}
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={tString("gender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tString("allGenders")}</SelectItem>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={tString("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{tString("nameAZ")}</SelectItem>
                <SelectItem value="price-low">{tString("priceLowHigh")}</SelectItem>
                <SelectItem value="price-high">{tString("priceHighLow")}</SelectItem>
                <SelectItem value="featured">{tString("featuredFirst")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full lg:w-auto">
                <X className="w-4 h-4 mr-2" />
                {tString("clear")}
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {tString("search")}: {searchTerm}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {tString("category")}: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {tString("brand")}: {selectedBrand}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand("")} />
                </Badge>
              )}
              {selectedGender && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {tString("gender")}: {selectedGender}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGender("")} />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {tString("showing")} {filteredProducts.length} {tString("of")} {products.length} {tString("products")}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{tString("noProductsFound")}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{tString("tryAdjusting")}</p>
            <Button onClick={clearFilters} variant="outline">
              {tString("clearAllFilters")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
