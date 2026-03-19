// EditDoctor.js
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Editdoctor.css'

function EditDoctor() {
  const location = useLocation()
  const user = location.state
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    gender: user?.gender || '',
    dob: user?.dob ? user.dob.split('T')[0] : '',
    qualification: user?.qualification || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    photo: null
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/home/viewdr')
    } else if (user.photo) {
      setPreviewImage(`${apiUrl}${user.photo}`)
    }
  }, [user, navigate, apiUrl])

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    const mobileRegex = /^[0-9]{10}$/
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender'
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required'
    } else {
      const dobDate = new Date(formData.dob)
      const today = new Date()
      const age = today.getFullYear() - dobDate.getFullYear()
      if (age < 25) {
        newErrors.dob = 'Doctor must be at least 25 years old'
      } else if (age > 70) {
        newErrors.dob = 'Age cannot exceed 70 years'
      }
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = 'Qualification is required'
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required'
    }

    if (!formData.experience) {
      newErrors.experience = 'Experience is required'
    } else if (isNaN(formData.experience) || formData.experience < 0) {
      newErrors.experience = 'Please enter a valid experience in years'
    }

    if (formData.photo) {
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
        if (key === 'photo' && !formData.photo) return
        formDataToSend.append(key, formData[key])
      })
      formDataToSend.append('id', user._id)

      const res = await axios.post(`${apiUrl}editdr`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (res.data.status === "ok") {
        alert('Doctor updated successfully!')
        navigate('/home/viewdr')
      } else {
        alert(res.data.message || 'Error updating doctor')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="edit-doctor-container">
      <div className="edit-header">
        <button className="back-btn" onClick={() => navigate('/home/viewdr')}>
          <i className="fas fa-arrow-left"></i>
          Back to Doctors
        </button>
        <h2>Edit Doctor Profile</h2>
        <p>Update information for {formData.name}</p>
      </div>

      <form onSubmit={onSubmit} className="edit-doctor-form">
        {/* Photo Upload Section */}
        <div className="photo-upload-section">
          <div className="photo-preview" onClick={() => document.getElementById('photoInput').click()}>
            {previewImage ? (
              <img src={previewImage} alt="Preview" />
            ) : (
              <div className="photo-placeholder">
                <i className="fas fa-camera"></i>
                <span>Change Photo</span>
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
          <p className="photo-hint">Click to upload new photo (optional)</p>
        </div>

        <div className="form-grid">
          {/* Name Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-user"></i>
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter doctor's full name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
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
              placeholder="doctor@hospital.com"
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
              placeholder="e.g., MBBS, MD"
              className={errors.qualification ? 'error' : ''}
            />
            {errors.qualification && <span className="error-message">{errors.qualification}</span>}
          </div>

          {/* Specialization Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-stethoscope"></i>
              Specialization <span className="required">*</span>
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g., Cardiology, Pediatrics"
              className={errors.specialization ? 'error' : ''}
            />
            {errors.specialization && <span className="error-message">{errors.specialization}</span>}
          </div>

          {/* Experience Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-briefcase"></i>
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
          <button type="button" className="cancel-btn" onClick={() => navigate('/home/viewdr')}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Updating...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Update Doctor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditDoctor