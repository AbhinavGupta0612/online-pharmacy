import React from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const totalAmount = cart.reduce((s, i) => s + (i.price || 0), 0);

  const handlePayment = () => {
    const newOrder = {
      id: "ORD" + Date.now(),
      items: cart,
      total: totalAmount,
      date: new Date().toLocaleString(),
      status: "Pending"
    };

    const oldOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...oldOrders, newOrder]));

    localStorage.removeItem("cart");

    navigate("/order-success");
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", padding: "20px" }}>
        <h2>Scan & Pay</h2>

        <p>Total Amount: <strong>₹{totalAmount}</strong></p>

        <img
          src="/myqr.jpg"
          alt="MYQR"
          style={{
            width: "250px",
            marginTop: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        />

        <p style={{ marginTop: "10px" }}>
          Scan using Google Pay / PhonePe / Paytm or any upi app 
        </p>

        <button
          onClick={handlePayment}
          style={{
            background: "#16a34a",
            color: "white",
            padding: "12px 25px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          I Have Paid
        </button>
      </div>
    </div>
  );
};

export default Payment;