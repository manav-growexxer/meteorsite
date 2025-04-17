"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaTrash,
  FaArrowLeft,
  FaLock,
  FaTag,
  FaTruck,
} from "react-icons/fa";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

export default function CartPage() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  useEffect(() => {
    if (session) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        setCartItems(
          cartItems.map((item) =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item._id !== itemId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const applyCoupon = () => {
    // This would normally validate with the backend
    if (couponCode.toUpperCase() === "WELCOME10") {
      setAppliedCoupon({ code: couponCode, discount: 10 });
    } else if (couponCode.toUpperCase() === "METEOR20") {
      setAppliedCoupon({ code: couponCode, discount: 20 });
    } else {
      alert("Invalid coupon code");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return (calculateSubtotal() * appliedCoupon.discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md"
        >
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is waiting</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view your cart and complete your purchase
          </p>
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg inline-block"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
        <Link
          href="/products"
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Continue Shopping
        </Link>
      </motion.div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-lg shadow-sm"
        >
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart className="h-10 w-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md inline-flex items-center"
          >
            Browse Products
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 mb-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.product._id}`}>
                      <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-blue-600 font-medium">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center mt-2 text-sm"
                      onClick={() => removeItem(item._id)}
                    >
                      <FaTrash className="w-3 h-3 mr-1" /> Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24"
          >
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {!appliedCoupon && (
              <div className="mb-6">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Try WELCOME10 for 10% off your first order
                </p>
              </div>
            )}

            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <FaLock className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </Link>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <FaTruck className="mr-2 h-4 w-4" />
                <span>Free shipping on all orders</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FaTag className="mr-2 h-4 w-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
