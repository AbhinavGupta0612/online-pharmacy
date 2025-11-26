import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MedicineDetails from './pages/MedicineDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  return (
    <>
      <Header token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicine/:id" element={<MedicineDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
