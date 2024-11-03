import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "../API/createClient";
import PreRegistered from "./components/preRegistered/preRegistered";
import WalkIn from "./components/walkIn/walkIn";
import background from "./assets/background.mp4";
function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: guests, error } = await supabase.from("guests").select("*");
      setData(...guests);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <video src={background} autoPlay muted loop></video>
      <div className="container d-flex flex-column justify-content-center  vh-100">
        <h1 className="text-center text-white">Event Management</h1>
        <hr
          className="border border opacity-50 mx-auto"
          style={{ width: "50%" }}
        />
        <div className="d-flex justify-content-evenly">
          <PreRegistered />
          <WalkIn />
        </div>
      </div>
    </>
  );
}

export default App;
