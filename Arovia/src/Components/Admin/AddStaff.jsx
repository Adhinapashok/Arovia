// AddStaff.js
import React, { useState } from 'react'
import './Admin.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AddStaff() {
  const [formData, setFormData] = useState({
    staff: '',
    email: '',
    mobile: '',
    gender: '',
    dob: '',
    qualification: '',
    role: '',
    experience: '',
    photo: null
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  
  const nav = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'photo') {
      const file = files[0]
      setFormData({ ...formData, photo: file })
      
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Staff Name validation
    if (!formData.staff.trim()) {
      newErrors.staff = 'Staff name is required'
    } else if (formData.staff.length < 3) {
      newErrors.staff = 'Name must be at least 3 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.staff)) {
      newErrors.staff = 'Name can only contain letters and spaces'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender'
    }

    // DOB validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required'
    } else {
      const dobDate = new Date(formData.dob)
      const today = new Date()
      const age = today.getFullYear() - dobDate.getFullYear()
      if (age < 18) {
        newErrors.dob = 'Staff must be at least 18 years old'
      } else if (age > 65) {
        newErrors.dob = 'Age cannot exceed 65 years'
      }
    }

    // Qualification validation
    if (!formData.qualification.trim()) {
      newErrors.qualification = 'Qualification is required'
    }

    // Role validation
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
    }

    // Experience validation
    if (!formData.experience) {
      newErrors.experience = 'Experience is required'
    } else if (isNaN(formData.experience) || formData.experience < 0) {
      newErrors.experience = 'Please enter a valid experience in years'
    }

    // Photo validation
    if (!formData.photo) {
      newErrors.photo = 'Please upload a photo'
    } else {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(formData.photo.type)) {
        newErrors.photo = 'Only JPG, JPEG, and PNG files are allowed'
      }
      if (formData.photo.size > 5 * 1024 * 1024) {
        newErrors.photo = 'Photo size should be less than 5MB'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key])
      })

      const res = await axios.post(`${apiUrl}addstaff`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (res.data.status === "ok") {
        alert(res.data.message)
        nav('/home/viewstf')
      } else {
        alert(res.data.message || 'Error adding staff')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-staff-container">
      <div className="add-staff-header">
        <h2>Add New Staff Member</h2>
        <p>Fill in the details to register a new staff member</p>
      </div>

      <form onSubmit={onSubmit} className="add-staff-form">
        {/* Photo Upload Section */}
        <div className="photo-upload-section">
          <div className="photo-preview" onClick={() => document.getElementById('photoInput').click()}>
            {previewImage ? (
              <img src={previewImage} alt="Preview" />
            ) : (
              <div className="photo-placeholder">
                <i className="fas fa-camera"></i>
                <span>Upload Photo</span>
              </div>
            )}
          </div>
          <input
            id="photoInput"
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          {errors.photo && <span className="error-message">{errors.photo}</span>}
          <p className="photo-hint">Click to upload staff photo (required)</p>
        </div>

        <div className="form-grid">
          {/* Staff Name Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-user"></i>
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="staff"
              value={formData.staff}
              onChange={handleChange}
              placeholder="Enter staff's full name"
              className={errors.staff ? 'error' : ''}
            />
            {errors.staff && <span className="error-message">{errors.staff}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-envelope"></i>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="staff@hospital.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Mobile Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-phone"></i>
              Mobile Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
              className={errors.mobile ? 'error' : ''}
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>

          {/* Gender Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-venus-mars"></i>
              Gender <span className="required">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? 'error' : ''}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          {/* DOB Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-calendar"></i>
              Date of Birth <span className="required">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={errors.dob ? 'error' : ''}
            />
            {errors.dob && <span className="error-message">{errors.dob}</span>}
          </div>

          {/* Qualification Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-graduation-cap"></i>
              Qualification <span className="required">*</span>
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g., B.Sc Nursing, MBA"
              className={errors.qualification ? 'error' : ''}
            />
            {errors.qualification && <span className="error-message">{errors.qualification}</span>}
          </div>

          {/* Role Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-briefcase"></i>
              Role <span className="required">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'error' : ''}
            >
              <option value="">Select Role</option>
              <option value="Nurse">Nurse</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Accountant">Accountant</option>
              <option value="HR">HR</option>
              <option value="Administrative">Administrative</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Security">Security</option>
              <option value="Other">Other</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          {/* Experience Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-clock"></i>
              Experience (Years) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of experience"
              min="0"
              max="50"
              className={errors.experience ? 'error' : ''}
            />
            {errors.experience && <span className="error-message">{errors.experience}</span>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => nav('/home/viewstf')}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Registering...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Register Staff
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStaff