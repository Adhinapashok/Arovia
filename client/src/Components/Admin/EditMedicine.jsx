// EditMedicine.js
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './AddMedicine.css'

function EditMedicine() {
  const location = useLocation()
  const user = location.state
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const [formData, setFormData] = useState({
    medname: user?.medname || '',
    brandname: user?.brandname || '',
    category: user?.category || '',
    dosagestrength: user?.dosagestrength || '',
    manufacture: user?.manufacture ? user.manufacture.split('T')[0] : '',
    price: user?.price || '',
    expirydate: user?.expirydate ? user.expirydate.split('T')[0] : ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/home/viewmed')
    }
  }, [user, navigate])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Medicine Name validation
    if (!formData.medname.trim()) {
      newErrors.medname = 'Medicine name is required'
    } else if (formData.medname.length < 2) {
      newErrors.medname = 'Medicine name must be at least 2 characters'
    }

    // Brand validation
    if (!formData.brandname.trim()) {
      newErrors.brandname = 'Brand name is required'
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    // Dosage Strength validation
    if (!formData.dosagestrength.trim()) {
      newErrors.dosagestrength = 'Dosage strength is required'
    }

    // Manufacture date validation
    if (!formData.manufacture) {
      newErrors.manufacture = 'Manufacture date is required'
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }

    // Expiry date validation
    if (!formData.expirydate) {
      newErrors.expirydate = 'Expiry date is required'
    } else {
      const today = new Date()
      const expiry = new Date(formData.expirydate)
      if (expiry <= today) {
        newErrors.expirydate = 'Expiry date must be in the future'
      }
    }

    // Check if expiry date is after manufacture date
    if (formData.manufacture && formData.expirydate) {
      const manufacture = new Date(formData.manufacture)
      const expiry = new Date(formData.expirydate)
      if (expiry <= manufacture) {
        newErrors.expirydate = 'Expiry date must be after manufacture date'
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
      const res = await axios.post(`${apiUrl}editmed`, {
        medname: formData.medname,
        brandname: formData.brandname,
        category: formData.category,
        dosagestrength: formData.dosagestrength,
        manufacture: formData.manufacture,
        price: formData.price,
        expirydate: formData.expirydate,
        id: user._id
      })

      if (res.data.status === "ok") {
        alert('Medicine updated successfully!')
        navigate('/home/viewmed')
      } else {
        alert(res.data.message || 'Error updating medicine')
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
    <div className="edit-medicine-container">
      <div className="edit-header">
        <button className="back-btn" onClick={() => navigate('/home/viewmed')}>
          <i className="fas fa-arrow-left"></i>
          Back to Medicine List
        </button>
        <h2>Edit Medicine</h2>
        <p>Update information for {formData.medname}</p>
      </div>

      <form onSubmit={onSubmit} className="edit-medicine-form">
        <div className="form-grid">
          {/* Medicine Name Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-pills"></i>
              Medicine Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="medname"
              value={formData.medname}
              onChange={handleChange}
              placeholder="Enter medicine name"
              className={errors.medname ? 'error' : ''}
            />
            {errors.medname && <span className="error-message">{errors.medname}</span>}
          </div>

          {/* Brand Name Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-tag"></i>
              Brand Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="brandname"
              value={formData.brandname}
              onChange={handleChange}
              placeholder="Enter brand name"
              className={errors.brandname ? 'error' : ''}
            />
            {errors.brandname && <span className="error-message">{errors.brandname}</span>}
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-folder"></i>
              Category <span className="required">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select Category</option>
              <option value="Tablets">Tablets</option>
              <option value="Capsules">Capsules</option>
              <option value="Syrups">Syrups</option>
              <option value="Drops">Drops</option>
              <option value="Injection">Injection</option>
              <option value="Ointment">Ointment</option>
              <option value="Inhaler">Inhaler</option>
              <option value="Cream">Cream</option>
              <option value="Lotion">Lotion</option>
              <option value="Powder">Powder</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          {/* Dosage Strength Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-flask"></i>
              Dosage Strength <span className="required">*</span>
            </label>
            <input
              type="text"
              name="dosagestrength"
              value={formData.dosagestrength}
              onChange={handleChange}
              placeholder="e.g., 500mg, 10ml"
              className={errors.dosagestrength ? 'error' : ''}
            />
            {errors.dosagestrength && <span className="error-message">{errors.dosagestrength}</span>}
          </div>

          {/* Manufacture Date Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-calendar-plus"></i>
              Manufacture Date <span className="required">*</span>
            </label>
            <input
              type="date"
              name="manufacture"
              value={formData.manufacture}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={errors.manufacture ? 'error' : ''}
            />
            {errors.manufacture && <span className="error-message">{errors.manufacture}</span>}
          </div>

          {/* Price Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-rupee-sign"></i>
              Price (₹) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          {/* Expiry Date Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-calendar-times"></i>
              Expiry Date <span className="required">*</span>
            </label>
            <input
              type="date"
              name="expirydate"
              value={formData.expirydate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={errors.expirydate ? 'error' : ''}
            />
            {errors.expirydate && <span className="error-message">{errors.expirydate}</span>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/home/viewmed')}>
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
                Update Medicine
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditMedicine