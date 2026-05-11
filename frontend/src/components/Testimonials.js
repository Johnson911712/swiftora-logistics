import React, { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({ name: "", company: "", rating: 5, message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/contact/testimonials`)
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => {});
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/contact/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSubmitted(true);
      setForm({ name: "", company: "", rating: 5, message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest">Client Stories</span>
          <h2 className="section-title mt-2">What Our Clients Say</h2>
          <p className="section-subtitle">Trusted by thousands of businesses and individuals worldwide.</p>
        </div>

        {testimonials.length > 0 && (
          <div className="relative max-w-3xl mx-auto mb-16">
            <div className="card text-center py-10 px-8 relative overflow-hidden">
              <Quote size={48} className="text-primary-100 dark:text-primary-900 absolute top-4 left-4" />
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < testimonials[current].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed mb-6">
                &ldquo;{testimonials[current].message}&rdquo;
              </p>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{testimonials[current].name}</div>
                {testimonials[current].company && (
                  <div className="text-sm text-primary-600 dark:text-primary-400">{testimonials[current].company}</div>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
              <button onClick={prev} className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-primary-600 w-6" : "bg-gray-300 dark:bg-gray-700"}`} />
                ))}
              </div>
              <button onClick={next} className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-xl mx-auto card">
          <h3 className="text-xl font-bold mb-6 text-center">Share Your Experience</h3>
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star size={24} className="text-green-600" />
              </div>
              <p className="font-semibold text-green-700 dark:text-green-400">Thank you for your review!</p>
              <p className="text-sm text-gray-500 mt-1">Your testimonial will be reviewed shortly.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-primary-600 hover:underline text-sm">Submit another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name" className="input-field" />
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}>
                      <Star size={24} className={r <= form.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Share your experience with Swiftora Logistics..." className="input-field resize-none" />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
