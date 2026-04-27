import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/admin', label: '📊 Dashboard', exact: true },
    { to: '/admin/orders', label: '📦 Orders' },
    { to: '/admin/menu', label: '🍕 Menu Items' },
    { to: '/', label: '🌐 View Site' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-logo">🍕 Bella Cucina<br/><span style={{fontSize:'.7rem',opacity:.5,fontFamily:'Outfit,sans-serif',fontWeight:400}}>Admin Panel</span></div>
      <nav className="admin-nav">
        {links.map(link => (
          <Link key={link.to} to={link.to}
            className={location.pathname === link.to ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
        <button onClick={handleLogout} style={{display:'flex',alignItems:'center',gap:'.8rem',padding:'.8rem 1.5rem',color:'rgba(255,255,255,.4)',fontSize:'.9rem',fontWeight:500,background:'none',border:'none',cursor:'pointer',width:'100%',marginTop:'auto'}}>
          🚪 Logout
        </button>
      </nav>
    </div>
  );
}
