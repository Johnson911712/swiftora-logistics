import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Package, Users, MessageSquare, Plus, LogOut, Search, CheckCircle, Trash2, RefreshCw, ChevronDown, Bell, Menu, X, Eye, EyeOff, Star } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("swiftora_token")}`, "Content-Type": "application/json" };
}

const STATUSES = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Returned", "On Hold"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("shipments");
  const [stats, setStats] = useState({});
  const [shipments, setShipments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [updateModal, setUpdateModal] = useState(null);
  const [updateData, setUpdateData] = useState({ status: "", location: "", notes: "" });
  const [newShipment, setNewShipment] = useState({
    sender_name: "", sender_email: "", sender_phone: "", sender_address: "",
    receiver_name: "", receiver_email: "", receiver_phone: "", receiver_address: "",
    package_description: "", package_weight: "", origin: "", destination: "", estimated_delivery: ""
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const adminName = localStorage.getItem("swiftora_admin") || "Admin";

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, sh, m, t] = await Promise.all([
        fetch(`${API}/api/shipments/stats`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${API}/api/shipments`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${API}/api/contact`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${API}/api/contact/testimonials`, { headers: authHeader() }).then(r => r.json()),
      ]);
      setStats(s); setShipments(Array.isArray(sh) ? sh : []); setMessages(Array.isArray(m) ? m : []); setTestimonials(Array.isArray(t) ? t : []);
    } catch (err) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("swiftora_token");
    if (!token) navigate("/admin");
    else fetchAll();
  }, [navigate, fetchAll]);

  const logout = () => { localStorage.removeItem("swiftora_token"); localStorage.removeItem("swiftora_admin"); navigate("/admin"); };

  const createShipment = async (e) => {
    e.preventDefault(); setFormError(""); setFormSuccess("");
    try {
      const res = await fetch(`${API}/api/shipments`, { method: "POST", headers: authHeader(), body: JSON.stringify(newShipment) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setFormSuccess(`Shipment created! Tracking Code: ${data.tracking_code}`);
      setNewShipment({ sender_name: "", sender_email: "", sender_phone: "", sender_address: "", receiver_name: "", receiver_email: "", receiver_phone: "", receiver_address: "", package_description: "", package_weight: "", origin: "", destination: "", estimated_delivery: "" });
      fetchAll();
    } catch (err) { setFormError(err.message); }
  };

  const updateStatus = async () => {
    if (!updateModal) return;
    try {
      await fetch(`${API}/api/shipments/${updateModal.id}/status`, { method: "PUT", headers: authHeader(), body: JSON.stringify(updateData) });
      setUpdateModal(null); setUpdateData({ status: "", location: "", notes: "" }); fetchAll();
    } catch (err) {}
  };

  const deleteShipment = async (id) => {
    if (!window.confirm("Delete this shipment?")) return;
    await fetch(`${API}/api/shipments/${id}`, { method: "DELETE", headers: authHeader() });
    fetchAll();
  };

  const markRead = async (id) => {
    await fetch(`${API}/api/contact/${id}/read`, { method: "PUT", headers: authHeader() });
    fetchAll();
  };

  const approveTestimonial = async (id) => {
    await fetch(`${API}/api/contact/testimonials/${id}/approve`, { method: "PUT", headers: authHeader() });
    fetchAll();
  };

  const deleteTestimonial = async (id) => {
    await fetch(`${API}/api/contact/testimonials/${id}`, { method: "DELETE", headers: authHeader() });
    fetchAll();
  };

  const filtered = shipments.filter(s => !search || s.tracking_code?.toLowerCase().includes(search.toLowerCase()) || s.receiver_name?.toLowerCase().includes(search.toLowerCase()) || s.sender_name?.toLowerCase().includes(search.toLowerCase()));

  const statusColor = { "Pending": "bg-yellow-100 text-yellow-700", "Picked Up": "bg-blue-100 text-blue-700", "In Transit": "bg-indigo-100 text-indigo-700", "Out for Delivery": "bg-orange-100 text-orange-700", "Delivered": "bg-green-100 text-green-700", "Returned": "bg-red-100 text-red-700", "On Hold": "bg-gray-100 text-gray-700" };

  const navItems = [
    { id: "shipments", label: "Shipments", icon: Package },
    { id: "create", label: "New Shipment", icon: Plus },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: stats.unreadMessages },
    { id: "testimonials", label: "Testimonials", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 bg-gray-950 text-white flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between h-16">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Truck size={16} className="text-white" />
              </div>
              <span className="font-bold text-sm">Swiftora Admin</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-800 rounded-lg transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-all hover:bg-gray-800 relative ${tab === id ? "bg-primary-900/50 text-primary-400 border-r-2 border-primary-500" : "text-gray-400 hover:text-white"}`}>
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="ml-3">{label}</span>}
              {badge > 0 && <span className="absolute right-3 top-2.5 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="w-full flex items-center px-2 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all">
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white capitalize">{tab === "create" ? "Create New Shipment" : tab}</h2>
          <div className="flex items-center space-x-3">
            <button onClick={fetchAll} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Refresh">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-sm">
              <div className="font-medium text-gray-900 dark:text-white">{adminName.split("@")[0]}</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {tab !== "create" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Shipments", value: stats.total || 0, icon: Package, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
                { label: "Pending", value: stats.pending || 0, icon: RefreshCw, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
                { label: "In Transit", value: stats.inTransit || 0, icon: Truck, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30" },
                { label: "Delivered", value: stats.delivered || 0, icon: CheckCircle, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "shipments" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by tracking code, sender, or receiver..."
                    className="input-field pl-9 py-2 text-sm" />
                </div>
                <button onClick={() => setTab("create")} className="btn-primary text-sm py-2 flex items-center space-x-1.5 whitespace-nowrap">
                  <Plus size={16} /><span>New Shipment</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>{["Tracking Code", "Sender", "Receiver", "Destination", "Status", "Created", "Actions"].map(h => <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-gray-400">No shipments found.</td></tr>
                    ) : filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-primary-600 dark:text-primary-400 text-xs">{s.tracking_code}</td>
                        <td className="px-4 py-3 font-medium">{s.sender_name}</td>
                        <td className="px-4 py-3">{s.receiver_name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[120px] truncate">{s.destination || s.receiver_address}</td>
                        <td className="px-4 py-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[s.status] || "bg-gray-100 text-gray-700"}`}>{s.status}</span></td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => { setUpdateModal(s); setUpdateData({ status: s.status, location: "", notes: "" }); }}
                              className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100 transition-colors" title="Update Status">
                              <RefreshCw size={14} />
                            </button>
                            <button onClick={() => deleteShipment(s.id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "create" && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Create New Shipment</h3>
                <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">Tracking code auto-generated</div>
              </div>
              {formSuccess && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-lg mb-1">
                    <CheckCircle size={20} />{formSuccess.split("Tracking Code:")[1]?.trim()}
                  </div>
                  <p className="text-green-600 dark:text-green-500 text-sm">Shipment created successfully. Share the tracking code with the customer.</p>
                </div>
              )}
              {formError && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-700 text-sm">{formError}</div>}
              <form onSubmit={createShipment} className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Users size={14} />Sender Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input required value={newShipment.sender_name} onChange={(e) => setNewShipment({ ...newShipment, sender_name: e.target.value })} placeholder="Sender Full Name*" className="input-field text-sm" />
                    <input type="email" value={newShipment.sender_email} onChange={(e) => setNewShipment({ ...newShipment, sender_email: e.target.value })} placeholder="Sender Email" className="input-field text-sm" />
                    <input value={newShipment.sender_phone} onChange={(e) => setNewShipment({ ...newShipment, sender_phone: e.target.value })} placeholder="Sender Phone" className="input-field text-sm" />
                    <input value={newShipment.sender_address} onChange={(e) => setNewShipment({ ...newShipment, sender_address: e.target.value })} placeholder="Sender Address" className="input-field text-sm" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Users size={14} />Receiver Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input required value={newShipment.receiver_name} onChange={(e) => setNewShipment({ ...newShipment, receiver_name: e.target.value })} placeholder="Receiver Full Name*" className="input-field text-sm" />
                    <input type="email" value={newShipment.receiver_email} onChange={(e) => setNewShipment({ ...newShipment, receiver_email: e.target.value })} placeholder="Receiver Email" className="input-field text-sm" />
                    <input value={newShipment.receiver_phone} onChange={(e) => setNewShipment({ ...newShipment, receiver_phone: e.target.value })} placeholder="Receiver Phone" className="input-field text-sm" />
                    <input required value={newShipment.receiver_address} onChange={(e) => setNewShipment({ ...newShipment, receiver_address: e.target.value })} placeholder="Receiver Address*" className="input-field text-sm" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Package size={14} />Shipment Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={newShipment.origin} onChange={(e) => setNewShipment({ ...newShipment, origin: e.target.value })} placeholder="Origin City/Country" className="input-field text-sm" />
                    <input value={newShipment.destination} onChange={(e) => setNewShipment({ ...newShipment, destination: e.target.value })} placeholder="Destination City/Country" className="input-field text-sm" />
                    <input value={newShipment.package_description} onChange={(e) => setNewShipment({ ...newShipment, package_description: e.target.value })} placeholder="Package Description" className="input-field text-sm" />
                    <input type="number" step="0.1" value={newShipment.package_weight} onChange={(e) => setNewShipment({ ...newShipment, package_weight: e.target.value })} placeholder="Weight (kg)" className="input-field text-sm" />
                    <input type="date" value={newShipment.estimated_delivery} onChange={(e) => setNewShipment({ ...newShipment, estimated_delivery: e.target.value })} className="input-field text-sm col-span-2" />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
                  <Plus size={18} /><span>Create Shipment &amp; Generate Tracking Code</span>
                </button>
              </form>
            </div>
          )}

          {tab === "messages" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold">Contact Messages ({messages.filter(m => !m.read).length} unread)</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {messages.length === 0 ? <div className="text-center py-12 text-gray-400">No messages yet.</div> :
                  messages.map((msg) => (
                    <div key={msg.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${!msg.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">{msg.name}</span>
                            {!msg.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
                          </div>
                          <div className="text-sm text-primary-600 dark:text-primary-400 mb-1">{msg.email}</div>
                          {msg.subject && <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{msg.subject}</div>}
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{msg.message}</p>
                          <div className="text-xs text-gray-400 mt-2">{new Date(msg.created_at).toLocaleString()}</div>
                        </div>
                        {!msg.read && (
                          <button onClick={() => markRead(msg.id)} className="flex-shrink-0 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors" title="Mark as read">
                            <Eye size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {tab === "testimonials" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold">Testimonials Management</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {testimonials.length === 0 ? <div className="text-center py-12 text-gray-400">No testimonials yet.</div> :
                  testimonials.map((t) => (
                    <div key={t.id} className="p-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{t.name}</span>
                          {t.company && <span className="text-xs text-gray-500"> {t.company}</span>}
                          {t.approved ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Published</span> : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>}
                        </div>
                        <div className="flex mb-1">{[...Array(5)].map((_, i) => <Star key={i} size={13} className={i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />)}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!t.approved && (
                          <button onClick={() => approveTestimonial(t.id)} className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => deleteTestimonial(t.id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {updateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-1">Update Shipment Status</h3>
            <p className="text-sm text-gray-500 mb-4 font-mono">{updateModal.tracking_code}</p>
            <div className="space-y-3">
              <select value={updateData.status} onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })} className="input-field">
                <option value="">Select Status</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input value={updateData.location} onChange={(e) => setUpdateData({ ...updateData, location: e.target.value })} placeholder="Current Location" className="input-field" />
              <textarea rows={3} value={updateData.notes} onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })} placeholder="Notes (optional)" className="input-field resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setUpdateModal(null)} className="flex-1 btn-outline py-2">Cancel</button>
              <button onClick={updateStatus} className="flex-1 btn-primary py-2">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
