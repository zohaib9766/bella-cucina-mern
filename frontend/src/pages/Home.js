import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const FOOD_PHOTOS = {
  Pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  Pasta: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80',
  Burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  Starters: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&q=80',
  Desserts: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
  Drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('/api/menu/featured').then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  const handleAdd = (item) => {
    addToCart(item);
    toast.success(`${item.emoji} ${item.name} added to cart!`);
  };

  return (
    <div className="page-wrap">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="tag">✦ Now Delivering — 30 min or Free</span>
          <h1 className="section-title hero-title">
            Authentic Italian<br /><em>Flavours</em> At<br />Your Doorstep
          </h1>
          <p className="section-sub hero-desc">
            Handcrafted pizzas, fresh pastas, and classic Italian dishes made with the finest ingredients — prepared fresh for every order.
          </p>
          <div className="hero-btns">
            <Link to="/menu" className="btn btn-gold">🍕 Order Now</Link>
            <Link to="/menu" className="btn btn-outline">Explore Menu</Link>
          </div>
          <div className="hero-badges">
            <div>
              <div className="hero-badge-num">4.9★</div>
              <div className="hero-badge-label">Rating</div>
            </div>
            <div>
              <div className="hero-badge-num">2,400+</div>
              <div className="hero-badge-label">Happy Customers</div>
            </div>
            <div>
              <div className="hero-badge-num">30 min</div>
              <div className="hero-badge-label">Avg Delivery</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=85"
              alt="Bella Cucina Pizza"
            />
            <div className="hero-img-overlay" />
          </div>
          <div className="hero-float">
            <span className="hero-float-icon">🔥</span>
            <div className="hero-float-text">
              <strong>Fresh & Hot</strong>
              <span>Prepared on order</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="marquee-item">Fresh Daily</span>
              <span className="marquee-item">Free Delivery Over $30</span>
              <span className="marquee-item">Authentic Italian</span>
              <span className="marquee-item">30 Min Guarantee</span>
              <span className="marquee-item">Handcrafted With Love</span>
              <span className="marquee-item">Open 11am – 11pm</span>
              <span className="marquee-item">4.9 Star Rating</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* WHY US */}
      <section className="section" style={{background:'var(--bg2)'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <span className="tag">Why Bella Cucina</span>
            <h2 className="section-title">Food made with <em style={{fontStyle:'italic',color:'var(--gold)'}}>passion</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem'}}>
            {[
              ['🌿','Fresh Ingredients','Sourced daily from local farms and authentic Italian importers'],
              ['👨‍🍳','Expert Chefs','20+ years of authentic Italian culinary experience'],
              ['⚡','Fast Delivery','Hot food at your door in 30 minutes or your next order is free'],
              ['❤️','Made with Love','Every dish prepared as if you are dining in Naples itself'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="why-card">
                <div className="why-icon">{icon}</div>
                <h3 className="why-title">{title}</h3>
                <p className="why-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MENU */}
      <section className="section">
        <div className="container">
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'2.5rem',flexWrap:'wrap',gap:'1rem'}}>
            <div>
              <span className="tag">Chef's Picks</span>
              <h2 className="section-title">Most Loved Dishes</h2>
            </div>
            <Link to="/menu" className="btn btn-outline">Full Menu →</Link>
          </div>

          {featured.length === 0 ? (
            <div style={{textAlign:'center',padding:'3rem',color:'var(--muted)'}}>
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🍽️</div>
              <p>Menu loading... Make sure backend is running and seeded!</p>
            </div>
          ) : (
            <div className="menu-grid">
              {featured.map(item => (
                <div key={item._id} className="menu-card fade-in">
                  <div className="menu-card-img">
                    <img
                      src={FOOD_PHOTOS[item.category] || FOOD_PHOTOS.default}
                      alt={item.name}
                      onError={e => { e.target.style.display='none'; }}
                    />
                    <div className="menu-card-img-overlay" />
                    {item.isFeatured && <span className="menu-card-badge">⭐ Popular</span>}
                  </div>
                  <div className="menu-card-body">
                    <div className="menu-card-name">{item.emoji} {item.name}</div>
                    <div className="menu-card-desc">{item.description}</div>
                    <div style={{fontSize:'.8rem',color:'var(--muted)',marginBottom:'.8rem'}}>
                      🕐 {item.prepTime} &nbsp;·&nbsp; ⭐ {item.rating} ({item.reviews})
                    </div>
                    <div className="menu-card-footer">
                      <div className="menu-card-price">${item.price}</div>
                      <button className="add-btn" onClick={() => handleAdd(item)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{position:'relative',overflow:'hidden'}}>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80"
          alt="Restaurant"
          style={{width:'100%',height:'500px',objectFit:'cover',display:'block'}}
        />
        <div style={{
          position:'absolute',inset:0,
          background:'linear-gradient(to right, rgba(13,13,13,.95) 40%, rgba(13,13,13,.5))',
          display:'flex',alignItems:'center',padding:'0 5%'
        }}>
          <div style={{maxWidth:'560px'}}>
            <span className="tag">Limited Time</span>
            <h2 className="section-title" style={{marginBottom:'1rem'}}>
              First Order?<br /><em style={{color:'var(--gold)'}}>Free Delivery!</em>
            </h2>
            <p style={{color:'var(--muted)',marginBottom:'2rem',lineHeight:'1.7'}}>
              Join thousands of happy customers. Use code <strong style={{color:'var(--gold)'}}>WELCOME</strong> on your first order and get free delivery!
            </p>
            <Link to="/menu" className="btn btn-gold" style={{fontSize:'1rem',padding:'1rem 2.5rem'}}>
              🍕 Order Now — Free Delivery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
