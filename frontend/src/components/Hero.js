import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Package, Globe, Clock, Shield } from "lucide-react";

export default function Hero() {
  const [trackingCode, setTrackingCode] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingCode.trim()) navigate(`/tracking?code=${trackingCode.trim()}`);
  };

  const stats = [
    { icon: Package, label: "Packages Delivered", value: "2M+" },
    { icon: Globe, label: "Countries Served", value: "120+" },
    { icon: Clock, label: "On-Time Delivery", value: "99.2%" },
    { icon: Shield, label: "Years Experience", value: "15+" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[url(`data:image/svg+xml,%3Csvg width=`60` height=`60` viewBox=`0 0 60 60` xmlns=`http://www.w3.org/2000/svg`%3E%3Cg fill=`none` fill-rule=`evenodd`%3E%3Cg fill=`%23ffffff` fill-opacity=`0.03`%3E%3Cpath d=`M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z`/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary-800/50 border border-primary-700/50 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-primary-200 text-sm font-medium">Delivering Worldwide 24/7</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
            Swift. Secure.
            <span className="block bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">Unstoppable.</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Swiftora Logistics delivers your packages anywhere in the world with real-time tracking, unmatched speed, and ironclad reliability.
          </p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10 animate-slide-up">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Enter tracking code e.g. SWF-A1B2-XYZ123"
                className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all backdrop-blur-sm text-sm" />
            </div>
            <button type="submit" className="flex items-center justify-center space-x-2 bg-accent-500 hover:bg-accent-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-accent-500/30 whitespace-nowrap active:scale-95">
              <span>Track Package</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
            <Link to="/tracking" className="btn-outline text-white border-white/30 hover:bg-white hover:text-primary-900 text-sm py-2.5 px-5">Track Shipment</Link>
            <a href="#services" onClick={(e) => { e.preventDefault(); document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" }); }}
              className="flex items-center space-x-2 text-primary-200 hover:text-white transition-colors text-sm font-medium py-2.5 px-5">
              <span>Explore Services</span><ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all">
              <Icon size={24} className="text-accent-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-primary-300">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
