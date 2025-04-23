import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "../API/createClient";
import PreRegistered from "./components/preRegistered/preRegistered";
import WalkIn from "./components/walkIn/walkIn";
import background from "./assets/background.mp4";
import { useNavigate } from "react-router-dom";
function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: guests, error } = await supabase
        .from("guests_ct")
        .select("*");
      setData(guests);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fade-in">
        <video src={background} autoPlay muted loop></video>
        <div className="container d-flex flex-column justify-content-center vh-100">
          <div class="position-absolute top-0 end-0">
            <button
              className="btn btn-outline-success mt-2 me-2"
              onClick={() => navigate("/login")}
              style={{ zIndex: 2 }}
            >
              Login
            </button>
          </div>
          <h1 className="text-center titleText py-2">
            Coffee Talk: BEYOND THE CLASSROOM
          </h1>
          <hr
            className="border border opacity-50 mx-auto mb-4"
            style={{ width: "50%" }}
          />
          <div className="d-flex flex-column flex-md-row justify-content-evenly">
            {/* Stack on small screens, side-by-side on md and up */}
            <PreRegistered className="mb-3 mb-md-0" />{" "}
            {/* Adds bottom margin on small screens */}
            <WalkIn />
          </div>
        </div>
        <footer class="bg-body-tertiary text-center text-lg-start">
          <div
            class="text-center p-3"
            style={{ backgroundColor: "#222222", color: "#ffffff" }}
          >
            © 2025 BrandSpeakAsia. All rights reserved
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
