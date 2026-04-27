import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem',marginBottom:'2rem'}}>Dashboard</h1>

        {loading ? <div className="spinner" /> : stats && (
          <>
            <div className="stat-cards">
              {[
                { icon:'💰', num:`$${stats.totalRevenue.toFixed(0)}`, label:'Total Revenue' },
                { icon:'📦', num:stats.totalOrders, label:'Total Orders' },
                { icon:'👥', num:stats.totalUsers, label:'Customers' },
                { icon:'🍕', num:stats.totalMenuItems, label:'Menu Items' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-card-icon">{s.icon}</div>
                  <div className="stat-card-num">{s.num}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              ))}
            </div>

            <h2 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.5rem',marginBottom:'1.2rem'}}>Recent Orders</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td style={{fontWeight:600}}>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.user?.name || 'Guest'}</td>
                      <td style={{color:'var(--gray)',fontSize:'.85rem'}}>
                        {order.items.map(i => `${i.emoji} ${i.name}`).join(', ').slice(0,40)}...
                      </td>
                      <td style={{fontWeight:600,color:'var(--red)'}}>${order.totalAmount.toFixed(2)}</td>
                      <td><span className={`status-badge status-${order.status.replace(' ','')}`}>{order.status}</span></td>
                      <td style={{color:'var(--gray)',fontSize:'.85rem'}}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
