// AddMedicine.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AddMedicine.css'

function AddMedicine() {
  const [formData, setFormData] = useState({
    medicine: '',
    brand: '',
    category: '',
    dosageStrength: '',
    manufacture: '',
    price: '',
    expiryDate: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nav = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

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
    if (!formData.medicine.trim()) {
      newErrors.medicine = 'Medicine name is required'
    } else if (formData.medicine.length < 2) {
      newErrors.medicine = 'Medicine name must be at least 2 characters'
    }

    // Brand validation
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand name is required'
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    // Dosage Strength validation
    if (!formData.dosageStrength.trim()) {
      newErrors.dosageStrength = 'Dosage strength is required'
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
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    } else {
      const today = new Date()
      const expiry = new Date(formData.expiryDate)
      if (expiry <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future'
      }
    }

    // Check if expiry date is after manufacture date
    if (formData.manufacture && formData.expiryDate) {
      const manufacture = new Date(formData.manufacture)
      const expiry = new Date(formData.expiryDate)
      if (expiry <= manufacture) {
        newErrors.expiryDate = 'Expiry date must be after manufacture date'
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
      const res = await axios.post(`${apiUrl}addmed`, {
        medicine: formData.medicine,
        brand: formData.brand,
        category: formData.category,
        dosagestrength: formData.dosageStrength,
        manufacture: formData.manufacture,
        price: formData.price,
        expirydate: formData.expiryDate
      })

      if (res.data.status === "ok") {
        alert(res.data.message)
        nav('/home/viewmed')
      } else {
        alert(res.data.message || 'Error adding medicine')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-medicine-container">
      <div className="add-medicine-header">
        <h2>Add New Medicine</h2>
        <p>Fill in the details to add a new medicine to inventory</p>
      </div>

      <form onSubmit={onSubmit} className="add-medicine-form">
        <div className="form-grid">
          {/* Medicine Name Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-pills"></i>
              Medicine Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              placeholder="Enter medicine name"
              className={errors.medicine ? 'error' : ''}
            />
            {errors.medicine && <span className="error-message">{errors.medicine}</span>}
          </div>

          {/* Brand Name Field */}
          <div className="form-group">
            <label>
              <i className="fas fa-tag"></i>
              Brand Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
              className={errors.brand ? 'error' : ''}
            />
            {errors.brand && <span className="error-message">{errors.brand}</span>}
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
              name="dosageStrength"
              value={formData.dosageStrength}
              onChange={handleChange}
              placeholder="e.g., 500mg, 10ml"
              className={errors.dosageStrength ? 'error' : ''}
            />
            {errors.dosageStrength && <span className="error-message">{errors.dosageStrength}</span>}
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
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={errors.expiryDate ? 'error' : ''}
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => nav('/home/viewmed')}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Adding...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                Add Medicine
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMedicine