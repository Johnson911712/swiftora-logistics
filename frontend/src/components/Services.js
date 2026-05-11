import React from "react";
import { Truck, Globe, Boxes, Thermometer, LayoutGrid, Zap } from "lucide-react";

const services = [
  { icon: Zap, title: "Express Delivery", desc: "Same-day and next-day delivery for urgent shipments. Our fleet ensures your package arrives on time, every time.", color: "from-yellow-500 to-orange-500" },
  { icon: Globe, title: "International Shipping", desc: "Seamless cross-border logistics to over 120 countries. Customs clearance and documentation handled for you.", color: "from-blue-500 to-cyan-500" },
  { icon: Truck, title: "Freight Forwarding", desc: "Comprehensive air, sea, and road freight services for bulky cargo and commercial shipments.", color: "from-green-500 to-emerald-500" },
  { icon: Boxes, title: "Warehousing", desc: "Secure, climate-controlled warehousing facilities with real-time inventory management systems.", color: "from-purple-500 to-violet-500" },
  { icon: Thermometer, title: "Cold Chain Logistics", desc: "Temperature-controlled transport for pharmaceuticals, perishables, and sensitive cargo.", color: "from-teal-500 to-blue-500" },
  { icon: LayoutGrid, title: "Last-Mile Delivery", desc: "Efficient last-mile solutions ensuring your package reaches the final destination safely.", color: "from-rose-500 to-pink-500" },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
          <h2 className="section-title mt-2">World-Class Logistics Services</h2>
          <p className="section-subtitle">From express parcels to bulk freight, we handle every shipment with precision and care.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card group hover:-translate-y-1 cursor-default">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
