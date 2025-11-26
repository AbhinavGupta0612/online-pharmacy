import React, { useEffect, useState } from 'react';

export default function Cart(){
  const [items, setItems] = useState([]);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(c);
  }, []);

  const removeItem = (idx) => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    c.splice(idx,1);
    localStorage.setItem('cart', JSON.stringify(c));
    setItems(c);
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setItems([]);
  };

  const total = items.reduce((s,i)=> s + (i.price || 0), 0);

  return (
    <div className="container">
      <div className="card">
        <h2>Your cart</h2>
        {items.length === 0 ? (
          <p className="small">Cart is empty. Add medicines from the list.</p>
        ) : (
          <>
            <div>
              {items.map((it, idx) => (
                <div key={idx} className="cart-item">
                  <div>
                    <div style={{ fontWeight:600 }}>{it.name}</div>
                    <div className="small">₹{it.price} • {it.category}</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <button className="btn" onClick={()=>removeItem(idx)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="total-row">
              <div>Total</div>
              <div>₹{total}</div>
            </div>

            <div style={{ marginTop:12, display:'flex', gap:8 }}>
              <button className="btn">Proceed to checkout</button>
              <button className="btn" onClick={clearCart} style={{ background:'#111827' }}>Clear cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
