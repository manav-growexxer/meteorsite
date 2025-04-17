"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaWater,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto" },
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-white shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <FaWater className="h-8 w-8 text-blue-600 mr-2 group-hover:text-blue-700 transition-colors" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-500 transition-colors">
                Meteor Water
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-600 hover:text-blue-600 transition-colors relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/cart"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1 relative group"
            >
              <div className="relative">
                <FaShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            {session?.user.role === "admin" && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-blue-600 transition-colors relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            )}
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600 group cursor-pointer relative">
                  <div className="bg-blue-100 rounded-full p-1.5">
                    <FaUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="group-hover:text-blue-600 transition-colors">
                    {session.user?.name}
                  </span>
                  <FaChevronDown className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />

                  {/* User dropdown - can be expanded in the future */}
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden py-4 space-y-4 overflow-hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              transition={{ duration: 0.3 }}
            >
              <Link
                href="/products"
                className="block text-gray-600 hover:text-blue-600 transition-colors py-2 hover:bg-blue-50 px-3 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="block text-gray-600 hover:text-blue-600 transition-colors py-2 flex items-center space-x-2 hover:bg-blue-50 px-3 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative">
                  <FaShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
              {session?.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2 hover:bg-blue-50 px-3 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              {session ? (
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-600 px-3 py-2">
                    <div className="bg-blue-100 rounded-full p-1.5">
                      <FaUser className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>{session.user?.name}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="block text-gray-600 hover:text-blue-600 transition-colors py-2 hover:bg-blue-50 px-3 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block text-gray-600 hover:text-blue-600 transition-colors py-2 hover:bg-blue-50 px-3 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors text-center shadow-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
