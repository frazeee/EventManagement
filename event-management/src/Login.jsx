import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "./assets/2ndbg.mp4";
import poster from "./assets/poster.jpg";
import { supabase } from "../API/createClient";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        setError("Invalid credentials");
        return false;
      }
      navigate("/bsa-admin");
    } catch (err) {
      setError("Invalid credentials");
      return false;
    }
  };

  return (
    <>
      <div className="fade-in">
        <video src={background} autoPlay muted loop></video>
        <form onSubmit={handleLogin} className="flex-grow-1">
          <div className="container d-flex justify-content-center align-items-center min-vh-100 my-5">
            <div className="card">
              <div className="card-header">
                <div className="my-4">
                  <h3
                    className="text-center mb-3"
                    style={{ fontWeight: "700" }}
                  >
                    Welcome Admin!
                  </h3>
                  <p className="text-center text-secondary">
                    Please enter your account details below.
                  </p>
                </div>
              </div>
              <div className="card-body">
                <div className="form-group mb-3">
                  {/* Image Section */}
                  <div className="image-container">
                    <p className="fw-bolder">Current Event:</p>
                    <img src={poster} className="img-fluid" alt="Poster" />
                  </div>
                  <br />
                  <label htmlFor="username" className="form-label">
                    Username<span style={{ color: "red" }}> *</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="password" className="form-label">
                    Password<span style={{ color: "red" }}> *</span>
                  </label>
                  <input
                    type="password"
                    id="password"
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
                    type="button"
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary w-50" type="submit">
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <footer className="bg-body-tertiary text-center text-lg-start">
          <div
            className="text-center p-3"
            style={{ backgroundColor: "#222222", color: "#ffffff" }}
          >
            © 2025 BrandSpeakAsia. All rights reserved
          </div>
        </footer>
      </div>
    </>
  );
}

export default Login;
