import React, { useState } from "react";
import { supabase } from "../../../API/createClient";
import Swal from "sweetalert2";
import walkInImage from "../../assets/walk-in.png";

const WalkIn = () => {
  const [guest, setGuest] = useState({
    name: "",
    company_name: "",
    email: "",
    number: "",
    guest_type: "",
    ePLDT_contact: "",
    with_ICT: "",
    attended: false,
    reg_type: "Walk-in",
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

    // const phoneRegex = /^(09\d{9}|\+63\d{10})$/;

    // if (!phoneRegex.test(guest.number)) {
    //   Swal.fire({
    //     title: "Error",
    //     text: "Please enter a valid Philippine phone number (e.g., 09123456789 or +63123456789).",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    //   return;
    // }

    try {
      const { data, error } = await supabase
        .from("guests_GC")
        .insert({
          name: guest.name,
          company_name: guest.company_name,
          designation: guest.designation,
          email: guest.email,
          number: guest.number,
          ePLDT_contact: guest.ePLDT_contact,
          with_ICT: guest.with_ICT,
          reg_type: "Walk-in",
          attended: true,
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
        className="card text-light mx-auto mb-4"
        style={{
          width: "100%",
          cursor: "pointer",
          backgroundColor: "#23384e",
        }}
        onClick={() => setShowModal(true)}
      >
        <img
          src={walkInImage}
          className="card-img-top"
          alt="Walk-in icon"
          style={{
            width: "100%",
            margin: "0 auto",
          }}
        />
        <div className="card-body">
          <h5
            className="card-title text-center"
            style={{ fontWeight: 700, color: "#61c3d1" }}
          >
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
              <div className="modal-body">
                {" "}
                <form onSubmit={createGuest}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Name <span style={{ color: "red" }}> * </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Full Name"
                      aria-describedby="name"
                      onChange={handleChange}
                      value={guest.name}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="company_name"
                      className="form-label fw-semibold"
                    >
                      Company Name <span style={{ color: "red" }}> * </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      name="company_name"
                      placeholder="Enter Company Name"
                      aria-describedby="company_name"
                      onChange={handleChange}
                      value={guest.company_name}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="Designation"
                      className="form-label fw-semibold"
                    >
                      Designation<span style={{ color: "red" }}> * </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="designation"
                      name="designation"
                      placeholder="Enter Company Name"
                      aria-describedby="company_name"
                      onChange={handleChange}
                      value={guest.designation}
                      required
                    />
                  </div>
                  <div className="mb-3" style={{ fontWeight: "600" }}>
                    <label
                      htmlFor="designation"
                      className="form-label fw-semibold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter Guest Email"
                      name="email"
                      onChange={handleChange}
                      value={guest.email}
                    />
                  </div>
                  <div className="mb-3" style={{ fontWeight: "600" }}>
                    <label
                      htmlFor="designation"
                      className="form-label fw-semibold"
                    >
                      Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="number"
                      placeholder="Enter Guest Number"
                      name="number"
                      onChange={handleChange}
                      value={guest.number}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="ePLDT_contact"
                      className="form-label fw-semibold"
                    >
                      ePLDT Contact
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ePLDT_contact"
                      name="ePLDT_contact"
                      placeholder="Enter ePLDT Contact"
                      aria-describedby="guest"
                      onChange={handleChange}
                      value={guest.ePLDT_contact}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="reg_type"
                      className="form-label fw-semibold"
                    >
                      With ICT Provider?{" "}
                      <span style={{ color: "red" }}> * </span>
                    </label>

                    <select
                      className="form-select"
                      value={guest.with_ICT || ""}
                      onChange={handleChange}
                      id="with_ICT"
                      name="with_ICT"
                      required
                    >
                      <option value="" disabled>
                        Select Type
                      </option>
                      <option value="Yes, with ePLDT">Yes, with ePLDT</option>
                      <option value="Yes, but with other provider/s">
                        Yes, but with other provider/s
                      </option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="reg_type"
                      className="form-label fw-semibold"
                    >
                      Registration Type{" "}
                      <span style={{ color: "red" }}> * </span>
                    </label>

                    <select
                      className="form-select"
                      value={guest.reg_type || ""}
                      onChange={handleChange}
                      id="reg_type"
                      name="reg_type"
                      required
                    >
                      <option value="" disabled>
                        Select Type
                      </option>
                      <option value="Pre Registered">Pre Register</option>
                      <option value="Walk-in">Walk-In</option>
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
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
        </div>
      )}
    </div>
  );
};

export default WalkIn;
