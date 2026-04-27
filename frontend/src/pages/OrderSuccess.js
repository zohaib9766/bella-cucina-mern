import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="page-wrap" style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'100vh', textAlign:'center', padding:'2rem'
    }}>
      <div>
        <div style={{fontSize:'5rem', marginBottom:'1.5rem'}}>🎉</div>
        <h1 style={{
          fontFamily:'Fraunces, serif', fontSize:'2.5rem',
          color:'var(--white)', marginBottom:'1rem'
        }}>Order Placed!</h1>
        <p style={{color:'var(--muted)', fontSize:'1.05rem', marginBottom:'2rem', lineHeight:'1.7'}}>
          Your food is being prepared 👨‍🍳<br/>
          Estimated delivery: <strong style={{color:'var(--gold)'}}>30–45 minutes</strong>
        </p>
        <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
          <Link to="/menu" className="btn btn-gold">🍕 Order More</Link>
          <Link to="/" className="btn btn-outline">Go Home</Link>
        </div>
      </div>
    </div>
  );
}