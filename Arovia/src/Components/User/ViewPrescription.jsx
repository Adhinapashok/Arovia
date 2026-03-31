// ViewPrescription.jsx
import React, { useEffect, useState, useRef } from "react";
import "../Doctor/Prescription.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewPrescription() {
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
    specialization: user?.schedule?.doctor?.specialization || ""
  });

  const [loading, setLoading] = useState(true);
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

  const fetchdata = async () => {
    try {
      const bid = user?._id;
      if (!bid) return;
      
      const res = await axios.get(`${apiUrl}usviewpresc/${bid}`);
      console.log(res.data);
      
      if (res.data) {
        setFormData(prev => ({
          ...prev,
          prescription: res.data.Prescription || "",
          diagnosis: res.data.Diagnosis || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching prescription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const calculatedAge = calculateAge(user.user?.dob);
      setFormData(prev => ({
        ...prev,
        age: calculatedAge
      }));
      fetchdata();
    } else {
      navigate('/userhome/usviewbook');
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handlePrint = () => {
    setIsPrinting(true);
    
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
            
            .print-prescription-card {
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
              .print-prescription-card {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-prescription-card">
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
                  <div class="value">${formatDate(formData.dob)}</div>
                </div>
                <div class="info-field">
                  <div class="label">Age / Gender</div>
                  <div class="value">${formData.age} years / ${formData.gender}</div>
                </div>
                <div class="info-field">
                  <div class="label">Visit Date</div>
                  <div class="value">${formatDate(formData.date)}</div>
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
              <div class="diagnosis-content">${formData.diagnosis.replace(/\n/g, '<br>') || "No diagnosis recorded"}</div>
            </div>

            <!-- Prescription -->
            <div class="print-section">
              <div class="section-header">
                <i class="fas fa-prescription"></i>
                <h3>Prescription (Rx)</h3>
              </div>
              <div class="prescription-content">${formData.prescription.replace(/\n/g, '<br>') || "No prescription recorded"}</div>
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

  if (!user) {
    return (
      <div className="prescription-error">
        <i className="fas fa-exclamation-circle"></i>
        <h2>No Prescription Found</h2>
        <p>Please select a booking to view the prescription</p>
        <button onClick={() => navigate('/userhome/usviewbook')}>Back to Appointments</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="prescription-loading">
        <div className="loading-spinner"></div>
        <p>Loading prescription...</p>
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
              <p>#PR-{user?._id?.slice(-6) || "000001"}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis Section */}
        <div className="diagnosis-section">
          <div className="section-header">
            <i className="fas fa-stethoscope"></i>
            <h3>Diagnosis</h3>
          </div>
          <div className="diagnosis-content">
            {formData.diagnosis || "No diagnosis recorded"}
          </div>
        </div>

        {/* Prescription Section */}
        <div className="prescription-section">
          <div className="section-header">
            <i className="fas fa-prescription"></i>
            <h3>Prescription (Rx)</h3>
          </div>
          <div className="prescription-content">
            {formData.prescription ? (
              formData.prescription.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))
            ) : (
              "No prescription recorded"
            )}
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
        <div className="action-buttons">
          <button type="button" className="print-btn" onClick={handlePrint} disabled={isPrinting}>
            <i className="fas fa-print"></i>
            {isPrinting ? "Preparing Print..." : "Print Prescription"}
          </button>
          <button type="button" className="back-btn" onClick={() => navigate('/userhome/usviewbook')}>
            <i className="fas fa-arrow-left"></i>
            Back to Appointments
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewPrescription;