import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from "./components/RoleProtectedRoute";   // ✅ Added

import Home from './pages/Home';
import MedicineDetails from './pages/MedicineDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment.jsx';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from "./pages/AdminDashboard";   // ✅ Added

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <>
      <Header token={token} setToken={setToken} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicine/:id" element={<MedicineDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* 🔐 Protected Payment Route */}
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />

        {/* 🔐 Protected Orders Route */}
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } 
        />

        {/* 🔐 Admin Only Route */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}