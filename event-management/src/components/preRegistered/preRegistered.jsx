import React from "react";
import { useState, useEffect } from "react";
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
    console.log(filteredList);
  }, [searchInput]);

  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-primary mx-2"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          Pre-Registered
        </button>

        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
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
                <div class="mb-3">
                  <label
                    for="exampleInputEmail1"
                    class="form-label fw-semibold"
                  >
                    Guest's Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                  ></input>
                </div>

                <div class="list-group w-100">
                  {guestList.length > 0 ? (
                    filteredList.map((guest) => (
                      <div key={guest.id} class="list-group-item">
                        <button
                          type="button"
                          class="list-group-item list-group-item-action"
                          data-bs-toggle="modal"
                          data-bs-target="#edit-modal"
                          data-bs-dismiss="modal"
                        >
                          {guest.name}
                        </button>
                      </div>
                    ))
                  ) : (
                    <h5 class="mb-1">No Guest Found</h5>
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
          
          <div class="modal" id="edit-modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Modal title</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <p>Modal body text goes here.</p>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreRegistered;
