import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );

    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated);
  };

  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Medicine Store Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 35);
    doc.text(`Date: ${order.date}`, 20, 45);
    doc.text(`Status: ${order.status}`, 20, 55);

    let y = 70;
    order.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - ₹${item.price}`, 20, y);
      y += 10;
    });

    doc.text(`Total: ₹${order.total}`, 20, y + 10);
    doc.save(`${order.id}.pdf`);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Order History</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
              <h4>Order ID: {order.id}</h4>
              <p>Date: {order.date}</p>
              <p>Total: ₹{order.total}</p>

              <p>
                Status: 
                <strong style={{
                  color:
                    order.status === "Pending"
                      ? "orange"
                      : order.status === "Shipped"
                      ? "blue"
                      : "green"
                }}>
                  {" "}{order.status}
                </strong>
              </p>

              {/* Demo Status Buttons */}
              <div style={{ marginBottom: 10 }}>
                <button onClick={() => updateStatus(order.id, "Shipped")} style={{ marginRight: 8 }}>
                  Mark Shipped
                </button>
                <button onClick={() => updateStatus(order.id, "Delivered")}>
                  Mark Delivered
                </button>
              </div>

              <button
                onClick={() => downloadInvoice(order)}
                style={{
                  background: "#1f7a6c",
                  color: "white",
                  padding: "8px 15px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                🧾 Download Invoice
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}