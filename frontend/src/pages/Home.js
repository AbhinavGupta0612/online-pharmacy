import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

export default function Home(){
  const [disease, setDisease] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [topMeds, setTopMeds] = useState([]);

  useEffect(() => {
    // load top medicines for the below-the-fold "Top medicines" section
    async function loadMeds(){
      try{
        const r = await fetch(API_BASE + '/api/medicines');
        if(!r.ok) return;
        const data = await r.json();
        // pick first 6 as top medicines
        setTopMeds(data.slice(0,6));
      }catch(e){
        // ignore silently
        console.error('Top meds failed', e);
      }
    }
    loadMeds();
  }, []);

  const predict = async () => {
    setError('');
    setResults(null);
    const name = (disease || '').trim();
    if(!name) return setError('Please enter a disease or symptom (e.g. fever)');

    setLoading(true);
    try{
      const res = await fetch(API_BASE + '/api/diseases/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if(!res.ok){
        const e = await res.json().catch(()=>({ msg: 'Not found' }));
        setError(e.msg || 'No results for this disease');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResults({ disease: data.disease, medicines: data.medicines || [] });
    }catch(err){
      console.error(err);
      setError('Error contacting server. Make sure backend is running.');
    }finally{
      setLoading(false);
    }
  };

  const addToCart = (m) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(m);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${m.name} added to cart`);
  };

  return (
    <div>
      {/* Hero + Search */}
      <div className="container">
        <div className="card" style={{ paddingBottom:28 }}>
          <label style={{ fontWeight:700 }}>Disease / Symptom</label>
          <div className="search-row" style={{ marginTop:8 }}>
            <input className="input" value={disease} onChange={e=>setDisease(e.target.value)} placeholder="e.g. fever, cold, infection" />
            <button className="btn" onClick={predict}>{loading ? 'Predicting...' : 'Predict'}</button>
          </div>
          {error && <div style={{ color:'crimson', marginTop:10 }}>{error}</div>}
        </div>
      </div>

      {/* Results (doctor card) */}
      {results && (
        <div className="container">
          <div style={{ marginTop:25 }} className="grid">
            <div>
              <div className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start' }}>
                  <div>
                    <h2 style={{ margin:0 }}>{results.disease.name}</h2>
                    <div className="small" style={{ marginTop:8 }}>{results.disease.description}</div>
                  </div>

                  {results.disease.recommended && (
                    <div className="badge" style={{ marginLeft:12 }}>
                      Doctor recommended
                    </div>
                  )}
                </div>

                <div style={{ marginTop:25 }}>
                  <h3 style={{ marginBottom:12 }}>Medications</h3>

                  {results.medicines.length > 0 ? (
                    <div className="meds-list">
                      {results.medicines.map((m) => (
                        <div key={m._id} className="med-item">
                          <div className="meta">
                            <Link className="name" to={"/medicine/" + m._id}>
                              {m.name}
                            </Link>
                            <div className="price">{m.category} • ₹{m.price}</div>
                          </div>

                          <button className="btn" onClick={() => addToCart(m)}>
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="small">No medicines available.</div>
                  )}
                </div>

                <div style={{ marginTop:25 }}>
                  <h4>Precautions</h4>
                  <ul>
                    {(results.disease.precautions || []).map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <aside>
              <div className="card right-note">
                <h4 style={{ marginTop:0 }}>Diets</h4>
                <ul>{(results.disease.diets || []).map((d,i)=><li key={i}>{d}</li>)}</ul>

                <h4 style={{ marginTop:15 }}>Workouts</h4>
                <ul>{(results.disease.workouts || []).map((w,i)=><li key={i}>{w}</li>)}</ul>

                <div style={{ marginTop:18, background:'#fff7f7', padding:15, borderRadius:12 }}>
                  <strong style={{ color:'#b91c1c' }}>Safety note:</strong>
                  <div style={{ marginTop:6 }}>
                    This AI helper provides general suggestions. Always consult a certified doctor before taking medicines.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* ----------------- Below the fold content to fill the page ----------------- */}
      <div className="container" style={{ marginTop:30 }}>
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ marginTop:0 }}>Featured Categories</h3>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginTop:12 }}>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <div>
                <div style={{ fontWeight:700 }}>Analgesics</div>
                <div className="small">Pain & fever relief</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🩹</div>
              <div>
                <div style={{ fontWeight:700 }}>Antibiotics</div>
                <div className="small">For infections (prescription)</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <div>
                <div style={{ fontWeight:700 }}>Allergy</div>
                <div className="small">Antihistamines & more</div>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🫀</div>
              <div>
                <div style={{ fontWeight:700 }}>Heart Care</div>
                <div className="small">Cardiac supplements & drugs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top medicines */}
      <div className="container" style={{ marginTop:20 }}>
        <h3 style={{ marginBottom:12 }}>Top medicines</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12 }}>
          {topMeds.map(m => (
            <div className="card" key={m._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700 }}>{m.name}</div>
                <div className="small">{m.category} • ₹{m.price}</div>
              </div>
              <div>
                <button className="btn" onClick={()=>addToCart(m)}>Add</button>
              </div>
            </div>
          ))}

          {topMeds.length === 0 && (
            <div className="card">No medicines found (seed DB first).</div>
          )}
        </div>
      </div>

      {/* How it works + Testimonials */}
      <div className="container" style={{ marginTop:22 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:16 }}>
          <div className="card">
            <h3 style={{ marginTop:0 }}>How it works</h3>
            <ol style={{ marginTop:8 }}>
              <li>Type the disease or symptom (e.g. fever) and click Predict.</li>
              <li>We match disease to clinical symptoms and find medicines from our catalog.</li>
              <li>Check precautions and consult a doctor if needed — then add to cart and order.</li>
            </ol>
            <div style={{ marginTop:12 }}>
              <strong>Pro tip:</strong> Use short words like "fever", "cold", or "infection" for best results.
            </div>
          </div>

          <aside>
            <div className="card">
              <h4 style={{ marginTop:0 }}>What users say</h4>
              <div style={{ marginTop:8 }}>
                <div style={{ fontWeight:700 }}>Rohit K.</div>
                <div className="small">"Great app — got correct suggestions quickly. Very helpful!"</div>
              </div>

              <div style={{ marginTop:12 }}>
                <div style={{ fontWeight:700 }}>Dr. Meera S.</div>
                <div className="small">"Useful for quick references; always confirm with patient history."</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ marginTop:28, padding:'28px 0', borderTop:'1px solid rgba(2,6,23,0.04)' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontWeight:800, color:'var(--primary)' }}>MediCare+</div>
            <div className="small" style={{ marginTop:6 }}>Trusted · Doctor recommended · Safe guidance</div>
          </div>

          <div className="small">© {new Date().getFullYear()} MediCare — Built with care</div>
        </div>
      </footer>
    </div>
  );
}
