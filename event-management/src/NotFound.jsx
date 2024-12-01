import background from "./assets/not-found.png";
import backgroundVideo from "./assets/background.mp4";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <video src={backgroundVideo} autoPlay muted loop></video>
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
          style={{ margin: "auto", zIndex: 5 }}
          onClick={() => navigate("/")}
        >
          Return to Homepage
        </button>
      </div>
    </>
  );
}

export default NotFound;
