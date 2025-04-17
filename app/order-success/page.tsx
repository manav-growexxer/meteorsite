"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaBox,
  FaShoppingBag,
  FaEnvelope,
  FaArrowRight,
  FaHome,
} from "react-icons/fa";
import confetti from "canvas-confetti";

interface OrderDetails {
  orderNumber: string;
  createdAt: string;
  total: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      fetchOrderDetails(sessionId);
    } else {
      // If no session ID, redirect to home after a delay
      const timeout = setTimeout(() => {
        router.push("/");
      }, 5000);
      return () => clearTimeout(timeout);
    }

    // Trigger confetti effect
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/orders/${sessionId}`);
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Processing your order...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 bg-white rounded-full w-20 h-20 flex items-center justify-center"
              >
                <FaCheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">
                Thank you for your order!
              </h1>
            </div>
          </motion.div>

          <div className="p-8">
            <p className="text-xl text-blue-100">
              Your order has been successfully placed
            </p>
          </div>

          <div className="p-8">
            {orderDetails ? (
              <div className="space-y-8">
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Order Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-medium">{orderDetails.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(orderDetails.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium text-lg text-blue-600">
                        ${orderDetails.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </p>
                    </div>
                  </div>
                </div>

                {orderDetails.items && (
                  <div className="border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                    <div className="space-y-4">
                      {orderDetails.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full p-2 mr-3">
                              <FaBox className="text-gray-500 w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {orderDetails.shippingAddress && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Shipping Details
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">
                        {orderDetails.shippingAddress.name}
                      </p>
                      <p>{orderDetails.shippingAddress.address}</p>
                      <p>
                        {orderDetails.shippingAddress.city},{" "}
                        {orderDetails.shippingAddress.state}{" "}
                        {orderDetails.shippingAddress.zipCode}
                      </p>
                      <p>{orderDetails.shippingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Your order has been confirmed!
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  We&apos;ve sent a confirmation email with your order details.
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md inline-flex items-center"
              >
                <FaShoppingBag className="mr-2" />
                Continue Shopping
              </Link>
              <Link
                href="/account/orders"
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all inline-flex items-center"
              >
                <FaBox className="mr-2" />
                View Orders
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Need help with your order?{" "}
                <a
                  href="mailto:support@meteorwater.com"
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  Contact Support <FaEnvelope className="ml-1 w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
          {/* </motion.div> */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <h2 className="text-2xl font-bold mb-6">What&apos;s Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-blue-600 w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">Order Confirmation</h3>
                <p className="text-gray-600 text-sm">
                  Check your email for order details and tracking information.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBox className="text-blue-600 w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">Order Processing</h3>
                <p className="text-gray-600 text-sm">
                  We&apos;re preparing your items for shipment within 1-2
                  business days.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHome className="text-blue-600 w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Your order will be delivered to your doorstep within 3-5
                  business days.
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Return to Homepage <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
