import React, { useState } from "react";

const EditPreReg = ({ preReg }) => {
  const [guest, setGuest] = useState(preReg);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div key={guest.id} class="list-group-item">
        <button
          type="button"
          class="list-group-item list-group-item-action"
          aria-current="true"
          data-bs-toggle="edit-modal"
          data-bs-target="edit-modal"
        >
          {guest.name}
        </button>
      </div>

      <div class="modal edit-modal" id="edit-modal" tabindex="0">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modal title</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPreReg;
