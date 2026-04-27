import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🍕`);
      navigate(user.role === 'admin' ? '/admin' : '/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:'2rem'}}>
      <div style={{background:'var(--card)',borderRadius:'2rem',padding:'2.5rem',width:'100%',maxWidth:'440px',border:'1px solid var(--border)',boxShadow:'var(--shadow-lg)'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{fontSize:'3rem',marginBottom:'.5rem'}}>🍕</div>
          <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem'}}>Welcome Back</h1>
          <p style={{color:'var(--muted)',fontSize:'.9rem',marginTop:'.4rem'}}>Sign in to your Bella Cucina account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} placeholder="Your password" required />
          </div>
          <button type="submit" className="btn btn-red" disabled={loading}
            style={{width:'100%',justifyContent:'center',marginTop:'1rem'}}>
            {loading ? '⏳ Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'.9rem',color:'var(--muted)'}}>
          Don't have an account? <Link to="/register" style={{color:'var(--red)',fontWeight:'500'}}>Register</Link>
        </p>
        
      </div>
    </div>
  );
}
