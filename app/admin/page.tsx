"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaBox,
  FaUsers,
  FaDollarSign,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  description?: string;
  images?: string[];
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchProducts();
  }, [session, router, fetchProducts]);

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setProducts(products.filter((p) => p._id !== id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      filterActive === null ? true : product.isActive === filterActive
    )
    .filter((product) => (filterLowStock ? product.stock < 10 : true))
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const order = sortOrder === "asc" ? 1 : -1;
      return typeof aValue === "string"
        ? order * aValue.localeCompare(bValue as string)
        : order * (Number(aValue) - Number(bValue));
    });

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((acc, p) => acc + p.price * p.stock, 0),
    lowStock: products.filter((p) => p.stock < 10).length,
    activeProducts: products.filter((p) => p.isActive).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your products and inventory
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
          >
            <FaPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Product
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <FaBox className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Products
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.totalProducts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <FaDollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Inventory Value
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      ${stats.totalValue.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                  <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Low Stock Items
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.lowStock}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                  <FaUsers className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Products
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.activeProducts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white shadow-sm rounded-lg mb-8"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative rounded-md shadow-sm max-w-xs w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Status:</label>
                  <select
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={
                      filterActive === null
                        ? "all"
                        : filterActive
                        ? "active"
                        : "inactive"
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterActive(
                        value === "all" ? null : value === "active"
                      );
                    }}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "name" | "price" | "stock")
                    }
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                  </select>
                </div>

                <button
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <>
                      <FaSortAmountUp className="mr-2 h-4 w-4" /> Ascending
                    </>
                  ) : (
                    <>
                      <FaSortAmountDown className="mr-2 h-4 w-4" /> Descending
                    </>
                  )}
                </button>

                <button
                  className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                    filterLowStock
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setFilterLowStock(!filterLowStock)}
                >
                  <FaFilter className="mr-2 h-4 w-4" />
                  Low Stock Only
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white shadow-sm overflow-hidden sm:rounded-md"
        >
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <FaBox className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                  Add New Product
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <motion.li
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {product.name}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaDollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p className="font-medium">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaBox className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p
                              className={`font-medium ${
                                product.stock < 10 ? "text-yellow-600" : ""
                              }`}
                            >
                              {product.stock} in stock
                              {product.stock < 10 && (
                                <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                                  Low
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/products/${product._id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors"
                            aria-label="Edit product"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors"
                            aria-label="Delete product"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/products/${product._id}`)
                            }
                            className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            aria-label="View product"
                          >
                            <FaEye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedProduct.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(selectedProduct._id)}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
