"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaFilter, FaShoppingCart, FaStar, FaHeart, FaSearch, FaSort, FaTimes, FaWater } from "react-icons/fa"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  images: string[]
  capacity: number
  material: string
  color: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    capacity: "",
    material: "",
    color: "",
    priceRange: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    // Count active filters
    let count = 0
    if (filter.capacity) count++
    if (filter.material) count++
    if (filter.color) count++
    if (filter.priceRange) count++
    setActiveFiltersCount(count)
  }, [filter])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }, [])

  const clearFilters = () => {
    setFilter({
      capacity: "",
      material: "",
      color: "",
      priceRange: "",
    })
  }

  const getPriceRange = (range: string) => {
    switch (range) {
      case "under50":
        return { min: 0, max: 50 }
      case "50to100":
        return { min: 50, max: 100 }
      case "100to200":
        return { min: 100, max: 200 }
      case "over200":
        return { min: 200, max: Number.POSITIVE_INFINITY }
      default:
        return { min: 0, max: Number.POSITIVE_INFINITY }
    }
  }

  const filteredProducts = products
    .filter((product) => {
      // Search term filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Capacity filter
      if (filter.capacity && product.capacity !== Number(filter.capacity)) {
        return false
      }

      // Material filter
      if (filter.material && product.material !== filter.material) {
        return false
      }

      // Color filter
      if (filter.color && product.color !== filter.color) {
        return false
      }

      // Price range filter
      if (filter.priceRange) {
        const { min, max } = getPriceRange(filter.priceRange)
        if (product.price < min || product.price > max) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        default:
          return 0 // Featured - no specific sort
      }
    })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Water Bottles</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our collection of high-quality, eco-friendly water bottles designed for your active lifestyle
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8 sticky top-20 z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                  activeFiltersCount > 0
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FaFilter className="mr-1" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <FaSort className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filter.capacity}
                    onChange={(e) => setFilter({ ...filter, capacity: e.target.value })}
                  >
                    <option value="">All Capacities</option>
                    <option value="500">500ml</option>
                    <option value="750">750ml</option>
                    <option value="1000">1000ml</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filter.material}
                    onChange={(e) => setFilter({ ...filter, material: e.target.value })}
                  >
                    <option value="">All Materials</option>
                    <option value="Stainless Steel">Stainless Steel</option>
                    <option value="Glass">Glass</option>
                    <option value="Plastic">Plastic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filter.color}
                    onChange={(e) => setFilter({ ...filter, color: e.target.value })}
                  >
                    <option value="">All Colors</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filter.priceRange}
                    onChange={(e) => setFilter({ ...filter, priceRange: e.target.value })}
                  >
                    <option value="">All Prices</option>
                    <option value="under50">Under $50</option>
                    <option value="50to100">$50 - $100</option>
                    <option value="100to200">$100 - $200</option>
                    <option value="over200">Over $200</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-blue-600 flex items-center">
                  <FaTimes className="mr-1" />
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filter.capacity && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {filter.capacity}ml
                <button
                  onClick={() => setFilter({ ...filter, capacity: "" })}
                  className="ml-2 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            )}
            {filter.material && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {filter.material}
                <button
                  onClick={() => setFilter({ ...filter, material: "" })}
                  className="ml-2 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            )}
            {filter.color && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {filter.color}
                <button
                  onClick={() => setFilter({ ...filter, color: "" })}
                  className="ml-2 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            )}
            {filter.priceRange && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {filter.priceRange === "under50" && "Under $50"}
                {filter.priceRange === "50to100" && "$50 - $100"}
                {filter.priceRange === "100to200" && "$100 - $200"}
                {filter.priceRange === "over200" && "Over $200"}
                <button
                  onClick={() => setFilter({ ...filter, priceRange: "" })}
                  className="ml-2 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-500 mb-6 flex items-center justify-between">
          <span>Showing {filteredProducts.length} products</span>
          <span className="text-blue-600">{sortBy !== "featured" && `Sorted by: ${sortBy.replace("-", " ")}`}</span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <FaWater className="mx-auto h-16 w-16 text-blue-200" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria</p>
            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
              >
                <Link href={`/products/${product._id}`} className="block relative">
                  <div className="relative h-64 bg-gray-100">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 space-y-2">
                      <button
                        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleWishlist(product._id)
                        }}
                      >
                        <FaHeart
                          className={`h-4 w-4 ${
                            wishlist.includes(product._id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h2>
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="h-4 w-4" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">(24 reviews)</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      <span className="ml-2 text-sm text-gray-500">{product.capacity}ml</span>
                    </div>
                    <Link href={`/products/${product._id}`}>
                      <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <FaShoppingCart className="h-5 w-5" />
                      </button>
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{product.material}</span>
                    <div
                      className="h-4 w-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: product.color.toLowerCase() }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
