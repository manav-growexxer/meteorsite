"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  FaShoppingCart,
  FaStar,
  FaArrowRight,
  FaWater,
  FaLeaf,
  FaShieldAlt,
  FaRecycle,
} from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });

  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    amount: 0.3,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.slice(0, 3)); // Just get first 3 products for featured section
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "I've tried many water bottles, but Meteor's quality is unmatched. The insulation keeps my drinks cold for over 24 hours, even in hot weather!",
      author: "Sarah Johnson",
      role: "Fitness Instructor",
    },
    {
      text: "The sleek design and durability of my Meteor bottle make it perfect for my daily hikes. It's become an essential part of my outdoor gear.",
      author: "Michael Chen",
      role: "Adventure Photographer",
    },
    {
      text: "As someone who's conscious about reducing plastic waste, I love that Meteor bottles are eco-friendly and built to last. Worth every penny!",
      author: "Emma Rodriguez",
      role: "Environmental Scientist",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Animated water drops */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-white opacity-30"
              initial={{
                x: Math.random() * 100 + "%",
                y: -20,
                opacity: 0.3 + Math.random() * 0.4,
              }}
              animate={{
                y: "120vh",
                opacity: 0,
              }}
              transition={{
                duration: 7 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Stay Hydrated in Style
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Premium water bottles designed for your active lifestyle.
              Eco-friendly, durable, and beautifully crafted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Shop Collection
              </Link>
              <Link
                href="#features"
                className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Bestsellers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular water bottles, loved by customers
            worldwide for their quality, design, and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/products/${product._id}`} className="group block">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group-hover:translate-y-[-8px]">
                  <div className="relative h-64 w-full overflow-hidden">
                    {product.images && product.images[0] && (
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                      <FaShoppingCart className="text-blue-600 w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">(24)</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Bestseller
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            View All Products <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Meteor?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our water bottles are designed with your needs in mind, combining
              functionality, style, and sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaWater className="w-8 h-8 text-blue-600" />,
                title: "Premium Quality",
                description:
                  "Made with the finest materials for durability and performance",
                delay: 0.1,
              },
              {
                icon: <FaLeaf className="w-8 h-8 text-green-600" />,
                title: "Eco-Friendly",
                description:
                  "Sustainable materials and manufacturing processes",
                delay: 0.2,
              },
              {
                icon: <FaShieldAlt className="w-8 h-8 text-purple-600" />,
                title: "Lifetime Warranty",
                description: "We stand behind our products with confidence",
                delay: 0.3,
              },
              {
                icon: <FaRecycle className="w-8 h-8 text-teal-600" />,
                title: "Recyclable",
                description: "Designed for minimal environmental impact",
                delay: 0.4,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from the people who
              use Meteor bottles every day.
            </p>
          </div>

          <div className="relative h-64 md:h-48">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeTestimonial === index ? 1 : 0,
                  x:
                    activeTestimonial === index
                      ? 0
                      : activeTestimonial > index
                      ? -100
                      : 100,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-blue-50 p-8 rounded-xl text-center max-w-3xl mx-auto">
                  <p className="text-lg text-gray-700 italic mb-6">
                    {testimonial.text}
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${
                  activeTestimonial === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Upgrade Your Hydration?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers and experience the Meteor
            difference today.
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
