import React, { useEffect, useState } from "react";
import { supabase } from "../API/createClient";

import Form from "./components/form";

const Initial = () => {
  const [guests, setGuests] = useState([]);
  const [editingGuest, setEditingGuest] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  async function fetchGuests() {
    const { data } = await supabase.from("guests").select("*").order('id', { ascending: true });
    setGuests(data);
  }

  async function deleteGuest(id) {
    const { data, error } = await supabase.from("guests").delete().eq("id", id);

    if (error) {
      console.log("error", error);
    }

    fetchGuests();
  }

  return (
    <>
      <div className="container-md">
        <h1 className="text-center py-5">Guest List</h1>
        <table className="table table-hover">
          <thead>
            <tr className="text-center">
              <th scope="col"># </th>
              <th scope="col">Name</th>
              <th scope="col">Guest</th>
              <th scope="col">Company Name</th>
              <th scope="col" colSpan={2}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <tr className="text-center" key={guest.id}>
                <td>{index + 1}</td>
                <td>{guest.name}</td>
                <td>{guest.guest}</td>
                <td>{guest.company_name}</td>
                <td>
                  <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                    onClick={() => setEditingGuest(guest)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteGuest(guest.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Register
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Register Guest
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <Form />
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

        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editModalLabel">
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
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setEditingGuest(null)}
                >
                  Close
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