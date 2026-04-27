import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page-wrap" style={{textAlign:'center',padding:'8rem 5%'}}>
        <div style={{fontSize:'5rem',marginBottom:'1.5rem'}}>🛒</div>
        <h2 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem',marginBottom:'1rem'}}>Your cart is empty</h2>
        <p style={{color:'var(--muted)',marginBottom:'2rem'}}>Add some delicious items from our menu!</p>
        <Link to="/menu" className="btn btn-red">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'3rem 5%'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem'}}>
          <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem'}}>Your Cart</h1>
          <button onClick={clearCart} style={{background:'none',border:'none',color:'var(--muted)',fontSize:'.9rem',cursor:'pointer'}}>Clear all</button>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 350px',gap:'2rem',alignItems:'start'}}>
          <div>
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <span className="cart-item-emoji">{item.emoji}</span>
                <div style={{flex:1}}>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item._id)}
                  style={{background:'none',border:'none',color:'var(--muted)',fontSize:'1.1rem',cursor:'pointer',marginLeft:'.5rem'}}>✕</button>
              </div>
            ))}
          </div>

          <div style={{background:'var(--card)',borderRadius:'1.5rem',padding:'1.8rem',border:'1px solid var(--border)',position:'sticky',top:'100px'}}>
            <h3 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.4rem',marginBottom:'1.5rem'}}>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item._id} style={{display:'flex',justifyContent:'space-between',fontSize:'.88rem',color:'var(--muted)',marginBottom:'.6rem'}}>
                <span>{item.name} ×{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{borderTop:'1px solid var(--border)',marginTop:'1rem',paddingTop:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'.88rem',color:'var(--muted)',marginBottom:'.4rem'}}>
                <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'.88rem',color:'var(--muted)',marginBottom:'.4rem'}}>
                <span>Delivery</span><span style={{color:'green'}}>Free</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:'700',fontSize:'1.1rem',marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid var(--border)'}}>
                <span>Total</span><span style={{color:'var(--red)'}}>$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn btn-red" style={{width:'100%',justifyContent:'center',marginTop:'1.5rem',display:'flex'}}>
              Proceed to Checkout →
            </Link>
            <Link to="/menu" className="btn btn-outline" style={{width:'100%',justifyContent:'center',marginTop:'.8rem',display:'flex'}}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
