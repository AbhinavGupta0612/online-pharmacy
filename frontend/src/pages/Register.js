import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

export default function Register(){
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const submit = async () => {
    setMsg(null);
    if(!form.name || (!form.email && !form.phone) || !form.password) {
      setMsg({ type:'error', text:'Name, email/phone and password are required.' });
      return;
    }
    if(form.password !== form.confirm){
      setMsg({ type:'error', text:'Password and confirm password do not match.' });
      return;
    }

    setLoading(true);
    try{
      const res = await fetch(API_BASE + '/api/auth/register', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      });

      if(!res.ok){
        const err = await res.json().catch(()=>({ msg:'Registration failed' }));
        setMsg({ type:'error', text: err.msg || err.error || 'Registration failed' });
        setLoading(false);
        return;
      }

      const data = await res.json();
      // backend should ideally return token & user
      if(data.token){
        localStorage.setItem('token', data.token);
      }
      setMsg({ type:'success', text: 'Registration successful. Redirecting...' });
      setTimeout(()=>nav('/'), 1000);
    }catch(e){
      console.error(e);
      setMsg({ type:'error', text:'Network/server error' });
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth:680, margin:'20px auto' }}>
        <h2 style={{ marginTop:0 }}>Create an account</h2>
        <div style={{ display:'grid', gap:10 }}>
          <label style={{ fontWeight:700 }}>Full name</label>
          <input name="name" value={form.name} onChange={onChange} className="input" placeholder="Your full name" />

          <label style={{ fontWeight:700 }}>Email (or leave empty to use phone)</label>
          <input name="email" value={form.email} onChange={onChange} className="input" placeholder="you@example.com" />

          <label style={{ fontWeight:700 }}>Phone (or leave empty to use email)</label>
          <input name="phone" value={form.phone} onChange={onChange} className="input" placeholder="+91XXXXXXXXXX" />

          <label style={{ fontWeight:700 }}>Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} className="input" placeholder="Choose a strong password" />

          <label style={{ fontWeight:700 }}>Confirm password</label>
          <input type="password" name="confirm" value={form.confirm} onChange={onChange} className="input" placeholder="Repeat password" />

          { msg && <div style={{ color: msg.type === 'error' ? 'crimson' : 'green' }}>{msg.text}</div> }

          <div style={{ display:'flex', gap:10 }}>
            <button className="btn" onClick={submit} disabled={loading}>{ loading ? 'Creating...' : 'Register' }</button>
            <button className="btn" onClick={()=>{ window.location.href = '/login' }} style={{ background:'#111827' }}>Go to Login</button>
          </div>

          <div className="small" style={{ marginTop:6 }}>
            By creating an account you agree to our Terms & Privacy.
          </div>
        </div>
      </div>
    </div>
  );
}
