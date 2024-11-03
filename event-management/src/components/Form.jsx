import React, { useState, useEffect } from "react";
import { supabase } from "../../API/createClient";
import Swal from "sweetalert2";
const Form = ({ guest: initialGuest }) => {
  const [guest, setGuest] = useState({
    name: "",
    guest: "",
    company_name: "",
    registration_type: "",
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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (initialGuest) {
        await supabase
          .from("guests")
          .update({
            name: guest.name,
            guest: guest.guest,
            company_name: guest.company_name,
            registration_type: guest.registration_type,
          })
          .eq("id", guest.id);
      } else {
        await supabase.from("guests").insert({
          name: guest.name,
          guest: guest.guest,
          company_name: guest.company_name,
          registration_type: guest.registration_type,
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
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Full Name <span style={{ color: "red" }}> * </span>
        </label>
        <input
          type='text'
          className='form-control'
          id='name'
          name='name'
          placeholder='Enter Full Name'
          aria-describedby='name'
          onChange={handleChange}
          value={guest.name}
          required
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='guest' className='form-label'>
          Guest
        </label>
        <input
          type='text'
          className='form-control'
          id='guest'
          name='guest'
          placeholder='Enter Guest Name'
          aria-describedby='guest'
          onChange={handleChange}
          value={guest.guest}
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='company_name' className='form-label'>
          Company Name <span style={{ color: "red" }}> * </span>
        </label>
        <input
          type='text'
          className='form-control'
          id='company_name'
          name='company_name'
          placeholder='Enter Company Name'
          aria-describedby='company_name'
          onChange={handleChange}
          value={guest.company_name}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="registration_type" className="form-label">
          Type
        </label>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {guest.registration_type || "Select Type"}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => handleTypeChange("PRE-REGISTERED")}
              >
                Pre Register
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => handleTypeChange("WALK-IN")}
              >
                Walk In
              </button>
            </li>
          </ul>
        </div>
      </div>

      <button type='submit' className='btn btn-primary'>
        Submit
      </button>
    </form>
  );
};

export default Form;
