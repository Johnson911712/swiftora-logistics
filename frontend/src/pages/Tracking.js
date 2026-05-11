import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, ArrowRight } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const STATUS_STEPS = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];

function StatusBadge({ status }) {
  const map = {
    "Pending": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "Picked Up": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "In Transit": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    "Out for Delivery": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Delivered": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initialCode = searchParams.get("code");
    if (initialCode) doTrack(initialCode);
  }, []);

  const doTrack = async (trackCode) => {
    const c = trackCode || code;
    if (!c.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API}/api/tracking/${c.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tracking code not found");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doTrack();
  };

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Track Your Shipment</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter your tracking code to get real-time updates on your package.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter tracking code e.g. SWF-A1B2-XYZ123"
                className="input-field pl-11" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 whitespace-nowrap">
              <span>{loading ? "Searching..." : "Track Package"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {error && (
            <div className="card border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 flex items-center space-x-3 max-w-2xl mx-auto mb-6">
              <AlertCircle className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tracking Number</p>
                    <h2 className="text-2xl font-black text-primary-600 dark:text-primary-400 font-mono">{result.shipment.tracking_code}</h2>
                  </div>
                  <StatusBadge status={result.shipment.status} />
                </div>

                <div className="relative mb-8">
                  <div className="flex justify-between items-center mb-2">
                    {STATUS_STEPS.map((step, i) => {
                      const stepIdx = getStepIndex(result.shipment.status);
                      const done = i <= stepIdx;
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative border-2 transition-all ${done ? "bg-primary-600 border-primary-600 text-white" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"}`}>
                            {done ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                          </div>
                          <span className={`text-xs mt-1 text-center hidden sm:block ${done ? "text-primary-600 dark:text-primary-400 font-semibold" : "text-gray-400"}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0">
                    <div className="h-full bg-primary-600 transition-all" style={{ width: `${(getStepIndex(result.shipment.status) / (STATUS_STEPS.length - 1)) * 100}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "Sender", value: result.shipment.sender_name },
                    { label: "Receiver", value: result.shipment.receiver_name },
                    { label: "Origin", value: result.shipment.origin || "" },
                    { label: "Destination", value: result.shipment.destination || result.shipment.receiver_address },
                    { label: "Package", value: result.shipment.package_description || "" },
                    { label: "Est. Delivery", value: result.shipment.estimated_delivery || "" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {result.updates.length > 0 && (
                <div className="card">
                  <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                    <Truck size={20} className="text-primary-600" />
                    <span>Tracking History</span>
                  </h3>
                  <div className="space-y-4">
                    {result.updates.map((update, i) => (
                      <div key={update.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full mt-1 ${i === 0 ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"}`} />
                          {i < result.updates.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
                        </div>
                        <div className="pb-4 flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">{update.status}</div>
                          {update.location && <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={12} /> {update.location}</div>}
                          {update.notes && <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{update.notes}</div>}
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={11} /> {new Date(update.created_at).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
