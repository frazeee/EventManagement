import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../API/createClient";
import "./initial.css";
import Form from "./components/Form";
import background from "./assets/background.mp4";
import {
  IoMdPersonAdd,
  IoMdRemoveCircleOutline,
  IoMdList,
  IoMdLogOut,
} from "react-icons/io";
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
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getSession();
    fetchGuests();
  }, []);

  async function fetchGuests() {
    setLoading(true);
    const { data } = await supabase
      .from("guests_mariwasa")
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
        navigate("/");
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
      const { error } = await supabase
        .from("guests_mariwasa")
        .delete()
        .eq("id", id);

      if (error) {
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

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredGuests = guests.filter((guest) => {
    if (activeTab === "Pre Registered" && guest.reg_type !== "Pre-Registered") {
      return false;
    }
    if (activeTab === "Walk-in" && guest.reg_type !== "Walk-in") {
      return false;
    }
    if (attendanceState !== "all" && guest.attended !== attendanceState) {
      return false;
    }

    if (
      searchTerm !== "" &&
      !guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Pagination logic
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = filteredGuests.slice(
    indexOfFirstGuest,
    indexOfLastGuest,
  );
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = (current, total, siblingCount = 1) => {
    const totalNumbers = siblingCount * 2 + 5;
    if (total <= totalNumbers) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(current - siblingCount, 1);
    const rightSibling = Math.min(current + siblingCount, total);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < total - 1;

    const pages = [1];

    if (showLeftDots) pages.push("dots-left");
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== total) pages.push(i);
    }
    if (showRightDots) pages.push("dots-right");

    pages.push(total);

    return pages;
  };

  return (
    <div className="fade-in">
      <video src={background} autoPlay muted loop></video>
      <div className="container container-md mt-4">
        <div className="position-absolute top-0 start-0">
          <button
            className="btn btn-outline-primary mt-3 mx-3"
            onClick={() => navigate("/registration-list")}
          >
            Registrations <IoMdList />
          </button>
        </div>
        <div className="position-absolute top-0 end-0">
          <button
            className="btn btn-outline-danger mt-3 me-3"
            onClick={() => handleLogout()}
          >
            Logout <IoMdLogOut />
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
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 toolbar-row">
              <ul className="nav nav-tabs border-0 flex-nowrap">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "all" ? "active bg-primary text-white fw-bold" : "text-white"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setActiveTab("all");
                      setCurrentPage(1);
                    }}
                  >
                    All Guests
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "Pre Registered" ? "active bg-success text-white fw-bold" : "text-white"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setActiveTab("Pre Registered");
                      setCurrentPage(1);
                    }}
                  >
                    Pre-Registered
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "Walk-in" ? "active bg-success text-white fw-bold" : "text-white"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setActiveTab("Walk-in");
                      setCurrentPage(1);
                    }}
                  >
                    Walk-In
                  </a>
                </li>
              </ul>

              <input
                type="text"
                className="form-control search-input"
                id="guestSearch"
                placeholder="Search Guest details here..."
                data-bs-theme="dark"
                onChange={handleInputChange}
              />
            </div>

            {/* Only the table scrolls horizontally on mobile now — pagination
                lives outside this wrapper so it never scrolls out of view
                when you swipe. */}
            <div className="table-responsive guest-table-wrapper">
              <table
                className="table table-hover table-striped table-dark"
                style={{ tableLayout: "fixed" }}
              >
                <thead>
                  <tr className="text-center">
                    <th scope="col" style={{ width: "5%" }}>
                      #
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Guest Name
                    </th>
                     <th scope="col" style={{ width: "10%" }}>
                      Registration Type
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Company Name
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Designation
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Table Assignment
                    </th>
                      <th scope="col" style={{ width: "10%" }}>
                      Token Eligible
                    </th>
                    <th
                      scope="col"
                      style={{ width: "10%" }}
                      className="attended-col"
                    >
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle attended-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Has Attended
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                          <li>
                            <a
                              className="dropdown-item"
                              onClick={() => setAttendanceState(true)}
                            >
                              Yes
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              onClick={() => setAttendanceState(false)}
                            >
                              No
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              onClick={() => setAttendanceState("all")}
                            >
                              All
                            </a>
                          </li>
                        </ul>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="sticky-col"
                      style={{ width: "15%" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGuests.map((guest, index) => (
                    <tr className="text-center align-middle" key={guest.id}>
                      <td>{indexOfFirstGuest + index + 1}</td>
                      <td className="cell-truncate" title={guest.name}>
                        {guest.name}
                      </td>
                        <td className="cell-truncate" title={guest.reg_type}>
                        {guest.reg_type}
                      </td>
                      <td className="cell-truncate" title={guest.company_name}>
                        {guest.company_name}
                      </td>
                      <td className="cell-truncate" title={guest.designation}>
                        {guest.designation}
                      </td>
                      <td>{guest.table_number}</td>
                            <td
                        style={{
                          color: guest.token_eligible ? "#1d8655" : "#db3648",
                        }}
                      >
                        {guest.token_eligible ? "Yes" : "No"}
                      </td>
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
                  {currentGuests.length < guestsPerPage &&
                    Array.from({
                      length: guestsPerPage - currentGuests.length,
                    }).map((_, i) => (
                      <tr key={`filler-${i}`} className="filler-row">
                        <td colSpan={8}>&nbsp;</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <nav aria-label="Guest pagination" className="pagination-wrapper">
              <ul className="pagination justify-content-center mt-2">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
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
                {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                  typeof page === "string" ? (
                    <li key={page + idx} className="page-item disabled">
                      <span className="page-link">…</span>
                    </li>
                  ) : (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <a
                        href="#"
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </a>
                    </li>
                  ),
                )}
                <li
                  className={`page-item ${
                    currentPage === totalPages || totalPages === 0
                      ? "disabled"
                      : ""
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
    </div>
  );
};

export default Initial;
