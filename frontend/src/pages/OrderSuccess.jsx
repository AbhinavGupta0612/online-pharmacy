import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>
        <h2 style={{ color: "#16a34a" }}>🎉 Order Placed Successfully!</h2>
        <p>Your medicines will be delivered soon.</p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "#1f7a6c",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}