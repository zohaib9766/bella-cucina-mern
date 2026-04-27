import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const checkPassword = (pw) => ({
  length:  pw.length >= 8,
  upper:   /[A-Z]/.test(pw),
  lower:   /[a-z]/.test(pw),
  number:  /[0-9]/.test(pw),
  symbol:  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
});

const getStrength = (checks) => {
  const passed = Object.values(checks).filter(Boolean).length;
  if (passed <= 2) return { label: 'Weak',   color: '#e63946', width: '20%' };
  if (passed === 3) return { label: 'Fair',   color: '#f4a261', width: '50%' };
  if (passed === 4) return { label: 'Good',   color: '#d4a843', width: '75%' };
  return              { label: 'Strong', color: '#2dc653', width: '100%' };
};

const generatePassword = () => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const nums  = '23456789';
  const syms  = '!@#$%&*';
  const rand  = (str) => str[Math.floor(Math.random() * str.length)];
  const base  = rand(upper)+rand(upper)+rand(lower)+rand(lower)+rand(lower)+rand(nums)+rand(nums)+rand(syms);
  return base.split('').sort(() => Math.random() - 0.5).join('');
};

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [suggestedPw, setSuggestedPw] = useState(generatePassword);
  const pwWrapRef = useRef(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const checks = checkPassword(form.password);
  const strength = getStrength(checks);
  const allPassed = Object.values(checks).every(Boolean);

  useEffect(() => {
    const handler = (e) => {
      if (pwWrapRef.current && !pwWrapRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allPassed) return toast.error('Password does not meet all requirements!');
    if (form.password !== form.confirm) return toast.error('Passwords do not match!');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success('Welcome to Bella Cucina! 🍕');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const useSuggested = (pw) => {
    setForm({ ...form, password: pw, confirm: pw });
    setShowPopup(false);
  };

  const refreshPassword = () => {
    setSuggestedPw(generatePassword());
  };

  return (
    <div className="page-wrap" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:'2rem'}}>
      <div style={{background:'var(--card)',borderRadius:'2rem',padding:'2.5rem',width:'100%',maxWidth:'460px',border:'1px solid var(--border)',boxShadow:'var(--shadow)'}}>

        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{fontSize:'3rem',marginBottom:'.5rem'}}>🍕</div>
          <h1 style={{fontFamily:'Fraunces, serif',fontSize:'2rem',color:'var(--white)'}}>Create Account</h1>
          <p style={{color:'var(--muted)',fontSize:'.9rem',marginTop:'.4rem'}}>Join Bella Cucina and start ordering!</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Zohaib Khan" required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="you@example.com" required />
          </div>

          <div className="form-group" ref={pwWrapRef} style={{position:'relative'}}>
            <label className="form-label">Password</label>
            <div style={{position:'relative'}}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onFocus={() => { if (!form.password) { setSuggestedPw(generatePassword()); setShowPopup(true); } }}
                onChange={e => { setForm({...form, password: e.target.value}); setShowPopup(false); }}
                placeholder="Click to see options"
                required
                style={{paddingRight:'3rem'}}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{position:'absolute',right:'1rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'1rem'}}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>

            {showPopup && (
              <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:100,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'1.2rem',marginTop:'.4rem',boxShadow:'var(--shadow)'}}>

                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.8rem'}}>
                  <p style={{fontSize:'.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',color:'var(--gold)'}}>
                     Suggested Password
                  </p>
                  <button type="button" onClick={refreshPassword}
                    style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'.8rem',display:'flex',alignItems:'center',gap:'.3rem'}}>
                    🔄 New
                  </button>
                </div>

                <div onClick={() => useSuggested(suggestedPw)}
                  style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.7rem 1rem',borderRadius:'.7rem',marginBottom:'.8rem',background:'var(--bg3)',border:'1px solid var(--border)',cursor:'pointer',transition:'all .2s'}}
                  onMouseOver={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.background='rgba(212,168,67,.08)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg3)'; }}>
                  <span style={{fontFamily:'monospace',fontSize:'.95rem',color:'var(--white)',letterSpacing:'.04em'}}>{suggestedPw}</span>
                  <span style={{fontSize:'.75rem',background:'rgba(45,198,83,.15)',color:'#2dc653',padding:'.2rem .6rem',borderRadius:'2rem',fontWeight:700,flexShrink:0,marginLeft:'.5rem'}}>Strong ✅</span>
                </div>

                <div style={{display:'flex',alignItems:'center',gap:'.8rem',margin:'.8rem 0'}}>
                  <div style={{flex:1,height:'1px',background:'var(--border)'}}/>
                  <span style={{fontSize:'.75rem',color:'var(--muted)'}}>OR</span>
                  <div style={{flex:1,height:'1px',background:'var(--border)'}}/>
                </div>

                <div onClick={() => setShowPopup(false)}
                  style={{display:'flex',alignItems:'center',gap:'.8rem',padding:'.7rem 1rem',borderRadius:'.7rem',background:'var(--bg3)',border:'1px solid var(--border)',cursor:'pointer',transition:'all .2s'}}
                  onMouseOver={e => e.currentTarget.style.borderColor='var(--gold)'}
                  onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}>
                  <span style={{fontSize:'1.2rem'}}>✏️</span>
                  <div>
                    <div style={{fontSize:'.88rem',fontWeight:600,color:'var(--white)'}}>Choose my own password</div>
                    <div style={{fontSize:'.75rem',color:'var(--muted)'}}>Must meet all requirements below</div>
                  </div>
                </div>
              </div>
            )}

            {form.password.length > 0 && (
              <div style={{marginTop:'.8rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.4rem'}}>
                  <span style={{fontSize:'.78rem',color:'var(--muted)'}}>Password Strength</span>
                  <span style={{fontSize:'.78rem',fontWeight:700,color:strength.color}}>{strength.label}</span>
                </div>
                <div style={{background:'var(--border)',borderRadius:'2rem',height:'6px',overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:'2rem',width:strength.width,background:strength.color,transition:'all .4s ease'}}/>
                </div>
                <div style={{marginTop:'.8rem',padding:'.8rem 1rem',background:'var(--bg3)',borderRadius:'.8rem',border:'1px solid var(--border)'}}>
                  {[
                    [checks.length,  '8+ characters'],
                    [checks.upper,   'One uppercase (A-Z)'],
                    [checks.lower,   'One lowercase (a-z)'],
                    [checks.number,  'One number (0-9)'],
                    [checks.symbol,  'One symbol (!@#$%)'],
                  ].map(([p, l]) => (
                    <div key={l} style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.3rem'}}>
                      <span style={{fontSize:'.8rem'}}>{p ? '✅' : '❌'}</span>
                      <span style={{fontSize:'.82rem',color: p ? '#2dc653' : 'var(--muted)'}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{position:'relative'}}>
              <input
                className="form-input"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={e => setForm({...form, confirm: e.target.value})}
                placeholder="Repeat your password"
                required
                style={{paddingRight:'3rem',borderColor: form.confirm.length > 0 ? (form.confirm === form.password ? '#2dc653' : '#e63946') : 'var(--border)'}}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{position:'absolute',right:'1rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'1rem'}}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {form.confirm.length > 0 && (
              <p style={{fontSize:'.8rem',marginTop:'.4rem',color: form.confirm === form.password ? '#2dc653' : '#e63946'}}>
                {form.confirm === form.password ? '✅ Passwords match!' : '❌ Passwords do not match!'}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-gold" disabled={loading}
            style={{width:'100%',justifyContent:'center',marginTop:'1rem',opacity: loading ? '.7' : '1'}}>
            {loading ? '⏳ Creating...' : 'Create Account 🍕'}
          </button>
        </form>

        <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'.9rem',color:'var(--muted)'}}>
          Already have an account?{' '}
          <Link to="/login" style={{color:'var(--gold)',fontWeight:600}}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}