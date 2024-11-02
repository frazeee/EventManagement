import React, { useState } from "react";
import { supabase } from "../../API/createClient";

const WalkIn = () => {
  const handleChange = (e) => {
    setGuest((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.id]: e.target.value,
      };
    });
  };

  const [guest, setGuest] = useState({
    name: "",
    guest: "",
    company_name: "",
  });

  async function createGuest() {
    await supabase.from("guests").insert({
      name: guest.name,
      guest: guest.guest,
      company_name: guest.company_name,
      registration_type: "WALK-IN",
    });
  }
  return (
    <div>
      <button
        type='button'
        className='btn btn-primary mx-2'
        data-bs-toggle='modal'
        data-bs-target='#staticBackdrop2'
      >
        Walk-In
      </button>

      <form></form>
      <div
        className='modal fade'
        id='staticBackdrop2'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabindex='-1'
        aria-labelledby='staticBackdropLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='staticBackdropLabel'>
                Register Walk-In Guest
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <form onSubmit={createGuest}>
                <div class='mb-3'>
                  <label for='name' class='form-label'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    class='form-control'
                    id='name'
                    name='name'
                    aria-describedby='name'
                    onChange={handleChange}
                    value={guest.name}
                  />
                </div>
                <div class='mb-3'>
                  <label for='guest' class='form-label'>
                    Guest
                  </label>
                  <input
                    type='text'
                    class='form-control'
                    id='guest'
                    name='guest'
                    aria-describedby='guest'
                    onChange={handleChange}
                    value={guest.guest}
                  />
                </div>
                <div class='mb-3'>
                  <label for='company_name' class='form-label'>
                    Company Name
                  </label>
                  <input
                    type='text'
                    class='form-control'
                    id='company_name'
                    name='company_name'
                    aria-describedby='company_name'
                    onChange={handleChange}
                    value={guest.company_name}
                  />
                </div>

                <button type='submit' class='btn btn-primary'>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkIn;
