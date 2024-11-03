import React, { useState, useEffect } from "react";
import { supabase } from "../../../API/createClient";

const PreRegistered = () => {
  const [searchInput, setSearchInput] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    getRequestList();
  }, []);

  const getRequestList = async () => {
    try {
      const { data, error } = await supabase
        .from("guests")
        .select(`*`)
        .eq("registration_type", "PRE-REGISTERED");
      setGuestList(data);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  useEffect(() => {
    const filteredList = guestList.filter((guest) =>
      guest.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredList(filteredList);
  }, [searchInput, guestList]);

  return (
    <div>
      <div
        className="card text-bg-dark mx-auto mb-4"
        style={{
          width: "100%",
          cursor: "pointer",
        }}
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        <img
          src="./../public/pre-register.png"
          className="card-img-top img-fluid"
          alt="Pre-Registered icon"
          style={{
            width: "100%",
            margin: "0 auto",
          }}
        />
        <div className="card-body">
          <h5
            className="card-title text-center"
            style={{ fontWeight: 700, fontSize: "1.5rem" }}
          >
            Pre-Registered
          </h5>
          <hr className="mx-auto" style={{ maxWidth: "18rem" }} />
          <p
            className="card-text text-center mb-4"
            style={{ fontSize: "1rem" }}
          >
            Click here to see and edit the list of <br />
            <span style={{ fontWeight: 700 }}>Pre-Registered</span>{" "}
            participants!
          </p>
        </div>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="staticBackdropLabel"
                style={{ fontWeight: 700, fontSize: "1.25rem" }}
              >
                Search Pre-Registered Guest
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="guestSearch" className="form-label fw-semibold">
                  Guest's Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  id="guestSearch"
                />
              </div>

              <div className="list-group w-100">
                {guestList.length > 0 ? (
                  filteredList.map((guest) => (
                    <button
                      key={guest.id}
                      type="button"
                      className="list-group-item list-group-item-action"
                      data-bs-toggle="modal"
                      data-bs-target="#edit-modal"
                      data-bs-dismiss="modal"
                    >
                      {guest.name}
                    </button>
                  ))
                ) : (
                  <h5 className="mb-1">No Guest Found</h5>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <div className="modal" id="edit-modal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Guest Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreRegistered;
