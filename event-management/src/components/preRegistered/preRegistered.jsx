import React, { useState, useEffect } from "react";
import { supabase } from "../../../API/createClient";

const PreRegistered = () => {
  const [searchInput, setSearchInput] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [activeGuest, setActiveGuest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    getRequestList();
  }, []);

  const getRequestList = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guests")
        .select(`*`)
        .eq("registration_type", "PRE-REGISTERED");
      setGuestList(data);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filteredList = guestList.filter((guest) =>
      guest.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    console.log(filteredList);
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
        data-bs-backdrop="static"
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
                  Guest's Name:
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
                {loading ? (
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="list-group w-100">
                    {guestList.length > 0 ? (
                      filteredList.map((guest) => (
                        <button
                          key={guest.id}
                          type="button"
                          className="list-group-item list-group-item-action mb-2 fw-semibold"
                          aria-current="true"
                          data-bs-toggle="modal"
                          data-bs-dismiss="modal"
                          onClick={() => {
                            setActiveGuest(guest);
                            setShowModal(true);
                          }}
                        >
                          {guest.name}
                        </button>
                      ))
                    ) : (
                      <h5 className="mb-1">No Guest Found</h5>
                    )}
                  </div>
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

    {showModal && (
      <div
        className="modal fade show"
        id="exampleModalToggle3"
        style={{ display: "block" }}
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title fs-5"
                style={{ fontWeight: 700, fontSize: "1.25rem" }}
              >
                Confirm Attendance
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={activeGuest?.name}
                    onChange={(e) =>
                      setActiveGuest({ ...activeGuest, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="guest" className="form-label fw-semibold">Guest</label>
                  <input
                    type="text"
                    className="form-control"
                    id="guest"
                    value={activeGuest?.guest}
                    onChange={(e) =>
                      setActiveGuest({ ...activeGuest, guest: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="company_name" className="form-label fw-semibold">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="company_name"
                    value={activeGuest?.company_name}
                    onChange={(e) =>
                      setActiveGuest({
                        ...activeGuest,
                        company_name: e.target.value,
                      })
                    }
                  />
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

export default PreRegistered;
