// AddPrescription.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Prescription.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AddPrescription() {
  const location = useLocation();
  const user = location.state;
  const navigate = useNavigate();
  const prescriptionRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.user?.name || "",
    place: user?.user?.place || "",
    date: user?.date || "",
    dob: user?.user?.dob || "",
    age: "",
    gender: user?.user?.gender || "",
    diagnosis: "",
    prescription: "",
    drname: user?.schedule?.doctor?.name || "",
    phone: user?.schedule?.doctor?.mobile || "",
    specialization: user?.schedule?.doctor?.specialization || "",
    bookingId: user?._id || ""
  });

  const [existingPrescription, setExistingPrescription] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch existing prescription if any
  const fetchExistingPrescription = async () => {
    try {
      const res = await axios.get(`${apiUrl}drviewprescrpition/${user._id}`);
      if (res.data && res.data.Diagnosis) {
        setExistingPrescription(res.data);
        setFormData(prev => ({
          ...prev,
          diagnosis: res.data.Diagnosis || "",
          prescription: res.data.Prescription || ""
        }));
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching prescription:", error);
    }
  };

  useEffect(() => {
    if (user && user.user?.dob) {
      const calculatedAge = calculateAge(user.user.dob);
      setFormData(prev => ({ ...prev, age: calculatedAge }));
    }
    if (user) {
      fetchExistingPrescription();
    }
  }, [user]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required";
    }
    if (!formData.prescription.trim()) {
      newErrors.prescription = "Prescription is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(`${apiUrl}draddpres`, {
        Diagnosis: formData.diagnosis,
        Pres: formData.prescription,
        booking: user._id
      });

      if (res.data.status === "ok") {
        alert(isEditing ? "Prescription updated successfully!" : "Prescription added successfully!");
        navigate('/drhome/viewdrbook');
      } else {
        alert(res.data.message || "Error saving prescription");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    
    // Create print content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Medical Prescription - ${formData.name}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', 'Tahoma', Geneva, Verdana, sans-serif;
              background: white;
              padding: 40px;
            }
            
            .print-container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            /* Header */
            .print-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            
            .hospital-info {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            
            .hospital-logo {
              width: 60px;
              height: 60px;
              background: rgba(255,255,255,0.2);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 28px;
            }
            
            .hospital-details h2 {
              font-size: 28px;
              margin-bottom: 5px;
            }
            
            .hospital-details p {
              font-size: 12px;
              opacity: 0.9;
            }
            
            .doctor-info {
              text-align: right;
            }
            
            .doctor-info h3 {
              font-size: 20px;
              margin-bottom: 5px;
            }
            
            .doctor-info .specialty {
              font-size: 14px;
              margin-bottom: 5px;
            }
            
            .doctor-info .contact {
              font-size: 12px;
            }
            
            /* Title */
            .print-title {
              text-align: center;
              padding: 25px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .print-title h1 {
              font-size: 28px;
              color: #1f2937;
              margin-bottom: 10px;
              letter-spacing: 2px;
            }
            
            .title-decoration {
              width: 80px;
              height: 3px;
              background: linear-gradient(90deg, #667eea, #764ba2);
              margin: 0 auto;
            }
            
            /* Patient Info */
            .print-section {
              padding: 25px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .section-header {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .section-header i {
              font-size: 20px;
              color: #667eea;
            }
            
            .section-header h3 {
              font-size: 18px;
              color: #374151;
              margin: 0;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            
            .info-field {
              padding: 5px;
            }
            
            .info-field .label {
              font-size: 11px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            
            .info-field .value {
              font-size: 14px;
              color: #1f2937;
              font-weight: 500;
            }
            
            /* Diagnosis & Prescription */
            .diagnosis-content, .prescription-content {
              margin-top: 10px;
              line-height: 1.6;
              color: #374151;
              font-size: 14px;
              white-space: pre-wrap;
            }
            
            .prescription-content {
              font-family: monospace;
              background: #f9fafb;
              padding: 15px;
              border-radius: 8px;
            }
            
            /* Footer */
            .print-footer {
              padding: 25px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              background: #f9fafb;
            }
            
            .signature-line {
              text-align: left;
            }
            
            .signature-line .line {
              font-size: 16px;
              margin-bottom: 5px;
            }
            
            .signature-line .label {
              font-size: 11px;
              color: #6b7280;
            }
            
            .print-date {
              font-size: 12px;
              color: #6b7280;
              display: flex;
              align-items: center;
              gap: 5px;
            }
            
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              .print-container {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Header -->
            <div class="print-header">
              <div class="hospital-info">
                <div class="hospital-logo">
                  <i class="fas fa-hospital-user"></i>
                </div>
                <div class="hospital-details">
                  <h2>AROVIA</h2>
                  <p>Healthcare Excellence</p>
                </div>
              </div>
              <div class="doctor-info">
                <h3>Dr. ${formData.drname}</h3>
                <p class="specialty">${formData.specialization}</p>
                <p class="contact">Phone: ${formData.phone}</p>
              </div>
            </div>

            <!-- Title -->
            <div class="print-title">
              <h1>MEDICAL PRESCRIPTION</h1>
              <div class="title-decoration"></div>
            </div>

            <!-- Patient Information -->
            <div class="print-section">
              <div class="section-header">
                <i class="fas fa-user-injured"></i>
                <h3>Patient Information</h3>
              </div>
              <div class="info-grid">
                <div class="info-field">
                  <div class="label">Patient Name</div>
                  <div class="value">${formData.name}</div>
                </div>
                <div class="info-field">
                  <div class="label">Place / City</div>
                  <div class="value">${formData.place || "Not specified"}</div>
                </div>
                <div class="info-field">
                  <div class="label">Date of Birth</div>
                  <div class="value">${new Date(formData.dob).toLocaleDateString()}</div>
                </div>
                <div class="info-field">
                  <div class="label">Age / Gender</div>
                  <div class="value">${formData.age} years / ${formData.gender}</div>
                </div>
                <div class="info-field">
                  <div class="label">Visit Date</div>
                  <div class="value">${new Date(formData.date).toLocaleDateString()}</div>
                </div>
                <div class="info-field">
                  <div class="label">Prescription ID</div>
                  <div class="value">#PR-${user?._id?.slice(-6) || "000001"}</div>
                </div>
              </div>
            </div>

            <!-- Diagnosis -->
            <div class="print-section">
              <div class="section-header">
                <i class="fas fa-stethoscope"></i>
                <h3>Diagnosis</h3>
              </div>
              <div class="diagnosis-content">${formData.diagnosis.replace(/\n/g, '<br>')}</div>
            </div>

            <!-- Prescription -->
            <div class="print-section">
              <div class="section-header">
                <i class="fas fa-prescription"></i>
                <h3>Prescription (Rx)</h3>
              </div>
              <div class="prescription-content">${formData.prescription.replace(/\n/g, '<br>')}</div>
            </div>

            <!-- Footer -->
            <div class="print-footer">
              <div class="signature-line">
                <div class="line">_____________________</div>
                <div class="label">Doctor's Signature</div>
              </div>
              <div class="print-date">
                <i class="fas fa-calendar-check"></i>
                Date: ${new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        setIsPrinting(false);
      };
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <div className="prescription-error">
        <i className="fas fa-exclamation-circle"></i>
        <h2>No Booking Selected</h2>
        <p>Please select a booking to add prescription</p>
        <button onClick={() => navigate('/drhome/viewdrbook')}>Back to Bookings</button>
      </div>
    );
  }

  return (
    <div className="prescription-wrapper">
      <div className="prescription-card" ref={prescriptionRef}>
        {/* Header */}
        <div className="prescription-header">
          <div className="hospital-info">
            <div className="hospital-logo">
              <i className="fas fa-hospital-user"></i>
            </div>
            <div className="hospital-details">
              <h2>AROVIA</h2>
              <p>Healthcare Excellence</p>
            </div>
          </div>
          <div className="doctor-info">
            <h3>Dr. {formData.drname}</h3>
            <p className="specialty">{formData.specialization}</p>
            <p className="contact">
              <i className="fas fa-phone"></i> {formData.phone}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="prescription-title">
          <h1>MEDICAL PRESCRIPTION</h1>
          <div className="title-decoration"></div>
        </div>

        {/* Patient Info Section */}
        <div className="patient-info-section">
          <div className="section-header">
            <i className="fas fa-user-injured"></i>
            <h3>Patient Information</h3>
          </div>
          <div className="info-grid">
            <div className="info-field">
              <label>Patient Name</label>
              <p>{formData.name}</p>
            </div>
            <div className="info-field">
              <label>Place / City</label>
              <p>{formData.place || "Not specified"}</p>
            </div>
            <div className="info-field">
              <label>Date of Birth</label>
              <p>{formatDate(formData.dob)}</p>
            </div>
            <div className="info-field">
              <label>Age / Gender</label>
              <p>{formData.age} years / {formData.gender}</p>
            </div>
            <div className="info-field">
              <label>Visit Date</label>
              <p>{formatDate(formData.date)}</p>
            </div>
            <div className="info-field">
              <label>Prescription ID</label>
              <p>#PR-{user._id?.slice(-6) || "000001"}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis Section */}
        <div className="diagnosis-section">
          <div className="section-header">
            <i className="fas fa-stethoscope"></i>
            <h3>Diagnosis</h3>
          </div>
          <div className="diagnosis-field">
            <textarea
              name="diagnosis"
              rows="3"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis details..."
              className={errors.diagnosis ? "error" : ""}
            />
            {errors.diagnosis && <span className="error-message">{errors.diagnosis}</span>}
          </div>
        </div>

        {/* Prescription Section */}
        <div className="prescription-section">
          <div className="section-header">
            <i className="fas fa-prescription"></i>
            <h3>Prescription (Rx)</h3>
          </div>
          <div className="prescription-field">
            <textarea
              name="prescription"
              rows="8"
              value={formData.prescription}
              onChange={handleChange}
              placeholder="Enter prescription details...
Example:
1. Tablet Paracetamol 500mg - Twice daily after meals for 5 days
2. Syrup Cough Syrup - 10ml thrice daily for 3 days
3. Rest and plenty of fluids"
              className={errors.prescription ? "error" : ""}
            />
            {errors.prescription && <span className="error-message">{errors.prescription}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="prescription-footer">
          <div className="footer-left">
            <div className="signature-line">
              <p>_____________________</p>
              <span>Doctor's Signature</span>
            </div>
          </div>
          <div className="footer-right">
            <p>
              <i className="fas fa-calendar-check"></i>
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons1">
          <button type="button" className="print-btn" onClick={handlePrint} disabled={isPrinting}>
            <i className="fas fa-print"></i>
            {isPrinting ? "Preparing Print..." : "Print Prescription"}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/drhome/viewdrbook')}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
          <button type="submit" className="submit-btn" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                {isEditing ? "Update Prescription" : "Save Prescription"}
              </>
            )}
          </button>
        </div>

        {/* Edit Notice */}
        {isEditing && (
          <div className="edit-notice">
            <i className="fas fa-edit"></i>
            <span>You are editing an existing prescription. Any changes will update the previous prescription.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPrescription;