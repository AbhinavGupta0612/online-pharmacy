import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

export default function MedicineDetails(){
  const { id } = useParams();
  const [med, setMed] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch(API_BASE + '/api/medicines/' + id);
        const data = await res.json();
        setMed(data);
        const simRes = await fetch(API_BASE + '/api/medicines/recommend', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ name: data.name })
        });
        const sim = await simRes.json();
        setSimilar(sim);
      }catch(e){
        console.error(e);
      }
    }
    load();
  },[id]);

  const addToCart = (m) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(m);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${m.name} added to cart`);
  };

  if(!med) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card details">
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <h2 style={{ margin:0 }}>{med.name}</h2>
              { med.category && med.category.toLowerCase().includes('antibiotic') && <div className="badge">DOC</div>}
            </div>
            <div className="small" style={{ marginTop:6 }}>{med.brand} • {med.category}</div>
            <p style={{ marginTop:8 }}>{med.description}</p>
            <div style={{ marginTop:8 }}><strong>Price:</strong> ₹{med.price} <span style={{marginLeft:12}}><strong>Stock:</strong> {med.stock}</span></div>
          </div>
          <div>
            <button className="btn" onClick={()=>addToCart(med)}>Add to cart</button>
          </div>
        </div>

        <h3 style={{ marginTop:14 }}>Similar medicines</h3>
        <div className="similar-list">
          {similar.map(s=>(
            <div key={s._id} className="med-item">
              <div>
                <div style={{ fontWeight:600 }}>{s.name}</div>
                <div className="small">₹{s.price} • {s.category}</div>
              </div>
              <div>
                <button className="btn" onClick={()=>addToCart(s)}>Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
