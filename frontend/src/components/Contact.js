import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h2 className="section-title mt-2">Contact Us</h2>
          <p className="section-subtitle">Have a question or need a quote? We are here to help 24/7.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6">We Would Love to Hear From You</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Our logistics experts are available round the clock to help with your shipping needs, provide quotes, and answer any questions.
            </p>
            <div className="space-y-5">
              {[
                { icon: Mail, label: "Email Us", value: "Info@swiftoralogistics.online", href: "mailto:Info@swiftoralogistics.online" },
                { icon: Phone, label: "Call Us", value: "+1 (800) SWIFTORA", href: "tel:+18007943867" },
                { icon: MapPin, label: "Head Office", value: "123 Logistics Way, Suite 400, New York, NY 10001" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
                    {href ? <a href={href} className="text-gray-900 dark:text-white font-medium hover:text-primary-600 transition-colors">{value}</a> : <div className="text-gray-900 dark:text-white font-medium">{value}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                <p className="text-gray-600 dark:text-gray-400">We will get back to you within 24 hours at {form.email}.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-6 btn-outline">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold mb-2">Send a Message</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name" className="input-field" />
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address" className="input-field" />
                </div>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="input-field" />
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." className="input-field resize-none" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50">
                  <Send size={16} />
                  <span>{submitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
