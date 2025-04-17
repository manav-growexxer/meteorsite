"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaStar,
  FaCheck,
  FaShieldAlt,
  FaTruck,
  FaExchangeAlt,
} from "react-icons/fa";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  capacity: number;
  material: string;
  color: string;
  features: string[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isWishListed, setIsWishListed] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        console.log(response);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity,
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // This would normally call an API to add/remove from wishlist
    setIsWishListed(!isWishListed);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-gray-600 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-sm hover:shadow-md inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/products"
            className="hover:text-blue-600 transition-colors"
          >
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative h-96 md:h-[500px] mb-4 bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-24 rounded-lg overflow-hidden bg-gray-100 transition-all ${
                    selectedImage === index
                      ? "ring-2 ring-blue-500 scale-105 shadow-md"
                      : "hover:ring-2 hover:ring-blue-200"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">24 reviews</span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-blue-600 mb-6">
              ${product.price}
            </p>

            <div className="prose prose-blue max-w-none mb-8">
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Capacity</p>
                <p className="font-semibold">{product.capacity}ml</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Material</p>
                <p className="font-semibold">{product.material}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Color</p>
                <div className="flex items-center mt-1">
                  <div
                    className="h-6 w-6 rounded-full border border-gray-300 mr-2"
                    style={{ backgroundColor: product.color.toLowerCase() }}
                  ></div>
                  <p className="font-semibold">{product.color}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-full w-full sm:w-auto">
                <button
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className={`flex-1 bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center ${
                  isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                }`}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={toggleWishlist}
                className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${
                  isWishListed
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-gray-300 text-gray-400 hover:text-red-500"
                }`}
                aria-label="Add to wishlist"
              >
                <FaHeart
                  className={`w-5 h-5 ${isWishListed ? "fill-current" : ""}`}
                />
              </button>
              <button
                className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Share product"
              >
                <FaShare className="w-5 h-5" />
              </button>
            </div>

            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 flex items-center"
              >
                <FaCheck className="mr-2" />
                Product added to your cart!
              </motion.div>
            )}

            <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <FaTruck className="text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-500">
                    On all orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FaShieldAlt className="text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">2 Year Warranty</p>
                  <p className="text-sm text-gray-500">Full coverage</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaExchangeAlt className="text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">30 Day Returns</p>
                  <p className="text-sm text-gray-500">Money back guarantee</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
