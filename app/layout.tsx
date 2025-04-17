import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../src/components/layout/Navbar";
import Providers from "../src/components/providers/Providers";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaWater,
} from "react-icons/fa";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meteor Water Bottles",
  description: "Premium quality water bottles for your active lifestyle",
};

const ContactItem = ({ icon, children }) => (
  <li className="flex items-start">
    {icon}
    <span className="text-gray-400">{children}</span>
  </li>
);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div>
                <div className="flex items-center mb-4">
                  <FaWater className="h-8 w-8 text-blue-400 mr-2" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    Meteor Water
                  </span>
                </div>
                <p className="text-gray-400 mb-4">
                  Premium quality water bottles for your active lifestyle.
                  Eco-friendly, durable, and beautifully crafted.
                </p>
                <div className="flex space-x-4">
                  {[
                    { href: "#", icon: <FaFacebook /> },
                    { href: "#", icon: <FaTwitter /> },
                    { href: "#", icon: <FaInstagram /> },
                    { href: "#", icon: <FaYoutube /> },
                  ].map(({ href, icon }, idx) => (
                    <a
                      key={idx}
                      href={href}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {icon}
                      <span className="sr-only">{icon.type.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Products", href: "/products" },
                    { label: "About Us", href: "/about" },
                    { label: "Blog", href: "/blog" },
                    { label: "Contact", href: "/contact" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Service Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                <ul className="space-y-2">
                  {[
                    { label: "FAQ", href: "/faq" },
                    { label: "Shipping & Returns", href: "/shipping" },
                    { label: "Warranty", href: "/warranty" },
                    { label: "Privacy Policy", href: "/privacy" },
                    { label: "Terms & Conditions", href: "/terms" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Us Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-4">
                  {[
                    {
                      icon: (
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-2" />
                      ),
                      text: "123456789",
                    },
                    {
                      icon: (
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-2" />
                      ),
                      text: "123456789",
                    },
                    {
                      icon: (
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-2" />
                      ),
                      text: "123456789",
                    },
                  ].map(({ icon, text }, idx) => (
                    <ContactItem key={idx} icon={icon}>
                      {text}
                    </ContactItem>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  );
}
