import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Eye, EyeOff, Lock, Mail } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("swiftora_token", data.token);
      localStorage.setItem("swiftora_admin", data.username);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-2xl mb-4">
            <Truck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Swiftora Logistics</h1>
          <p className="text-primary-300 mt-1">Admin Portal</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sign In to Dashboard</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username / Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Admin@swiftoralogistics.online" className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-400">Secure admin access only</p>
        </div>
        <p className="text-center text-primary-400 text-sm mt-4">
          <a href="/" className="hover:text-white transition-colors">Back to Website</a>
        </p>
      </div>
    </div>
  );
}
