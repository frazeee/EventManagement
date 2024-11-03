import React, { useState } from "react";
import { supabase } from "../../../API/createClient";
import Swal from "sweetalert2";

const WalkIn = () => {
  const [guest, setGuest] = useState({
    name: "",
    guest: "",
    company_name: "",
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setGuest((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const createGuest = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("guests")
        .insert({
          name: guest.name,
          guest: guest.guest,
          company_name: guest.company_name,
          registration_type: "WALK-IN",
        })
        .select();
      if (error) throw error;

      Swal.fire({
        title: "Success!",
        text: "Guest registered successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setShowModal(false);
      setGuest({ name: "", guest: "", company_name: "" });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to register guest. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <div
        className="card text-bg-dark"
        style={{ width: "30rem", cursor: "pointer" }}
        onClick={() => setShowModal(true)}
      >
        <img
          src="./../public/walk-in.png"
          className="card-img-top"
          alt="..."
          style={{ maxWidth: "20rem", marginRight: "auto", marginLeft: "auto" }}
        />
        <div className="card-body">
          <h5 className="card-title text-center" style={{ fontWeight: 700 }}>
            Walk-In
          </h5>
          <hr
            style={{
              maxWidth: "16rem",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          />
          <p className="card-text text-center mb-4">
            Click here to add a new{" "}
            <text style={{ fontWeight: 700 }}>Walk-In</text> <br></br>
            participant for the event!
          </p>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          id="staticBackdrop2"
          style={{ display: "block" }}
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id="staticBackdropLabel"
                  style={{ fontWeight: 700 }}
                >
                  Register Walk-In Guest
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={createGuest}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter Full Name"
                      name="name"
                      aria-describedby="name"
                      onChange={handleChange}
                      value={guest.name}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="guest" className="form-label">
                      Guest:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="guest"
                      placeholder="Enter Guest Name"
                      name="guest"
                      aria-describedby="guest"
                      onChange={handleChange}
                      value={guest.guest}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="company_name" className="form-label">
                      Company Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      placeholder="Enter Company Name"
                      name="company_name"
                      aria-describedby="company_name"
                      onChange={handleChange}
                      value={guest.company_name}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkIn;
