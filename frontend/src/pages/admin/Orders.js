import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';

const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/orders').then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status } : o));
      toast.success('Order status updated!');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem',marginBottom:'2rem'}}>
          Orders <span style={{fontSize:'1rem',color:'var(--gray)',fontFamily:'Outfit,sans-serif'}}>({orders.length} total)</span>
        </h1>

        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td style={{fontWeight:600}}>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div style={{fontWeight:500}}>{order.user?.name}</div>
                      <div style={{fontSize:'.78rem',color:'var(--gray)'}}>{order.user?.email}</div>
                    </td>
                    <td style={{fontSize:'.85rem',maxWidth:'180px'}}>
                      {order.items.map(i => `${i.emoji}×${i.quantity}`).join(' ')}
                    </td>
                    <td style={{fontSize:'.82rem',color:'var(--gray)'}}>
                      {order.deliveryAddress.street},<br/>{order.deliveryAddress.city}
                    </td>
                    <td style={{fontWeight:700,color:'var(--red)'}}>${order.totalAmount.toFixed(2)}</td>
                    <td><span className={`status-badge status-${order.status.replace(' ','')}`}>{order.status}</span></td>
                    <td>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        style={{padding:'.4rem .6rem',border:'1px solid var(--border)',borderRadius:'.5rem',fontSize:'.82rem',fontFamily:'Outfit,sans-serif',cursor:'pointer'}}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
