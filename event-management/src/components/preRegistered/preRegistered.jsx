import React, { useState, useEffect } from "react";
import { supabase } from "../../../API/createClient";
import { IoMdSearch } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import preRegisterImage from "../../assets/pre-register.png";

const PreRegistered = () => {
  const [searchInput, setSearchInput] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [activeGuest, setActiveGuest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    getRequestList();
  }, []);

  const getRequestList = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guests_ct")
        .select(`*`)
        .eq("reg_type", "Pre Registered");
      setGuestList(data || []);
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

    setFilteredList(filteredList);
  }, [searchInput, guestList]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const currentGuests = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^(09\d{9}|\+63\d{10})$/;

    // if (!phoneRegex.test(activeGuest.number)) {
    //   Swal.fire({
    //     title: "Error",
    //     text: "Please enter a valid Philippine phone number (e.g., 09123456789 or +63123456789).",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //   });
    //   return;
    // }

    try {
      await supabase
        .from("guests_ct")
        .update({
          name: activeGuest.name,
          // designation: activeGuest.designation,
          // company_name: activeGuest.company_name,
          email: activeGuest.email,
          school: activeGuest.school,
          // number: activeGuest.number,
          // ePLDT_contact: activeGuest.ePLDT_contact,
          // isWithICTProvider: activeGuest.isWithICTProvider,
          attended: true,
        })

        .eq("id", activeGuest.id);
      getRequestList();
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to register guest. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setShowModal(false);
      setActiveGuest({ name: "", email: "", school: "" });
      Swal.fire({
        title: "Success!",
        text: "Guest registered successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <div
        className='card text-bg-dark mx-auto mb-4'
        style={{
          width: "100%",
          cursor: "pointer",
        }}
        data-bs-toggle='modal'
        data-bs-target='#staticBackdrop'
        data-bs-backdrop='static'
      >
        <img
          src={preRegisterImage}
          className='card-img-top img-fluid'
          alt='Pre-Registered icon'
          style={{
            width: "100%",
            margin: "0 auto",
          }}
        />
        <div className='card-body'>
          <h5 className='card-title text-center' style={{ fontWeight: 700 }}>
            Pre-Registered
          </h5>
          <hr className='mx-auto' style={{ maxWidth: "18rem" }} />
          <p className='card-text text-center mb-4'>
            Click here to see and edit the list of <br />
            <span style={{ fontWeight: 700 }}>Pre-Registered</span>{" "}
            participants!
          </p>
        </div>
      </div>

      <div
        className='modal fade'
        id='staticBackdrop'
        data-bs-keyboard='false'
        aria-labelledby='staticBackdropLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1
                className='modal-title fs-5'
                id='staticBackdropLabel'
                style={{ fontWeight: 700, fontSize: "1.25rem" }}
              >
                Search Pre-Registered Guest
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <div className='mb-3'>
                <label htmlFor='guestSearch' className='form-label fw-semibold'>
                  Guest's Name:
                </label>
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder="Search for Guest's Name..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    id='guestSearch'
                  />
                  <span className='input-group-text' id='basic-addon2'>
                    <IoMdSearch />
                  </span>
                </div>
              </div>
              <hr />
              <div className='list-group w-100'>
                <label htmlFor='' className='form-label fw-semibold'>
                  Guest List:
                </label>
                {loading ? (
                  <div className='d-flex justify-content-center'>
                    <div className='spinner-border' role='status'>
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className='list-group w-100'>
                    {currentGuests.length > 0 ? (
                      currentGuests.map((guest) => (
                        <button
                          key={guest.id}
                          type='button'
                          className='list-group-item list-group-item-action mb-2 fw-semibold d-flex justify-content-between align-items-center'
                          aria-current='true'
                          data-bs-toggle='modal'
                          data-bs-dismiss='modal'
                          onClick={() => {
                            setActiveGuest(guest);
                            setShowModal(true);
                          }}
                        >
                          {guest.name}
                          <span className='arrow-placeholder'>
                            <FaArrowRight />
                          </span>
                        </button>
                      ))
                    ) : (
                      <h5 className='mb-1'>No Guest Found</h5>
                    )}
                  </div>
                )}
              </div>
              <div className='d-flex justify-content-between align-items-center mt-3'>
                <button
                  className='btn btn-outline-primary'
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className='btn btn-outline-primary'
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-danger'
                data-bs-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className='modal fade show'
          id='exampleModalToggle3'
          style={{ display: "block" }}
          data-bs-backdrop='static'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5
                  className='modal-title fs-5'
                  style={{ fontWeight: 700, fontSize: "1.25rem" }}
                >
                  Confirm Attendance
                </h5>
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className='modal-body'>
                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <label htmlFor='name' className='form-label fw-semibold'>
                      Name
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='name'
                      value={activeGuest?.name || ""}
                      onChange={(e) =>
                        setActiveGuest({ ...activeGuest, name: e.target.value })
                      }
                    />
                  </div>
                  {/* <div className='mb-3'>
                    <label
                      htmlFor='designation'
                      className='form-label fw-semibold'
                    >
                      Designation
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='designation'
                      value={activeGuest?.designation || ""}
                      onChange={(e) =>
                        setActiveGuest({
                          ...activeGuest,
                          designation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='mb-3'>
                    <label
                      htmlFor='company_name'
                      className='form-label fw-semibold'
                    >
                      Company Name
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='company_name'
                      value={activeGuest?.company_name || ""}
                      onChange={(e) =>
                        setActiveGuest({
                          ...activeGuest,
                          company_name: e.target.value,
                        })
                      }
                    />
                  </div> */}
                  <div className='mb-3'>
                    <label htmlFor='email' className='form-label fw-semibold'>
                      Email
                    </label>
                    <input
                      type='email'
                      className='form-control'
                      id='email'
                      value={activeGuest?.email || ""}
                      onChange={(e) =>
                        setActiveGuest({
                          ...activeGuest,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='school' className='form-label fw-semibold'>
                      School
                    </label>
                    <input
                      type='school'
                      className='form-control'
                      id='school'
                      value={activeGuest?.school || ""}
                      onChange={(e) =>
                        setActiveGuest({
                          ...activeGuest,
                          school: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* <div className='mb-3'>
                    <label htmlFor='number' className='form-label fw-semibold'>
                      Mobile Number
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='number'
                      value={activeGuest?.number || ""}
                      onChange={(e) =>
                        setActiveGuest({
                          ...activeGuest,
                          number: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='guest' className='form-label fw-semibold'>
                      e/PLDT Contact
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      value={activeGuest?.ePLDT_contact || ""}
                      onChange={(e) =>
                        setActiveGuest({
                          ...activeGuest,
                          ePLDT_contact: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='guest' className='form-label fw-semibold'>
                      Working with an ICT Provider
                    </label>
                    <select
                      className='form-control'
                      value={activeGuest.isWithICTProvider || ""}
                      onChange={(e) =>
                        setActiveGuest({
                          ...activeGuest,
                          isWithICTProvider: e.target.value,
                        })
                      }
                    >
                      <option value={"Yes, With ePLDT"}>Yes, With ePLDT</option>
                      <option value={"Yes, but with other provider/s"}>
                        Yes, but with other provider/s
                      </option>
                      <option value={"No"}>No</option>
                    </select>
                     
                  </div> */}

                  <div className='modal-footer'>
                    <button type='submit' className='btn btn-primary'>
                      Submit
                    </button>
                    <button
                      type='button'
                      className='btn btn-outline-danger'
                      data-bs-dismiss='modal'
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

export default PreRegistered;
