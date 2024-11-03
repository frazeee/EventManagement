import React, { useState, useEffect } from "react";
import { supabase } from "../../API/createClient";

const Form = ({ guest: initialGuest }) => {

  const [guest, setGuest] = useState({
    name: "",
    guest: "",
    company_name: ""
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
        [e.target.id]: e.target.value
      };
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (initialGuest) {
      await supabase
        .from("guests")
        .update({
          name: guest.name,
          guest: guest.guest,
          company_name: guest.company_name
        })
        .eq("id", guest.id);
    } else {
      await supabase.from("guests").insert({
        name: guest.name,
        guest: guest.guest,
        company_name: guest.company_name
      });
    }
    e.target.submit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Full Name <span style={{color:"red"}}>  * </span>
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          aria-describedby="name"
          onChange={handleChange}
          value={guest.name}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="guest" className="form-label">
          Guest
        </label>
        <input
          type="text"
          className="form-control"
          id="guest"
          name="guest"
          aria-describedby="guest"
          onChange={handleChange}
          value={guest.guest}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="company_name" className="form-label">
          Company Name <span style={{color:"red"}}>  * </span>
        </label>
        <input
          type="text"
          className="form-control"
          id="company_name"
          name="company_name"
          aria-describedby="company_name"
          onChange={handleChange}
          value={guest.company_name}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Form;