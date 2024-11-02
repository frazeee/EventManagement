import React, { useState } from "react";
import { supabase } from "../../../API/createClient";

const WalkIn = () => {
  const handleChange = (e) => {
    setGuest((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.id]: e.target.value,
      };
    });
  };

  const [guest, setGuest] = useState({
    name: "",
    guest: "",
    company_name: "",
  });
  const [showModal, setShowModal] = useState(false);

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
      else {
        setShowModal(false);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary mx-2"
        onClick={() => setShowModal(true)}
      >
        Walk-In
      </button>

      {showModal && (
        <div
          className="modal fade show"
          id="staticBackdrop2"
          style={{ display: 'block' }}
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
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
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      aria-describedby="name"
                      onChange={handleChange}
                      value={guest.name}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="guest" className="form-label">
                      Guest
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="guest"
                      name="guest"
                      aria-describedby="guest"
                      onChange={handleChange}
                      value={guest.guest}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="company_name" className="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      name="company_name"
                      aria-describedby="company_name"
                      onChange={handleChange}
                      value={guest.company_name}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
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

