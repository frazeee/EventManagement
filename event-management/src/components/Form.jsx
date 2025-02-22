import React, { useState, useEffect } from "react";
import { supabase } from "../../API/createClient";
import Swal from "sweetalert2";
import { FaAngleDown } from "react-icons/fa6";

const Form = ({ guest: initialGuest }) => {
  const [guest, setGuest] = useState({
    name: "",
    company_name: "",
    guest_type: "",
    table_assignment: "",
    reg_type: "",
    attended: false,
  });

  useEffect(() => {
    if (initialGuest) {
      setGuest(initialGuest);
    }
  }, [initialGuest]);

  const handleChange = (e) => {
    setGuest((prevFormData) => {
      console.log(guest);
      return {
        ...prevFormData,
        [e.target.id]: e.target.value,
      };
    });
  };

  const handleCheckboxChange = (e) => {
    setGuest((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.checked,
    }));
  };

  const handleTypeChange = (type) => {
    setGuest((prevFormData) => ({
      ...prevFormData,
      reg_type: type,
    }));
  };

  async function handleSubmit(e) {
    let response;
    e.preventDefault();

    if (!guest.reg_type) {
      Swal.fire({
        title: "Error",
        text: "Please select a registration type.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      if (initialGuest) {
        response = await supabase
          .from("guests_GC")
          .update({
            name: guest.name,
            company_name: guest.company_name,
            guest_type: guest.guest_type,
            table_assignment: guest.table_assignment,
            reg_type: guest.reg_type,
            attended: guest.attended,
          })
          .eq("id", guest.id);
      } else {
        response = await supabase.from("guests_GC").insert({
          name: guest.name,
          company_name: guest.company_name,
          guest_type: guest.guest_type,
          table_assignment: guest.table_assignment,
          reg_type: guest.reg_type,
          attended: guest.attended,
        });
      }

      Swal.fire({
        title: "Success!",
        text: "Guest information has been saved successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Reload the page to refresh the data and close the modal
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "There was an issue saving the guest information.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fw-semibold">
          Name <span style={{ color: "red" }}> * </span>
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          placeholder="Enter Full Name"
          aria-describedby="name"
          onChange={handleChange}
          value={guest.name}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="company_name" className="form-label fw-semibold">
          Company Name <span style={{ color: "red" }}> * </span>
        </label>
        <input
          type="text"
          className="form-control"
          id="company_name"
          name="company_name"
          placeholder="Enter Company Name"
          aria-describedby="company_name"
          onChange={handleChange}
          value={guest.company_name}
          required
        />
      </div>
      <div className="mb-3" style={{ fontWeight: "600" }}>
        <label htmlFor="designation" className="form-label fw-semibold">
          Guest Type
          {/* <span style={{ color: "red" }}> * </span> */}
        </label>
        <input
          type="text"
          className="form-control"
          id="guest_type"
          placeholder="Enter Guest Type (VIP/Regular)"
          name="guest_type"
          onChange={handleChange}
          value={guest.guest_type}
          
        />
      </div>
      <div className="mb-3">
        <label htmlFor="ePLDT_contact" className="form-label fw-semibold">
          Table Assignment
        </label>
        <input
          type="number"
          className="form-control"
          id="table_assignment"
          name="table_assignment"
          placeholder="Enter Table Number"
          aria-describedby="guest"
          onChange={handleChange}
          value={guest.table_assignment}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="reg_type" className="form-label fw-semibold">
          Registration Type <span style={{ color: "red" }}> * </span>
        </label>
        <select
          className="form-select"
          value={guest.reg_type || ""}
          onChange={handleChange}
          id="reg_type"
          name="reg_type"
          required
        >
          <option value="" disabled>
            Select Type
          </option>
          <option value="Pre Registered">Pre Register</option>
          <option value="Walk-in">Walk-In</option>
        </select>
      </div>
      <div className="mb-3 form-check form-switch">
        <label className="form-check-label" htmlFor="attended">
          Has Attended?
        </label>
        <input
          className="form-check-input"
          type="checkbox"
          id="attended"
          name="attended"
          checked={guest.attended}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn btn-danger"
          data-bs-dismiss="modal"
          onClick={() => setEditingGuest(null)}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
