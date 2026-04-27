import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">🍕 Bella Cucina</Link>

      <ul className="nav-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>Menu</Link></li>
        {user && <li><Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>Track Order</Link></li>}
        {user?.role === 'admin' && <li><Link to="/admin" style={{color:'var(--gold)'}}>⚙️ Admin</Link></li>}
        {user ? (
          <li>
            <button onClick={logout} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:'.88rem',fontWeight:'500'}}>
              👤 {user.name.split(' ')[0]} · Logout
            </button>
          </li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>

      <Link to="/cart" className="nav-cart">
        🛒 Cart
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </Link>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>

      {menuOpen && (
        <div style={{
          position:'fixed',top:'65px',left:0,right:0,bottom:0,
          background:'var(--bg)',zIndex:999,padding:'2rem',
          display:'flex',flexDirection:'column',gap:'1.5rem',
          borderTop:'1px solid var(--border)'
        }}>
          <Link to="/" style={{fontSize:'1.3rem',fontFamily:'Fraunces, serif',color:'var(--white)'}}>Home</Link>
          <Link to="/menu" style={{fontSize:'1.3rem',fontFamily:'Fraunces, serif',color:'var(--white)'}}>Menu</Link>
          <Link to="/cart" style={{fontSize:'1.3rem',fontFamily:'Fraunces, serif',color:'var(--white)'}}>Cart ({totalItems})</Link>
          {user && <Link to="/orders" style={{fontSize:'1.3rem',fontFamily:'Fraunces, serif',color:'var(--white)'}}>Track Order</Link>}
          {user ? (
            <button onClick={logout} style={{fontSize:'1rem',color:'var(--muted)',background:'none',border:'none',textAlign:'left',cursor:'pointer'}}>Logout</button>
          ) : (
            <Link to="/login" style={{fontSize:'1.3rem',fontFamily:'Fraunces, serif',color:'var(--gold)'}}>Login / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}
