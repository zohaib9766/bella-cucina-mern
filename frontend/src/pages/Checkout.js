import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ street: '', city: '', zip: '', cardNumber: '4242 4242 4242 4242', expiry: '12/28', cvv: '123' });

  

  if (cartItems.length === 0) {
    navigate('/menu'); return null;
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.zip) return toast.error('Please fill in delivery address');
    setLoading(true);
    try {
      const orderItems = cartItems.map(i => ({
        menuItem: i._id, name: i.name, price: i.price, quantity: i.quantity, emoji: i.emoji
      }));
      const { data: order } = await axios.post('/api/orders', {
        items: orderItems,
        totalAmount: totalPrice,
        deliveryAddress: { street: form.street, city: form.city, zip: form.zip }
      });
      // Simulate payment confirmation
      await axios.post(`/api/payment/confirm/${order._id}`, { paymentIntentId: 'pi_simulated_' + Date.now() });
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/order-success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'3rem 5%'}}>
        <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem',marginBottom:'2rem'}}>Checkout</h1>

        <form onSubmit={handleSubmit} style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:'2rem',alignItems:'start'}}>
          <div>
            <div style={{background:'var(--card)',borderRadius:'1.5rem',padding:'1.8rem',border:'1px solid var(--border)',marginBottom:'1.5rem'}}>
              <h3 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',marginBottom:'1.5rem'}}>📍 Delivery Address</h3>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-input" name="street" value={form.street} onChange={handleChange} placeholder="123 Main Street" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" name="city" value={form.city} onChange={handleChange} placeholder="New York" required />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input className="form-input" name="zip" value={form.zip} onChange={handleChange} placeholder="10001" required />
                </div>
              </div>
            </div>

            <div style={{background:'var(--card)',borderRadius:'1.5rem',padding:'1.8rem',border:'1px solid var(--border)'}}>
              <h3 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',marginBottom:'.5rem'}}>💳 Payment Details</h3>
              <p style={{fontSize:'.8rem',color:'var(--muted)',marginBottom:'1.5rem'}}>Test mode: use card 4242 4242 4242 4242</p>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className="form-input" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="4242 4242 4242 4242" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry</label>
                  <input className="form-input" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className="form-input" name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" />
                </div>
              </div>
            </div>
          </div>

          <div style={{background:'var(--card)',borderRadius:'1.5rem',padding:'1.8rem',border:'1px solid var(--border)',position:'sticky',top:'100px'}}>
            <h3 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',marginBottom:'1.5rem'}}>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item._id} style={{display:'flex',justifyContent:'space-between',fontSize:'.88rem',color:'var(--muted)',marginBottom:'.6rem'}}>
                <span>{item.emoji} {item.name} ×{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{borderTop:'1px solid var(--border)',marginTop:'1rem',paddingTop:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'.9rem',color:'var(--muted)',marginBottom:'.4rem'}}>
                <span>Delivery</span><span style={{color:'green'}}>Free</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:'700',fontSize:'1.2rem',marginTop:'.8rem',paddingTop:'.8rem',borderTop:'1px solid var(--border)'}}>
                <span>Total</span><span style={{color:'var(--red)'}}>$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" className="btn btn-red" disabled={loading}
              style={{width:'100%',justifyContent:'center',marginTop:'1.5rem',display:'flex',opacity:loading?.7:1}}>
              {loading ? '⏳ Placing Order...' : '🍕 Place Order'}
            </button>
            <p style={{fontSize:'.75rem',color:'var(--muted)',textAlign:'center',marginTop:'1rem'}}>
              🔒 Secured with 256-bit SSL encryption
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
