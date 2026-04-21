import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored);
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Dashboard</h2>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ marginBottom: 15 }}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
}