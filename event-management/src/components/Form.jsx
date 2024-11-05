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

    console.log("number",guest.number);
    const phoneRegex = /^(09\d{9}|\+63\d{10})$/;

    
    if (!phoneRegex.test(guest.number)) {
      Swal.fire({
        title: "Error",
        text: "Please enter a valid Philippine phone number (e.g., 09123456789 or +63123456789).",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    
    if (!guest.registration_type) {
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
          .from("guests")
          .update({
            name: guest.name,
            guest: guest.guest,
            company_name: guest.company_name,
            registration_type: guest.registration_type,
            email: guest.email,
            number: guest.number,
          })
          .eq("id", guest.id);
      } else {
        await supabase.from("guests").insert({
          name: guest.name,
          guest: guest.guest,
          company_name: guest.company_name,
          registration_type: guest.registration_type,
          email: guest.email,
          number: guest.number,
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

      <div className='mb-3'>
        <label htmlFor='registration_type' className='form-label'>
          Type <span style={{ color: "red" }}> * </span>
        </label>
        <div className='dropdown'>
          <button
            className='btn btn-outline-dark w-100 text-start d-flex justify-content-between'
            type='button'
            id='dropdownMenuButton'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            <span>{guest.registration_type || "Select Type"}</span>
            <span className='arrow-placeholder ms-auto'>
              <FaAngleDown />
            </span>
          </button>
          <ul
            className='dropdown-menu w-100'
            aria-labelledby='dropdownMenuButton'
          >
            <li>
              <button
                className='dropdown-item'
                type='button'
                onClick={() => handleTypeChange("PRE-REGISTERED")}
              >
                Pre-Register
              </button>
            </li>
            <li>
              <button
                className='dropdown-item'
                type='button'
                onClick={() => handleTypeChange("WALK-IN")}
              >
                Walk-In
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className='mb-3' style={{ fontWeight: "600" }}>
        <label htmlFor='email' className='form-label'>
          Email: <span style={{ color: "red" }}> * </span>
        </label>
        <input
          type='email'
          className='form-control'
          id='email'
          placeholder='Enter Email'
          name='email'
          onChange={handleChange}
          value={guest.email}
          required
        />
      </div>

      <div className='mb-3' style={{ fontWeight: "600" }}>
        <label htmlFor='number' className='form-label'>
          Number: <span style={{ color: "red" }}> * </span>
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

      <button type='submit' className='btn btn-primary'>
        Submit
      </button>
    </form>
  );
};

export default Form;
