import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_STEPS = [
  { key: 'Pending',           icon: '📋', label: 'Order Placed' },
  { key: 'Confirmed',         icon: '✅', label: 'Confirmed' },
  { key: 'Preparing',         icon: '👨‍🍳', label: 'Preparing' },
  { key: 'Out for Delivery',  icon: '🛵', label: 'On the Way' },
  { key: 'Delivered',         icon: '🎉', label: 'Delivered' },
];

function TrackingBar({ status }) {
  const currentIndex = STATUS_STEPS.findIndex(s => s.key === status);
  return (
    <div className="tracking-steps">
      {STATUS_STEPS.map((step, i) => (
        <div key={step.key} className={`tracking-step ${i === currentIndex ? 'active' : ''} ${i < currentIndex ? 'done' : ''}`}>
          <div className="tracking-dot">{step.icon}</div>
          <div className="tracking-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = () => {
      axios.get('/api/orders/myorders')
        .then(res => { setOrders(res.data); if(res.data.length > 0 && !selected) setSelected(res.data[0]._id); })
        .catch(() => {})
        .finally(() => setLoading(false));
    };
    load();
    // Auto refresh every 30 seconds for live tracking
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  if (loading) return <div className="page-wrap"><div className="spinner" /></div>;

  const selectedOrder = orders.find(o => o._id === selected);

  return (
    <div className="page-wrap">
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'3rem 5%'}}>
        <h1 style={{fontFamily:'Fraunces, serif',fontSize:'2.5rem',marginBottom:'.5rem'}}>My Orders</h1>
        <p style={{color:'var(--muted)',marginBottom:'2rem'}}>Live tracking updates every 30 seconds 🔄</p>

        {orders.length === 0 ? (
          <div style={{textAlign:'center',padding:'4rem',color:'var(--muted)'}}>
            <div style={{fontSize:'4rem',marginBottom:'1rem'}}>📦</div>
            <p style={{marginBottom:'1.5rem'}}>No orders yet. Time to order some food!</p>
            <Link to="/menu" className="btn btn-gold">Order Now</Link>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',alignItems:'start'}}>
            {/* Order List */}
            <div style={{display:'flex',flexDirection:'column',gap:'.8rem'}}>
              {orders.map(order => (
                <div key={order._id}
                  onClick={() => setSelected(order._id)}
                  style={{
                    background: selected === order._id ? 'rgba(212,168,67,.1)' : 'var(--card)',
                    border: `1px solid ${selected === order._id ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius:'1rem', padding:'1.2rem', cursor:'pointer',
                    transition:'all .2s'
                  }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.5rem'}}>
                    <span style={{fontWeight:700,fontSize:'.9rem'}}>#{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`status-badge status-${order.status.replace(/ /g,'')}`}>{order.status}</span>
                  </div>
                  <div style={{fontSize:'.82rem',color:'var(--muted)'}}>
                    {new Date(order.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
                  </div>
                  <div style={{fontWeight:700,color:'var(--gold)',marginTop:'.4rem'}}>${order.totalAmount.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Order Detail + Tracking */}
            {selectedOrder && (
              <div style={{background:'var(--card)',borderRadius:'1.5rem',padding:'1.5rem',border:'1px solid var(--border)',position:'sticky',top:'100px'}}>
                <h3 style={{fontFamily:'Fraunces, serif',fontSize:'1.3rem',marginBottom:'1.5rem'}}>
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>

                {/* Live Tracking Bar */}
                {selectedOrder.status !== 'Cancelled' && (
                  <div style={{marginBottom:'1.5rem'}}>
                    <p style={{fontSize:'.8rem',color:'var(--muted)',marginBottom:'1rem',textTransform:'uppercase',letterSpacing:'.08em',fontWeight:700}}>Live Tracking</p>
                    <TrackingBar status={selectedOrder.status} />
                  </div>
                )}

                {/* Items */}
                <div style={{borderTop:'1px solid var(--border)',paddingTop:'1rem',marginBottom:'1rem'}}>
                  <p style={{fontSize:'.8rem',color:'var(--muted)',marginBottom:'.8rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em'}}>Items Ordered</p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:'.88rem',marginBottom:'.5rem'}}>
                      <span style={{color:'var(--white)'}}>{item.emoji} {item.name} ×{item.quantity}</span>
                      <span style={{color:'var(--gold)',fontWeight:700}}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div style={{borderTop:'1px solid var(--border)',paddingTop:'1rem',marginBottom:'1rem'}}>
                  <p style={{fontSize:'.8rem',color:'var(--muted)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'.5rem'}}>Delivery Address</p>
                  <p style={{fontSize:'.88rem',color:'var(--white)'}}>
                    📍 {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city} {selectedOrder.deliveryAddress.zip}
                  </p>
                </div>

                {/* Total */}
                <div style={{borderTop:'1px solid var(--border)',paddingTop:'1rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:700}}>Total Paid</span>
                  <span style={{fontWeight:700,color:'var(--gold)',fontSize:'1.2rem'}}>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>

                {/* ETA */}
                {!['Delivered','Cancelled'].includes(selectedOrder.status) && (
                  <div style={{marginTop:'1rem',background:'rgba(212,168,67,.1)',borderRadius:'.8rem',padding:'.8rem 1rem',textAlign:'center'}}>
                    <span style={{fontSize:'.85rem',color:'var(--gold)',fontWeight:600}}>
                      ⏱️ Estimated arrival: 25–35 minutes
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
