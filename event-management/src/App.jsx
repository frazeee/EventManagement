import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "../API/createClient";
import PreRegistered from "./components/preRegistered/preRegistered";
import WalkIn from "./components/walkIn/walkIn";
import logo from "./assets/I3_Logo.png";
import { useNavigate } from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function getSession() {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/registration-list");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: guests, error } = await supabase
        .from("guests_i3")
        .select("*");
      setData(guests);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="container position-relative d-flex flex-column justify-content-center vh-100">
        <div className="position-absolute top-0 end-0">
          <button
            className="btn btn-outline-primary mt-2 me-2"
            onClick={() => navigate("/bsa-admin")}
            style={{ zIndex: 2 }}
          >
            Guest List
          </button>
        </div>

        <img
          src={logo}
          alt="i3 - Initiate Innovate Integrate"
          className="d-block mx-auto"
          style={{ maxWidth: "220px", marginBottom: "0.5rem" }}
        />
        <h1 className="text-center titleText py-2">
          The Complete Patient Journey Symposium
        </h1>
        <hr className="gold-divider" />
        <div className="d-flex flex-column flex-md-row justify-content-evenly">
          <PreRegistered className="mb-3 mb-md-0" />
          <WalkIn />
        </div>
      </div>
      <footer className="bg-body-tertiary text-center text-lg-start">
        <div
          className="text-center p-3"
          style={{
            backgroundColor: "transparent",
            color: "#1b3a5c",
            opacity: 0.65,
            fontSize: "0.85rem",
          }}
        >
          © 2025 BrandSpeakAsia. All rights reserved
        </div>
      </footer>
    </div>
  );
}

export default App;
