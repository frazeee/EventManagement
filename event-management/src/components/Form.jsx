import React, { useState, useEffect } from "react";
import { supabase } from "../../API/createClient";
import Swal from "sweetalert2";
import { FaAngleDown } from "react-icons/fa6";

const Form = ({ guest: initialGuest }) => {
  const [guest, setGuest] = useState({
    name: "",
    company_name: "",
    reg_type: "",
    designation: "",
    table_number: "",
    token_eligible: "",
    raffle_eligible: "",
    attended: false,
  });

  useEffect(() => {
    if (initialGuest) {
      setGuest(initialGuest);
    }
  }, [initialGuest]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Convert string options back to actual booleans for state & Supabase
    let finalValue = value;
    if (value === "TRUE") finalValue = true;
    if (value === "FALSE") finalValue = false;

    setGuest((prevFormData) => ({
      ...prevFormData,
      [id]: finalValue,
    }));
  };

  const handleTypeChange = (type) => {
    setGuest((prevFormData) => ({
      ...prevFormData,
      reg_type: type,
    }));
  };

  const handleCheckboxChange = (e) => {
    setGuest((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.checked,
    }));
  };

  async function handleSubmit(e) {
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
        // FIXED: Added token_eligible to the update payload
        await supabase
          .from("guests_mariwasa")
          .update({
            name: guest.name,
            company_name: guest.company_name,
            designation: guest.designation,
            reg_type: guest.reg_type,
            table_number: guest.table_number,
            token_eligible: guest.token_eligible,
            raffle_eligible: guest.raffle_eligible,
            attended: guest.attended,
          })
          .eq("id", guest.id);
      } else {
        await supabase.from("guests_mariwasa").insert({
          name: guest.name,
          company_name: guest.company_name,
          designation: guest.designation,
          reg_type: guest.reg_type,
          table_number: guest.table_number,
          token_eligible: guest.token_eligible,
          raffle_eligible: guest.raffle_eligible,
          attended: guest.attended,
        });
      }

      Swal.fire({
        title: "Success!",
        text: "Guest information has been saved successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
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
        <label htmlFor="name" className="form-label">
          Full Name <span style={{ color: "red" }}> * </span>
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          placeholder="Enter Full Name"
          onChange={handleChange}
          value={guest.name}
          required
        />
      </div>

      <div className="mb-3" style={{ fontWeight: "600" }}>
        <label htmlFor="company_name" className="form-label">
          Company Name <span style={{ color: "red" }}> * </span>
        </label>
        <input
          type="text"
          className="form-control"
          id="company_name"
          placeholder="Enter Company Name"
          name="company_name"
          onChange={handleChange}
          value={guest.company_name}
          required
        />
      </div>

      <div className="mb-3" style={{ fontWeight: "600" }}>
        <label htmlFor="designation" className="form-label">
          Designation<span style={{ color: "red" }}> * </span>
        </label>
        <input
          type="text"
          className="form-control"
          id="designation"
          placeholder="Enter Designation"
          name="designation"
          onChange={handleChange}
          value={guest.designation}
          required
        />
      </div>

      <div className="mb-3" style={{ fontWeight: "600" }}>
        <label htmlFor="table_number" className="form-label">
          Table Number:
        </label>
        <input
          type="number"
          className="form-control"
          id="table_number"
          min="1"
          placeholder="Enter Table Number"
          name="table_number"
          onChange={handleChange}
          value={guest.table_number || ""}
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
          <option value="" disabled>Select Type</option>
          <option value="Pre-Registered">Pre-Registered</option>
          <option value="Walk-in">Walk-In</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="token_eligible" className="form-label fw-semibold">
          Token Eligible <span style={{ color: "red" }}> * </span>
        </label>
        <select
          className="form-select"
          // FIXED: Safeguard evaluation so it handles empty strings safely
          value={guest.token_eligible === true ? "TRUE" : guest.token_eligible === false ? "FALSE" : ""}
          onChange={handleChange}
          id="token_eligible"
          name="token_eligible"
          required
        >
          <option value="" disabled>Select Type</option>
          <option value="TRUE">Yes</option>
          <option value="FALSE">No</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="raffle_eligible" className="form-label fw-semibold">
          Raffle Eligible <span style={{ color: "red" }}> * </span>
        </label>
        <select
          className="form-select"
          // FIXED: Safeguard evaluation so it handles empty strings safely
          value={guest.raffle_eligible === true ? "TRUE" : guest.raffle_eligible === false ? "FALSE" : ""}
          onChange={handleChange}
          id="raffle_eligible"
          name="raffle_eligible"
          required
        >
          <option value="" disabled>Select Type</option>
          <option value="TRUE">Yes</option>
          <option value="FALSE">No</option>
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
          checked={guest.attended || false}
          onChange={handleCheckboxChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Form;