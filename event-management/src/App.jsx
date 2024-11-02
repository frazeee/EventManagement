import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "../API/createClient";
import PreRegistered from "./components/preRegistered";
import WalkIn from "./components/walkIn";
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
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="text-center text-white my-3">Event Management</h1>
      <div className="d-flex">
        <PreRegistered />
        <WalkIn />
      </div>
    </div>
  );
}

export default App;
