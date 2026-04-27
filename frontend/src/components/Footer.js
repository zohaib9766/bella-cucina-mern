import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'3rem',paddingBottom:'3rem',borderBottom:'1px solid var(--border)',flexWrap:'wrap'}}>
          <div>
            <div style={{fontFamily:'Fraunces, serif',fontSize:'1.8rem',color:'var(--gold)',marginBottom:'1rem'}}>🍕 Bella Cucina</div>
            <p style={{color:'var(--muted)',lineHeight:'1.7',maxWidth:'260px',fontSize:'.9rem',marginBottom:'1.5rem'}}>
              Authentic Italian cuisine crafted with passion, delivered fresh to your door since 2018.
            </p>
            <div style={{display:'flex',gap:'.8rem'}}>
              {['📘','📸','🐦','▶️'].map((icon,i) => (
                <a key={i} href="#" style={{
                  width:'2.4rem',height:'2.4rem',borderRadius:'50%',
                  border:'1px solid var(--border)',display:'flex',alignItems:'center',
                  justifyContent:'center',fontSize:'.9rem',transition:'all .2s',
                  background:'var(--bg3)'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor='var(--gold)'}
                onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
                >{icon}</a>
              ))}
            </div>
          </div>

          {[
            ['Quick Links', [['/', 'Home'], ['/menu', 'Menu'], ['/orders', 'Track Order'], ['/cart', 'Cart']]],
            ['Company', [['#', 'About Us'], ['#', 'Careers'], ['#', 'Press Kit'], ['#', 'Blog']]],
            ['Support', [['#', 'Shipping Info'], ['#', 'Returns'], ['#', 'FAQ'], ['#', 'Contact Us']]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 style={{fontSize:'.78rem',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1.2rem',fontWeight:700}}>{title}</h4>
              <div style={{display:'flex',flexDirection:'column',gap:'.7rem'}}>
                {links.map(([to, label]) => (
                  <Link key={label} to={to} style={{color:'var(--muted)',fontSize:'.9rem',transition:'color .2s'}}
                    onMouseOver={e => e.currentTarget.style.color='var(--white)'}
                    onMouseOut={e => e.currentTarget.style.color='var(--muted)'}
                  >{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{paddingTop:'2rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <p style={{color:'var(--muted)',fontSize:'.82rem'}}>© 2026 Bella Cucina. All rights reserved.</p>
          <div style={{display:'flex',gap:'1.5rem'}}>
            <a href="#" style={{color:'var(--muted)',fontSize:'.82rem'}}>Privacy Policy</a>
            <a href="#" style={{color:'var(--muted)',fontSize:'.82rem'}}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
