import { useEffect, useState } from "react";
import "./guestList.css";

import PreRegistered from "../preRegistered/preRegistered";
import WalkIn from "../walkIn/walkIn";
import background from "../assets/background.mp4";

const GuestList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: guests, error } = await supabase.from("guests").select("*");
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
          <h1 className="text-center titleText py-2">Event Management</h1>
          <hr
            className="border border opacity-50 mx-auto mb-4"
            style={{ width: "50%" }}
          />
          <div className="d-flex flex-column flex-md-row justify-content-evenly">
            <PreRegistered className="mb-3 mb-md-0" />{" "}
            <WalkIn />
          </div>
        </div>
      </div>
    </>
  );
}

export default GuestList;
