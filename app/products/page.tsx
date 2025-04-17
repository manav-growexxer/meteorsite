"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFilter, FaShoppingCart, FaStar, FaHeart, FaSearch } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  capacity: number;
  material: string;
  color: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    capacity: "",
    material: "",
    color: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (filter.capacity && product.capacity !== Number(filter.capacity))
      return false;
    if (filter.material && product.material !== filter.material) return false;
    if (filter.color && product.color !== filter.color) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Water Bottles</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our collection of high-quality, eco-friendly water bottles designed for your active lifestyle
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex space-x-4">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter.capacity}
                onChange={(e) => setFilter({ ...filter, capacity: e.target.value })}
              >
                <option value="">Capacity</option>
                <option value="500">500ml</option>
                <option value="750">750ml</option>
                <option value="1000">1000ml</option>
              </select>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter.material}
                onChange={(e) => setFilter({ ...filter, material: e.target.value })}
              >
                <option value="">Material</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Glass">Glass</option>
                <option value="Plastic">Plastic</option>
              </select>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter.color}
                onChange={(e) => setFilter({ ...filter, color: e.target.value })}
              >
                <option value="">Color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(filter.capacity || filter.material || filter.color) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filter.capacity && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {filter.capacity}ml
                <button
                  onClick={() => setFilter({ ...filter, capacity: "" })}
                  className="ml-2 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  ×
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
                  ×
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
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-500 mb-6">
          Showing {filteredProducts.length} products
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/products/${product._id}`} className="block relative">
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 space-y-2">
                    <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
                      <FaHeart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {product.name}
                </h2>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">(24 reviews)</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{product.capacity}ml</span>
                  </div>
                  <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <FaShoppingCart className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{product.material}</span>
                  <div
                    className="h-4 w-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: product.color.toLowerCase() }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
