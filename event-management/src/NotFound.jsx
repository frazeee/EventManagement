import background from "./assets/not-found.png";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="fade-in">
      <div
        className="container d-flex flex-column justify-content-center vh-100"
        style={{
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <img
          src={background}
          style={{ width: "50%", margin: "auto", zIndex: 5 }}
        />
        <button
          className="btn btn-primary"
          style={{ margin: "auto", marginTop: "1.5rem", zIndex: 5 }}
          onClick={() => navigate("/")}
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}

export default NotFound;
