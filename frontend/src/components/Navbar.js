import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Package, Menu, X, Truck } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "#services" },
    { label: "Track Package", href: "/tracking" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-primary-500/40 transition-shadow">
              <Truck size={20} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white">
              Swiftora<span className="text-primary-600"> Logistics</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <button key={link.label} onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium transition-all text-sm">
                  {link.label}
                </button>
              ) : (
                <Link key={link.label} to={link.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${location.pathname === link.href ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400" : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"}`}>
                  {link.label}
                </Link>
              )
            )}
            <ThemeToggle />
            <Link to="/tracking" className="ml-2 btn-primary text-sm py-2 px-4 inline-flex items-center space-x-2">
              <Package size={16} />
              <span>Track Now</span>
            </Link>
          </div>

          <div className="flex lg:hidden items-center space-x-2">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-xl animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <button key={link.label} onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 font-medium transition-all">
                  {link.label}
                </button>
              ) : (
                <Link key={link.label} to={link.href} onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 font-medium transition-all">
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
