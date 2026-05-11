import React from "react";
import { Link } from "react-router-dom";
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <Truck size={20} className="text-white" />
              </div>
              <span className="font-black text-xl text-white">Swiftora<span className="text-primary-400"> Logistics</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">Your trusted courier and logistics partner. Delivering excellence across the globe with speed, security, and reliability.</p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[["Home", "/"], ["Track Package", "/tracking"], ["Admin Portal", "/admin"]].map(([label, href]) => (
                <li key={label}><Link to={href} className="hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Express Delivery", "International Shipping", "Freight Forwarding", "Warehousing", "Cold Chain Logistics", "Last-Mile Delivery"].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Mail size={15} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:Info@swiftoralogistics.online" className="hover:text-primary-400 transition-colors">Info@swiftoralogistics.online</a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={15} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>+1 (800) SWIFTORA</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={15} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>123 Logistics Way, Suite 400, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Swiftora Logistics. All rights reserved.</p>
          <p>Powered by <span className="text-primary-400">swiftoralogistics.online</span></p>
        </div>
      </div>
    </footer>
  );
}
