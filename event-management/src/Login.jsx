import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "./assets/background.mp4";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (onLogin({ username, password })) {
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <>
      <video src={background} autoPlay muted loop></video>
      <form>
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div class="card">
            <div class="card-header">
              <div className="my-4">
                <h3 className="text-center mb-3" style={{ fontWeight: "700" }}>
                  Welcome Admin!
                </h3>
                <p className="text-center text-secondary">
                  Please enter your account details below.
                </p>
              </div>
            </div>
            <div class="card-body">
              <div className="form-group mb-3">
                <label for="password" class="form-label">
                  Username<span style={{ color: "red" }}> * </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label for="password" class="form-label">
                  Password<span style={{ color: "red" }}> * </span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="card-footer">
              <div className="btn-group w-100 my-2">
                <button
                  className="btn btn-outline-danger w-50"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
                <button className="btn btn-primary w-50" onClick={handleLogin}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
