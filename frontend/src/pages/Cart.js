import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(c);
  }, []);

  const removeItem = (idx) => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    c.splice(idx, 1);
    localStorage.setItem('cart', JSON.stringify(c));
    setItems(c);
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setItems([]);
  };

  const total = items.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <div className="container">
      <div className="card">
        <h2>Your Cart</h2>

        {items.length === 0 ? (
          <p className="small">Cart is empty. Add medicines from the list.</p>
        ) : (
          <>
            <div>
              {items.map((it, idx) => (
                <div key={idx} className="cart-item">
                  <div>
                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                    <div className="small">
                      ₹{it.price} • {it.category}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      className="btn"
                      onClick={() => removeItem(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="total-row">
              <div>Total</div>
              <div>₹{total}</div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate("/payment")}
                style={{
                  background: "#1f7a6c",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Proceed to Checkout
              </button>

              <button
                className="btn"
                onClick={clearCart}
                style={{ background: '#111827' }}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}