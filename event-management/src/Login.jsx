import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "./assets/background.mp4";
import eventPoster from "./assets/event-poster.png";
import { supabase } from "../API/createClient";
import { FiLogIn } from "react-icons/fi";
import logo from "./assets/logo-gold.png";
import "./login.css";

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
    <div className="fade-in">
      <video src={background} autoPlay muted loop></video>

      <form onSubmit={handleLogin} className="login-form-wrapper">
        <div className="login-panel">
          <div className="login-poster-col">
            <p className="login-label mb-4">Current Event</p>
            <img
              src={eventPoster}
              alt="Diamond Legacy - 60 Years of Crafting Excellence"
              className="event-poster"
            />
          </div>
          <div className="login-form-col">
            <div className="login-form-header">
              <img src={logo} alt="Mariwasa 60 Years" className="login-logo" />
              <h3 className="login-heading">Welcome Admin!</h3>
              <hr className="login-divider" />
              <p className="login-subtext">
                Please enter your account details below.
              </p>
            </div>

            <div className="login-field">
              <label htmlFor="username" className="login-label">
                Username<span className="required-mark"> *</span>
              </label>
              <input
                type="text"
                id="username"
                className="login-input"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Password<span className="required-mark"> *</span>
              </label>
              <input
                type="password"
                id="password"
                className="login-input"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button className="login-submit-btn" type="submit">
              Login <FiLogIn />
            </button>
          </div>
        </div>
      </form>

      <footer className="login-footer">
        © 2025 BrandSpeakAsia. All rights reserved
      </footer>
    </div>
  );
}

export default Login;
