import React, { useState } from 'react';
import './AdminDashboard.css';

const stats = [
  { icon: '📦', label: 'Total Orders', value: '1,284', change: '+12% today' },
  { icon: '💰', label: 'Revenue Today', value: 'Rs. 48,500', change: '+8% vs yesterday' },
  { icon: '👥', label: 'Total Customers', value: '3,492', change: '+5 new today' },
  { icon: '🍕', label: 'Menu Items', value: '24', change: '3 out of stock' },
];

const recentOrders = [
  { id: 'PV10234', customer: 'Ahmed Raza',  items: 'BBQ Chicken x2',        total: 2200, status: 'delivered',  time: '2 min ago' },
  { id: 'PV10233', customer: 'Sara Khan',   items: 'Family Feast Deal',      total: 2999, status: 'on_the_way', time: '8 min ago' },
  { id: 'PV10232', customer: 'Usman Ali',   items: 'Pepperoni Feast x1',     total: 1250, status: 'preparing',  time: '15 min ago' },
  { id: 'PV10231', customer: 'Fatima Noor', items: 'Veggie Supreme x2',      total: 1900, status: 'placed',     time: '22 min ago' },
  { id: 'PV10230', customer: 'Ali Hassan',  items: 'Spicy Tikka + Solo Deal', total: 2049, status: 'delivered', time: '35 min ago' },
];

const stockItems = [
  { name: 'Mozzarella Cheese', qty: 45, unit: 'kg',  alert: 10, status: 'ok' },
  { name: 'Pizza Dough',       qty: 8,  unit: 'kg',  alert: 10, status: 'low' },
  { name: 'Tomato Sauce',      qty: 32, unit: 'ltr', alert: 5,  status: 'ok' },
  { name: 'Pepperoni',         qty: 3,  unit: 'kg',  alert: 5,  status: 'critical' },
  { name: 'Bell Peppers',      qty: 15, unit: 'kg',  alert: 5,  status: 'ok' },
  { name: 'Chicken',           qty: 7,  unit: 'kg',  alert: 8,  status: 'low' },
];

const STATUS_COLORS = {
  placed     : '#3b82f6',
  preparing  : '#f59e0b',
  on_the_way : '#8b5cf6',
  delivered  : '#10b981',
  cancelled  : '#ef4444',
};

