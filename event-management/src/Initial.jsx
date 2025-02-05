import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../API/createClient";
import "./initial.css";
import Form from "./components/Form";
import background from "./assets/2ndbg.mp4";
import { IoMdPersonAdd, IoMdRemoveCircleOutline } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { LuFileSpreadsheet } from "react-icons/lu";

const Initial = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGuest, setEditingGuest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [guestsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [attendanceState, setAttendanceState] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getSession();
    fetchGuests();
  }, []);

  async function fetchGuests() {
    setLoading(true);
    const { data } = await supabase
      .from("guests_GC")
      .select("*")
      .order("id", { ascending: true });
    setGuests(data);
    setLoading(false);
  }

  async function getSession() {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/bsa-admin");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      localStorage.clear();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
      navigate("/");
    }
  }

  async function deleteGuest(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this guest?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("guests_GC").delete().eq("id", id);

      if (error) {
        console.log("error", error);
        Swal.fire("Error!", "There was a problem deleting the guest.", "error");
      } else {
        Swal.fire("Deleted!", "The guest has been deleted.", "success");
        fetchGuests();
      }
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredGuests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
    const conditionSuffix =
      attendanceState === "all"
        ? ""
        : attendanceState
        ? "_Attended"
        : "_NotAttended";
    const conditionPrefix = activeTab !== "all" ? `${activeTab}_` : "";
    const filename = `${conditionPrefix}GuestList${conditionSuffix}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const filteredGuests =
    activeTab === "all"
      ? guests.filter(
          (guest) =>
            attendanceState === "all" || guest.attended === attendanceState
        )
      : guests.filter((guest) => {
          if (activeTab === "Pre Registered") {
            return (
              guest.reg_type === "Pre Registered" &&
              (attendanceState === "all" || guest.attended === attendanceState)
            );
          } else if (activeTab === "Walk-in") {
            return (
              guest.reg_type === "Walk-in" &&
              (attendanceState === "all" || guest.attended === attendanceState)
            );
          }
        });

  // Pagination logic
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = filteredGuests.slice(
    indexOfFirstGuest,
    indexOfLastGuest
  );
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <video src={background} autoPlay muted loop></video>
      <div className="container container-md">
        <div className="position-absolute top-0 end-0">
          <button
            className="btn btn-outline-danger mt-3 me-3"
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </div>
        <h1 className="text-center py-4 titleText">Guest List</h1>
        <hr
          className="border border opacity-50 mx-auto"
          style={{ width: "100%" }}
        />
        <div className="d-flex justify-content-between mb-3">
          <text className="text-white opacity-75 guestText">
            Listed below are the current guests that have{" "}
            <span style={{ fontWeight: 700 }}>Pre-Registered</span> or are{" "}
            <span style={{ fontWeight: 700 }}>Walk-Ins!</span>
          </text>
          <div className="d-flex justify-content-between">
            <button className="btn btn-success me-2" onClick={exportToExcel}>
              Export to Excel{" "}
              <span>
                <LuFileSpreadsheet />
              </span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Register a Guest{" "}
              <span>
                <IoMdPersonAdd />
              </span>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "all"
                      ? "active bg-primary text-white fw-bold"
                      : "text-white"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("all")}
                >
                  All Guests
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "Pre Registered"
                      ? "active bg-success text-white fw-bold"
                      : "text-white"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("Pre Registered")}
                >
                  Pre-Registered
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    activeTab === "Walk-in"
                      ? "active bg-success text-white fw-bold"
                      : "text-white"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("Walk-in")}
                >
                  Walk-In
                </a>
              </li>
            </ul>
            <div className="table-responsive">
              <table className="table table-hover table-striped table-dark">
                <thead>
                  <tr className="text-center">
                    <th scope="col">#</th>
                    <th scope="col">Guest Name</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Guest Type</th>
                    <th scope="col">Table Assignment</th>
                    <div class="dropdown">
                      <button
                        class="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          backgroundColor: "transparent",
                          height: "55px",
                          border: "none",
                        }}
                      >
                        <th className="mx-1" scope="col">
                          Has Attended
                        </th>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-dark">
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => setAttendanceState(true)}
                          >
                            Yes
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => setAttendanceState(false)}
                          >
                            No
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => setAttendanceState("all")}
                          >
                            All
                          </a>
                        </li>
                      </ul>
                    </div>

                    <th scope="col" colSpan={2} className="sticky-col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGuests.map((guest, index) => (
                    <tr className="text-center align-middle" key={guest.id}>
                      <td>{indexOfFirstGuest + index + 1}</td>
                      <td>{guest.name}</td>
                      <td>{guest.company_name}</td>
                      <td>{guest.guest_type}</td>
                      <td>{guest.table_assignment}</td>
                      <td
                        style={{
                          color: guest.attended ? "#1d8655" : "#db3648",
                        }}
                      >
                        {guest.attended ? "Yes" : "No"}
                      </td>
                      <td className="sticky-col">
                        <div className="btn-group">
                          <button
                            className="btn btn-success text-nowrap btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#editModal"
                            onClick={() => setEditingGuest(guest)}
                          >
                            Edit{" "}
                            <span>
                              <FiEdit />
                            </span>
                          </button>
                          <button
                            className="btn btn-danger text-nowrap btn-sm"
                            onClick={() => deleteGuest(guest.id)}
                          >
                            Delete{" "}
                            <span>
                              <IoMdRemoveCircleOutline />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav
                aria-label="Guest pagination"
                style={{ position: "relative", zIndex: 1 }}
              >
                <ul className="pagination justify-content-center mt-1">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    >
                      Previous
                    </a>
                  </li>
                  {[...Array(totalPages).keys()].map((page) => (
                    <li
                      key={page + 1}
                      className={`page-item ${
                        currentPage === page + 1 ? "active" : ""
                      }`}
                    >
                      <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page + 1);
                        }}
                      >
                        {page + 1}
                      </a>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id="exampleModalLabel"
                  style={{ fontWeight: 700 }}
                >
                  Register Guest
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ color: "white" }}
                ></button>
              </div>
              <div className="modal-body">
                <Form />
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id="editModalLabel"
                  style={{ fontWeight: 700 }}
                >
                  Edit Guest
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setEditingGuest(null)}
                ></button>
              </div>
              <div className="modal-body">
                <Form guest={editingGuest} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Initial;
