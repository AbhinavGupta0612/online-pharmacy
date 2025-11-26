import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

export default function Login(){
  const nav = useNavigate();
  const [form, setForm] = useState({ identifier:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotId, setForgotId] = useState('');
  const [forgotMsg, setForgotMsg] = useState(null);

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const submit = async () => {
    setMsg(null);
    if(!form.identifier || !form.password){
      setMsg({ type:'error', text:'Please enter email/phone and password' });
      return;
    }
    setLoading(true);
    try{
      const res = await fetch(API_BASE + '/api/auth/login', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ identifier: form.identifier, password: form.password })
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({ msg:'Login failed' }));
        setMsg({ type:'error', text: err.msg || 'Login failed' });
        setLoading(false);
        return;
      }
      const data = await res.json();
      if(data.token) localStorage.setItem('token', data.token);
      setMsg({ type:'success', text:'Login successful. Redirecting...' });
      setTimeout(()=>nav('/'), 800);
    }catch(e){
      console.error(e);
      setMsg({ type:'error', text:'Network/server error' });
    }finally{ setLoading(false); }
  };

  const doForgot = async () => {
    setForgotMsg(null);
    if(!forgotId) return setForgotMsg({ type:'error', text:'Enter registered email or phone' });
    try{
      setForgotMsg({ type:'info', text:'Sending reset request...' });
      const r = await fetch(API_BASE + '/api/auth/forgot-password', {
        method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ identifier: forgotId })
      });
      if(!r.ok){
        const e = await r.json().catch(()=>({ msg:'Failed' }));
        setForgotMsg({ type:'error', text: e.msg || 'Failed to request reset' });
        return;
      }
      setForgotMsg({ type:'success', text:'If account exists, a reset link was sent to email/phone.' });
    }catch(e){
      console.error(e);
      setForgotMsg({ type:'error', text:'Network error' });
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth:640, margin:'20px auto' }}>
        <h2 style={{ marginTop:0 }}>Login to your account</h2>

        <label style={{ fontWeight:700 }}>Email or Phone</label>
        <input name="identifier" value={form.identifier} onChange={onChange} className="input" placeholder="you@example.com or +91XXXXXXXXXX" />

        <label style={{ fontWeight:700, marginTop:8 }}>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} className="input" placeholder="Your password" />

        { msg && <div style={{ color: msg.type === 'error' ? 'crimson' : 'green', marginTop:8 }}>{msg.text}</div> }

        <div style={{ display:'flex', gap:10, marginTop:12 }}>
          <button className="btn" onClick={submit} disabled={loading}>{ loading ? 'Logging in...' : 'Login' }</button>
          <button className="btn" style={{ background:'#111827' }} onClick={()=>{ window.location.href = '/register' }}>Register</button>

          <button style={{ marginLeft:'auto', background:'transparent', border:'none', color:'var(--primary)', textDecoration:'underline', cursor:'pointer' }} onClick={()=>setShowForgot(true)}>Forgot password?</button>
        </div>

        {/* Forgot password modal-ish area */}
        { showForgot && (
          <div style={{ marginTop:12, padding:12, borderRadius:8, background:'#fffaf9', border:'1px solid #ffe7e7' }}>
            <div style={{ fontWeight:700 }}>Forgot password</div>
            <div className="small" style={{ marginTop:6 }}>Enter your registered email or phone. We'll send reset instructions.</div>
            <input value={forgotId} onChange={(e)=>setForgotId(e.target.value)} className="input" placeholder="email or phone" style={{ marginTop:8 }} />
            { forgotMsg && <div style={{ color: forgotMsg.type === 'error' ? 'crimson' : (forgotMsg.type==='success' ? 'green' : '#333'), marginTop:8 }}>{forgotMsg.text}</div> }
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <button className="btn" onClick={doForgot}>Send reset</button>
              <button className="btn" style={{ background:'#111827' }} onClick={()=>setShowForgot(false)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