const STATUS_LABELS = {
  placed     : '🔵 Placed',
  preparing  : '🟡 Preparing',
  on_the_way : '🟣 On the Way',
  delivered  : '🟢 Delivered',
  cancelled  : '🔴 Cancelled',
};

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState(recentOrders);

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'orders',    icon: '📦', label: 'Orders' },
    { id: 'menu',      icon: '🍕', label: 'Menu Management' },
    { id: 'stock',     icon: '📋', label: 'Stock' },
    { id: 'customers', icon: '👥', label: 'Customers' },
    { id: 'reports',   icon: '📈', label: 'Reports' },
    { id: 'settings',  icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="ad-layout">

      {/* SIDEBAR */}
      <aside className={`ad-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="ad-sidebar-header">
          <div className="ad-logo">🍕 {sidebarOpen && 'Pizza Valley'}</div>
          <button className="ad-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="ad-admin-badge">
          <div className="ad-avatar">A</div>
          {sidebarOpen && (
            <div>
              <strong>Super Admin</strong>
              <span>admin@pizzavalley.pk</span>
            </div>
          )}
        </div>

        <nav className="ad-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`ad-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="ad-logout" onClick={onLogout}>
          🚪 {sidebarOpen && 'Logout'}
        </button>
      </aside>

      {/* MAIN */}
      <main className="ad-main">

        {/* TOPBAR */}
        <div className="ad-topbar">
          <div>
            <h1>{navItems.find(n => n.id === activeTab)?.label}</h1>
            <span>Pizza Valley Admin Panel</span>
          </div>
          <div className="ad-topbar-right">
            <div className="ad-search">
              <input placeholder="Search orders, customers..." />
            </div>
            <button className="ad-notif">🔔 <span>3</span></button>
          </div>
        </div>

        <div className="ad-content">

          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'dashboard' && (
            <div>
              {/* STATS */}
              <div className="ad-stats-grid">
                {stats.map((s, i) => (
                  <div className="ad-stat-card" key={i}>
                    <div className="ad-stat-icon">{s.icon}</div>
                    <div>
                      <div className="ad-stat-value">{s.value}</div>
                      <div className="ad-stat-label">{s.label}</div>
                      <div className="ad-stat-change">{s.change}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RECENT ORDERS */}
              <div className="ad-section">
                <div className="ad-section-header">
                  <h2>Recent Orders</h2>
                  <button className="ad-view-all" onClick={() => setActiveTab('orders')}>
                    View All →
                  </button>
                </div>
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id}>
                          <td><strong>{o.id}</strong></td>
                          <td>{o.customer}</td>
                          <td>{o.items}</td>
                          <td>Rs. {o.total.toLocaleString()}</td>
                          <td>
                            <span className="ad-status" style={{ background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status] }}>
                              {STATUS_LABELS[o.status]}
                            </span>
                          </td>
                          <td>{o.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* STOCK ALERTS */}
              <div className="ad-section">
                <div className="ad-section-header">
                  <h2>⚠️ Stock Alerts</h2>
                  <button className="ad-view-all" onClick={() => setActiveTab('stock')}>Manage Stock →</button>
                </div>
                <div className="ad-stock-alerts">
                  {stockItems.filter(s => s.status !== 'ok').map((s, i) => (
                    <div className={`ad-alert-card ${s.status}`} key={i}>
                      <div className="ad-alert-icon">{s.status === 'critical' ? '🔴' : '🟡'}</div>
                      <div>
                        <strong>{s.name}</strong>
                        <span>{s.qty} {s.unit} remaining</span>
                      </div>
                      <span className={`ad-alert-badge ${s.status}`}>
                        {s.status === 'critical' ? 'CRITICAL' : 'LOW'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === 'orders' && (
            <div className="ad-section">
              <div className="ad-filter-row">
                {['All', 'Placed', 'Preparing', 'On the Way', 'Delivered'].map(f => (
                  <button key={f} className="ad-filter-btn">{f}</button>
                ))}
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>{o.customer}</td>
                        <td>{o.items}</td>
                        <td>Rs. {o.total.toLocaleString()}</td>
                        <td>
                          <span className="ad-status" style={{ background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status] }}>
                            {STATUS_LABELS[o.status]}
                          </span>
                        </td>
                        <td>
                          <select
                            className="ad-status-select"
                            value={o.status}
                            onChange={e => updateStatus(o.id, e.target.value)}
                          >
                            <option value="placed">Placed</option>
                            <option value="preparing">Preparing</option>
                            <option value="on_the_way">On the Way</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── STOCK TAB ── */}
          {activeTab === 'stock' && (
            <div className="ad-section">
              <div className="ad-section-header">
                <h2>Stock Management</h2>
                <button className="ad-btn-primary">+ Add Stock Item</button>
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Alert Level</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockItems.map((s, i) => (
                      <tr key={i}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.qty}</td>
                        <td>{s.unit}</td>
                        <td>{s.alert} {s.unit}</td>
                        <td>
                          <span className={`ad-stock-status ${s.status}`}>
                            {s.status === 'ok' ? '✅ OK' : s.status === 'low' ? '⚠️ Low' : '🔴 Critical'}
                          </span>
                        </td>
                        <td>
                          <button className="ad-btn-sm">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── OTHER TABS ── */}
          {['menu', 'customers', 'reports', 'settings'].includes(activeTab) && (
            <div className="ad-coming-soon">
              <div style={{ fontSize: 60 }}>
                {activeTab === 'menu' ? '🍕' : activeTab === 'customers' ? '👥' : activeTab === 'reports' ? '📈' : '⚙️'}
              </div>
              <h2>{navItems.find(n => n.id === activeTab)?.label}</h2>
              <p>This section is being built in the next phase.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}