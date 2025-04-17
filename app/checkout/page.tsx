"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import {
  FaLock,
  FaCreditCard,
  FaShieldAlt,
  FaTruck,
  FaArrowLeft,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

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

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  const [formErrors, setFormErrors] = useState<Partial<ShippingInfo>>({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    fetchCartItems();
  }, [session, router]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      setCartItems(data);

      // Pre-fill email from session if available
      if (session?.user?.email) {
        setShippingInfo((prev) => ({
          ...prev,
          email: session.user.email || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (formErrors[name as keyof ShippingInfo]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const validateForm = () => {
    const errors: Partial<ShippingInfo> = {};

    if (!shippingInfo.firstName.trim())
      errors.firstName = "First name is required";
    if (!shippingInfo.lastName.trim())
      errors.lastName = "Last name is required";
    if (!shippingInfo.email.trim()) errors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email))
      errors.email = "Valid email is required";
    if (!shippingInfo.address.trim()) errors.address = "Address is required";
    if (!shippingInfo.city.trim()) errors.city = "City is required";
    if (!shippingInfo.state.trim()) errors.state = "State is required";
    if (!shippingInfo.zipCode.trim()) errors.zipCode = "ZIP code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (validateForm()) {
        setStep(2);
        window.scrollTo(0, 0);
      }
      return;
    }

    setProcessing(true);

    try {
      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          shippingInfo,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe checkout error:", error);
        alert("There was an error processing your payment. Please try again.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Add some products to your cart before checking out
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-sm hover:shadow-md inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Link
            href="/cart"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Cart
          </Link>
        </div>

        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600">
              3
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <div className="text-center w-10">Shipping</div>
            <div className="text-center w-10">Payment</div>
            <div className="text-center w-10">Confirm</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6">
                  Shipping Information
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address*
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.city ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {formErrors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State*
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.state
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.state && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code*
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.zipCode
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.zipCode}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country*
                      </label>
                      <select
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                <div className="mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start mb-6">
                    <FaShieldAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Your payment information is processed securely. We do not
                      store credit card details nor have access to your credit
                      card information.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <input
                        id="card-payment"
                        name="payment-method"
                        type="radio"
                        checked={true}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        readOnly
                      />
                      <label
                        htmlFor="card-payment"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        Credit / Debit Card
                      </label>
                      <div className="ml-auto flex space-x-2">
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 pl-7">
                      <p className="text-sm text-gray-500">
                        You&apos;ll be redirected to our secure payment provider
                        to complete your purchase.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-medium mb-4">Shipping Address</h3>
                  <div className="text-sm text-gray-600 mb-6">
                    <p>
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state}{" "}
                      {shippingInfo.zipCode}
                    </p>
                    <p>{shippingInfo.country}</p>
                    <p>{shippingInfo.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    Edit shipping information
                  </button>
                </div>

                <div className="pt-6 mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-2" />
                        Complete Purchase
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm h-fit"
          >
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="max-h-80 overflow-y-auto mb-6 pr-2">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 mb-4 pb-4 border-b last:border-b-0"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                <span>Total</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <FaTruck className="mr-2 h-4 w-4" />
                <span>Free shipping on all orders</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FaCreditCard className="mr-2 h-4 w-4" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FaShieldAlt className="mr-2 h-4 w-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
