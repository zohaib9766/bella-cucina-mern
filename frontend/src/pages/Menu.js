import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Starters', 'Pizza', 'Pasta', 'Burgers', 'Desserts', 'Drinks'];

const FOOD_PHOTOS = {
  Pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  Pasta: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80',
  Burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  Starters: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&q=80',
  Desserts: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
  Drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
};

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== 'All' ? `?category=${activeCategory}` : '';
    axios.get(`/api/menu${params}`)
      .then(res => setItems(res.data))
      .catch(() => toast.error('Could not load menu'))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleAdd = (item) => {
    addToCart(item);
    toast.success(`${item.emoji} Added to cart!`);
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{
        background:'var(--bg2)', padding:'4rem 5% 3rem',
        borderBottom:'1px solid var(--border)', position:'relative', overflow:'hidden'
      }}>
        <div style={{
          position:'absolute',inset:0,
          background:'radial-gradient(ellipse at 50% 100%, rgba(212,168,67,.08) 0%, transparent 60%)'
        }}/>
        <div style={{position:'relative',textAlign:'center'}}>
          <span className="tag">Our Menu</span>
          <h1 className="section-title" style={{marginBottom:'.8rem'}}>What are you <em style={{fontStyle:'italic',color:'var(--gold)'}}>craving?</em></h1>
          <p style={{color:'var(--muted)',fontSize:'1rem'}}>Fresh, authentic Italian food made to order</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Categories */}
          <div className="categories">
            {CATEGORIES.map(cat => (
              <button key={cat} className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>

          {loading ? <div className="spinner" /> : items.length === 0 ? (
            <div style={{textAlign:'center',padding:'4rem',color:'var(--muted)'}}>
              <div style={{fontSize:'3rem'}}>🍽️</div>
              <p style={{marginTop:'1rem'}}>No items found. Seed the database from Admin panel!</p>
            </div>
          ) : (
            <div className="menu-grid">
              {items.map(item => (
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
                      🕐 {item.prepTime} &nbsp;·&nbsp; ⭐ {item.rating} ({item.reviews} reviews)
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
      </div>
    </div>
  );
}
