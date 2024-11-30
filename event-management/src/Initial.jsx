import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../API/createClient";
import "./initial.css";
import Form from "./components/Form";
import background from "./assets/background.mp4";
import { IoMdPersonAdd, IoMdRemoveCircleOutline } from "react-icons/io";
import { FiEdit } from "react-icons/fi";

const Initial = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGuest, setEditingGuest] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  async function fetchGuests() {
    setLoading(true);
    const { data } = await supabase
      .from("guests")
      .select("*")
      .order("id", { ascending: true });
    setGuests(data);
    setLoading(false);
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
      const { error } = await supabase.from("guests").delete().eq("id", id);

      if (error) {
        console.log("error", error);
        Swal.fire("Error!", "There was a problem deleting the guest.", "error");
      } else {
        Swal.fire("Deleted!", "The guest has been deleted.", "success");
        fetchGuests();
      }
    }
  }

  return (
    <>
      <video src={background} autoPlay muted loop></video>
      <div className="container container-md">
        <h1 className="text-center py-4 titleText">Guest List</h1>
        <hr
          className="border border opacity-50 mx-auto "
          style={{ width: "100%" }}
        />
        <div className="d-flex justify-content-between mb-3">
          <text className="text-white opacity-75 guestText">
            Listed below are the current guests that have{" "}
            <span style={{ fontWeight: 700 }}>Pre-Registered</span> or are{" "}
            <span style={{ fontWeight: 700 }}>Walk-Ins!</span>
          </text>
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

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped table-dark">
              <thead>
                <tr className="text-center">
                  <th scope="col">#</th>
                  <th scope="col">Guest Name</th>
                  <th scope="col">Company Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Number</th>
                  <th scope="col">ePLDT Representative</th>              
                  <th scope="col">Status</th>               
                  <th scope="col" colSpan={2} className="sticky-col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest, index) => (
                  <tr className="text-center" key={guest.id}>
                    <td>{index + 1}</td>
                    <td>{guest.name}</td>
                    <td>{guest.company_name}</td>
                    <td>{guest.email}</td>
                    <td>{guest.designation}</td>
                    <td>{guest.number}</td>
                    <td>{guest.guest}</td>                   
                    <td>{guest.registration_type}</td>                 
                    <td className="sticky-col">
                      <div className="d-flex justify-content-evenly">
                        <button
                          className="btn btn-success"
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
                          className="btn btn-danger"
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
          </div>
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={() => setEditingGuest(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Initial;
