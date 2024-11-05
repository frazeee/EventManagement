import React, { useState } from "react";
import { supabase } from "../../../API/createClient";
import Swal from "sweetalert2";

const WalkIn = () => {
  const [guest, setGuest] = useState({
    name: "",
    guest: "",
    company_name: "",
    email:"",
    number:"",
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    setGuest((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const createGuest = async (e) => {
    e.preventDefault();

    const phoneRegex = /^(09\d{9}|\+63\d{10})$/;

    if (!phoneRegex.test(guest.number)) {
      Swal.fire({
        title: "Error",
        text: "Please enter a valid Philippine phone number (e.g., 09123456789 or +63123456789).",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("guests")
        .insert({
          name: guest.name,
          guest: guest.guest,
          company_name: guest.company_name,
          registration_type: "WALK-IN",
          // has_reigstered: true,
          email: guest.email,
          number: guest.number,
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
        className="card text-bg-dark mx-auto mb-4"
        style={{
          width: "100%",
          cursor: "pointer",
        }}
        onClick={() => setShowModal(true)}
      >
        <img
          src="./../public/walk-in.png"
          className="card-img-top"
          alt="Walk-in icon"
          style={{
            width: "100%",
            margin: "0 auto",
          }}
        />
        <div className="card-body">
          <h5 className="card-title text-center" style={{ fontWeight: 700 }}>
            Walk-In
          </h5>
          <hr className="mx-auto" style={{ maxWidth: "16rem" }} />
          <p className="card-text text-center mb-4">
            Click here to add a new{" "}
            <span style={{ fontWeight: 700 }}>Walk-In</span> <br />
            participant for the event!
          </p>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-labelledby="walkInModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id="walkInModalLabel"
                  style={{ fontWeight: 700, fontSize: "1.25rem" }}
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
              <form onSubmit={createGuest}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label"
                      style={{ fontWeight: "600" }}
                    >
                      Full Name: <span style={{ color: "red" }}> * </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter Full Name"
                      name="name"
                      onChange={handleChange}
                      value={guest.name}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="guest"
                      className="form-label"
                      style={{ fontWeight: "600" }}
                    >
                      Guest:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="guest"
                      placeholder="Enter Guest Name"
                      name="guest"
                      onChange={handleChange}
                      value={guest.guest}
                      required
                    />
                  </div>
                  <div className="mb-3" style={{ fontWeight: "600" }}>
                    <label htmlFor="company_name" className="form-label">
                      Company Name: <span style={{ color: "red" }}> * </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      placeholder="Enter Company Name"
                      name="company_name"
                      onChange={handleChange}
                      value={guest.company_name}
                      required
                    />
                  </div>
                  <div className="mb-3" style={{ fontWeight: "600" }}>
                    <label htmlFor="email" className="form-label">
                      Email: <span style={{ color: "red" }}> * </span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter Email"
                      name="email"
                      onChange={handleChange}
                      value={guest.email}
                      required
                    />
                  </div>
                  <div className="mb-3" style={{ fontWeight: "600" }}>
                    <label htmlFor="number" className="form-label">
                      Number: <span style={{ color: "red" }}> * </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="number"
                      placeholder="Enter Number"
                      name="number"
                      onChange={handleChange}
                      value={guest.number}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkIn;
