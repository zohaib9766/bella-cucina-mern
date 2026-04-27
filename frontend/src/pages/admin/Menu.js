import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';

const EMPTY_FORM = { name:'', description:'', price:'', category:'Pizza', emoji:'🍕', prepTime:'15-20 min', isFeatured:false };
const CATEGORIES = ['Starters', 'Pizza', 'Pasta', 'Burgers', 'Desserts', 'Drinks'];

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    axios.get('/api/menu').then(res => setItems(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    try {
      const { data } = await axios.post('/api/admin/seed');
      toast.success(data.message); load();
    } catch { toast.error('Seed failed — are you logged in as admin?'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/menu/${editId}`, { ...form, price: parseFloat(form.price) });
        toast.success('Item updated!');
      } else {
        await axios.post('/api/menu', { ...form, price: parseFloat(form.price) });
        toast.success('Item added!');
      }
      setForm(EMPTY_FORM); setEditId(null); setShowForm(false); load();
    } catch { toast.error('Failed to save item'); }
  };

  const handleEdit = (item) => {
    setForm({ name:item.name, description:item.description, price:item.price, category:item.category, emoji:item.emoji, prepTime:item.prepTime, isFeatured:item.isFeatured });
    setEditId(item._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await axios.delete(`/api/menu/${id}`);
    toast.success('Deleted!'); load();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
          <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem'}}>Menu Items</h1>
          <div style={{display:'flex',gap:'.8rem'}}>
            <button onClick={handleSeed} className="btn btn-outline" style={{fontSize:'.85rem'}}>🌱 Seed Demo Data</button>
            <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM); }} className="btn btn-red" style={{fontSize:'.85rem'}}>
              {showForm ? '✕ Cancel' : '+ Add Item'}
            </button>
          </div>
        </div>

        {showForm && (
          <div style={{background:'white',borderRadius:'1.5rem',padding:'2rem',border:'1px solid var(--border)',marginBottom:'2rem'}}>
            <h3 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.4rem',marginBottom:'1.5rem'}}>
              {editId ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input className="form-input" type="number" step="0.01" value={form.price} onChange={e => setForm({...form,price:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Emoji</label>
                  <input className="form-input" value={form.emoji} onChange={e => setForm({...form,emoji:e.target.value})} />
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Description</label>
                  <input className="form-input" value={form.description} onChange={e => setForm({...form,description:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Prep Time</label>
                  <input className="form-input" value={form.prepTime} onChange={e => setForm({...form,prepTime:e.target.value})} />
                </div>
                <div className="form-group" style={{display:'flex',alignItems:'center',gap:'.8rem',paddingTop:'1.5rem'}}>
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm({...form,isFeatured:e.target.checked})} />
                  <label htmlFor="featured" style={{fontSize:'.9rem',cursor:'pointer'}}>Featured item</label>
                </div>
              </div>
              <button type="submit" className="btn btn-red" style={{marginTop:'1rem'}}>
                {editId ? '💾 Save Changes' : '+ Add Item'}
              </button>
            </form>
          </div>
        )}

        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Item</th><th>Category</th><th>Price</th><th>Featured</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:'.8rem'}}>
                        <span style={{fontSize:'1.5rem'}}>{item.emoji}</span>
                        <div>
                          <div style={{fontWeight:600}}>{item.name}</div>
                          <div style={{fontSize:'.78rem',color:'var(--gray)',maxWidth:'200px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{background:'var(--light)',padding:'.25rem .7rem',borderRadius:'2rem',fontSize:'.8rem'}}>{item.category}</span></td>
                    <td style={{fontWeight:700,color:'var(--red)'}}>${item.price}</td>
                    <td>{item.isFeatured ? '⭐' : '—'}</td>
                    <td>
                      <div style={{display:'flex',gap:'.5rem'}}>
                        <button onClick={() => handleEdit(item)} className="btn btn-outline" style={{padding:'.4rem .9rem',fontSize:'.82rem'}}>Edit</button>
                        <button onClick={() => handleDelete(item._id)} style={{padding:'.4rem .9rem',fontSize:'.82rem',background:'var(--red-light)',color:'var(--red)',border:'none',borderRadius:'2rem',cursor:'pointer'}}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
