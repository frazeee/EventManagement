import React, { useState, useEffect } from "react";
import { supabase } from "../../API/createClient";
import Swal from "sweetalert2";
import { FaAngleDown } from "react-icons/fa6";

const Form = ({ guest: initialGuest }) => {
  const [guest, setGuest] = useState({
    name: "",
    guest: "",
    company_name: "",
    registration_type: "",
    email: "",
    number: "",
    designation: "",
    attended: false,
  });

  useEffect(() => {
    if (initialGuest) {
      setGuest(initialGuest);
    }
  }, [initialGuest]);

  const handleChange = (e) => {
    setGuest((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.id]: e.target.value,
      };
    });
  };

  const handleTypeChange = (type) => {
    setGuest((prevFormData) => ({
      ...prevFormData,
      registration_type: type,
    }));
  };

  const handleCheckboxChange = (e) => {
    console.log(guest);
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
        await supabase
          .from("guests_ct")
          .update({
            name: guest.name,
            email: guest.email,
            school: guest.school,
            reg_type: guest.reg_type,
            attended: guest.attended,
          })
          .eq("id", guest.id);
      } else {
        await supabase.from("guests_ct").insert({
          name: guest.name,
          email: guest.email,
          school: guest.school,
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
        <label htmlFor="name" className="form-label">
          Full Name <span style={{ color: "red" }}> * </span>
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

      <div className="mb-3" style={{ fontWeight: "600" }}>
        <label htmlFor="email" className="form-label">
          Email<span style={{ color: "red" }}> * </span>
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter Email"
          name="email"
          onChange={handleChange}
          value={guest.email}
          required
        />
      </div>

      <div className="mb-3" style={{ fontWeight: "600" }}>
        <label htmlFor="school" className="form-label">
          School<span style={{ color: "red" }}> * </span>
        </label>
        <input
          type="school"
          className="form-control"
          id="school"
          placeholder="Enter school"
          name="school"
          onChange={handleChange}
          value={guest.school}
          required
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

      {/* <div className='mb-3' style={{ fontWeight: "600" }}>
        <label htmlFor='number' className='form-label'>
          Number<span style={{ color: "red" }}> * </span>
        </label>
        <input
          type='text'
          className='form-control'
          id='number'
          placeholder='Enter Number'
          name='number'
          onChange={handleChange}
          value={guest.number}
          required
        />
      </div>

      <div className='mb-3' style={{ fontWeight: "600" }}>
        <label htmlFor='designation' className='form-label'>
          Designation<span style={{ color: "red" }}> * </span>
        </label>
        <input
          type='text'
          className='form-control'
          id='designation'
          placeholder='Enter Designation'
          name='designation'
          onChange={handleChange}
          value={guest.designation}
          required
        />
      </div> */}
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

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Form;
