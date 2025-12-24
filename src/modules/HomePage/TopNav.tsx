'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FinkiaLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState< 'About Us' | 'Contact Us' >('About Us');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navItems: { label: 'About Us' | 'Contact Us', href: string }[] = [
    // { label: 'Home', href: '/' },
    // { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact Us', href: '/contact-us' },
    // { label: 'Blog', href: '/blog' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C2648] to-[#000000] text-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <header className="py-5">
          <nav className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl mr-2">
                <Image src="/icons.png" alt="logo icon" width={40} height={40} />
              </span>
              <span className="text-xl lg:text-2xl font-bold">Finkia</span>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center space-x-10">
              {navItems.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setActiveNav(label)}
                    className={`text-white pb-1 flex items-center ${
                      activeNav === label
                        ? 'border-b-2 border-white'
                        : 'hover:opacity-80 transition-opacity'
                    }`}
                  >
                    {label}
                    
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/signin" className="text-white hover:opacity-80 transition-opacity">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-[#eaab40] text-white px-6 py-3 rounded-full font-semibold hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden text-white text-2xl" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </nav>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 bg-slate-900/95 backdrop-blur-sm rounded-lg p-5">
              <ul className="space-y-4">
                  {navItems.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => {
                        setActiveNav(label);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block text-white pb-1 ${
                        activeNav === label
                          ? 'border-b-2 border-white w-20'
                          : 'hover:opacity-80 transition-opacity'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}

                {/* Mobile Auth Buttons */}
                <li className="pt-4 flex space-x-4">
                  <Link href="/signup" className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Sign Up
                  </Link>
                  <Link href="/signin" className="px-4 py-1 border bg-[#eaab40] text-white rounded hover:bg-blue-50">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <main className="text-center py-16 lg:py-24">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Everything You Need
            <br />
            to Edit, Save, Buy and Sell
            <br />
            -In One Place
          </h1>

          <p className="text-sm lg:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Finkia helps you make flawless AI photo edits, build smart savings, buy and sell products with ease.
          </p>

          <Link
            href="/signup"
            className="inline-block bg-[#eaab40] text-white px-8 py-4 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
          >
            Get started
          </Link>
        </main>
      </div>
    </div>
  );
}
