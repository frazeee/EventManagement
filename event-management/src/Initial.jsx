import React, { useEffect, useState } from "react";
import { supabase } from "../API/createClient";

import Form from "./components/form";

const App = () => {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    fetchGuests();
  }, []);

  async function fetchGuests() {
    const { data } = await supabase.from("guests").select("*");
    // console.log("data", data);

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
      <div>
        <h1>Guest List</h1>
        <table class="table table-hover ">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Guest</th>
              <th scope="col">Comapny Name</th>
              <th scope="col" colSpan={2}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <tr key={guest.id}>
                <td>{index + 1}</td>
                <td>{guest.name}</td>
                <td>{guest.guest}</td>
                <td>{guest.company_name}</td>
                <td>
                  <button class="btn btn-success" onClick={<Form />}>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    class="btn btn-danger"
                    onClick={() => {
                      deleteGuest(guest.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Register
      </button>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Register Guest
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <Form />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
