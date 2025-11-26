import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ token, setToken }){
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    nav('/');
  };

  return (
    <>
      <header className="app-header">
        <Link className="brand" to="/">MediCare+</Link>
        <div className="app-note">Trusted · Doctor-recommended suggestions</div>

        <nav style={{ marginLeft:'auto', display:'flex', gap:12 }}>
          <Link to="/cart">Cart</Link>
          { token ? (
            <button className="btn" onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <div className="container">
        <div className="hero">
          <div className="left">
            <h1>Doctor-recommended medicines in one place</h1>
            <p className="small">Curated suggestions for common symptoms — powered by clinical categories.</p>
          </div>
          <div>
            <div className="doctor-ribbon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3v6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M6 15a6 6 0 0012 0V9" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="6" cy="9" r="1.6" fill="white"/>
              </svg>
              <span>Doctor recommended</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
