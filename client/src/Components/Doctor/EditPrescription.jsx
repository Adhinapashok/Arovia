import React from "react";
import "./Prescription.css";

function AddPrescription() {
  

  function handleSubmit(e) {
    e.preventDefault();
    // Form submit logic can be added later
  }

  return (
    <div className="prescription-wrapper">

      <div className="prescription-card">

        {/* Header */}
        <div className="top-header">
          <div>
            <h3>MD. ROBERT SMITH</h3>
            <p></p>
            <p className="speciality">ENDOCRINE DOCTOR</p>
            <span>phone No: 9876543210</span>
          </div>
          <div className="plus">+</div>
        </div>

        {/* Title */}
        <div className="center-heading">
          <h1>MEDICAL CENTER</h1>
          <p>COMPANY NAME</p>
          <h2>MEDICAL PRESCRIPTION FORM</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="row">
            <div className="field">
              <label>Patient Name</label>
              <input type="text" name="patientName" />
            </div>

            <div className="field">
              <label>Place</label>
              <input type="text" name="place" />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Date of Birth</label>
              <input type="date" name="dob" />
            </div>

            <div className="field">
              <label>Date</label>
              <input type="date" name="date" />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Age</label>
              <input type="text" name="age" />
            </div>

            <div className="field">
              <label>Gender</label>
              <input type="text" name="gender" />
            </div>
          </div>

          <div className="field full">
            <label>Diagnosis</label>
            <input type="text" name="diagnosis" />
          </div>

          <div className="rx-section">
            <h2>Rx:</h2>
            <textarea name="prescription"></textarea>
          </div>

          <div className="submit-section">
            <button type="submit">Submit Prescription</button>
          </div>

        </form>

        {/* Footer */}
        <div className="footer">
          <p>Phone: +01 2345 6789 | Email: clinic@email.com | www.yourwebsite.com</p>
          <p>Address: Lorem Ipsum Street, Dolor, Sit Amet 12345</p>
        </div>

      </div>

    </div>
  );
}

export default AddPrescription;