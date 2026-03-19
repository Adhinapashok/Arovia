// AddStock.js
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './AddStock.css'

function AddStock() {
  const location = useLocation()
  const user = location.state
  const [quantity, setStock] = useState(user?.stock?.[0]?.quantity || 0)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const nav = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!user) {
      nav('/home/viewmed')
    }
  }, [user, nav])

  const validateForm = () => {
    const newErrors = {}

    if (!quantity && quantity !== 0) {
      newErrors.quantity = 'Stock quantity is required'
    } else if (isNaN(quantity)) {
      newErrors.quantity = 'Please enter a valid number'
    } else if (parseInt(quantity) < 0) {
      newErrors.quantity = 'Stock cannot be negative'
    } else if (parseInt(quantity) > 10000) {
      newErrors.quantity = 'Stock cannot exceed 10,000 units'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onsubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const res = await axios.post(`${apiUrl}addstock`, {
        quantity: parseInt(quantity),
        medicine: user._id
      })

      if (res.data.status === "ok") {
        alert(res.data.message)
        nav('/home/viewmed')
      } else {
        alert(res.data.message || 'Error updating stock')
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
    <div className="add-stock-container">
      <div className="stock-header">
        <button className="back-btn" onClick={() => nav('/home/viewmed')}>
          <i className="fas fa-arrow-left"></i>
          Back to Medicine List
        </button>
        
        <div className="medicine-info-card">
          <div className="medicine-icon">
            <i className="fas fa-pills"></i>
          </div>
          <div className="medicine-details">
            <h2>{user.medname}</h2>
            <div className="medicine-meta">
              <span className="brand">
                <i className="fas fa-tag"></i> {user.brandname}
              </span>
              <span className="category">
                <i className="fas fa-folder"></i> {user.category}
              </span>
              <span className="dosage">
                <i className="fas fa-flask"></i> {user.dosagestrength}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="stock-content">
        <div className="current-stock-card">
          <div className="current-stock-header">
            <i className="fas fa-boxes"></i>
            <h3>Current Stock</h3>
          </div>
          <div className="current-stock-value">
            <span className={`stock-number ${user.stock?.[0]?.quantity < 10 ? 'low-stock' : ''}`}>
              {user.stock?.[0]?.quantity || 0}
            </span>
            <span className="stock-unit">units</span>
          </div>
          {user.stock?.[0]?.quantity < 10 && (
            <div className="stock-warning">
              <i className="fas fa-exclamation-triangle"></i>
              Low stock! Consider adding more.
            </div>
          )}
        </div>

        <div className="update-stock-card">
          <div className="update-stock-header">
            <i className="fas fa-arrow-up"></i>
            <h3>Update Stock</h3>
          </div>
          
          <form onSubmit={onsubmit} className="stock-form">
            <div className="form-group">
              <label>
                <i className="fas fa-cubes"></i>
                Enter New Stock Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  setStock(e.target.value)
                  if (errors.quantity) setErrors({})
                }}
                placeholder="Enter stock quantity"
                min="0"
                max="10000"
                step="1"
                className={errors.quantity ? 'error' : ''}
              />
              {errors.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
            </div>

            <div className="stock-preview">
              <div className="preview-item">
                <span className="preview-label">Current Stock:</span>
                <span className="preview-value">{user.stock?.[0]?.quantity || 0}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">New Stock:</span>
                <span className="preview-value highlight">
                  {quantity ? parseInt(quantity) : 0}
                </span>
              </div>
              <div className="preview-item total">
                <span className="preview-label">Total After Update:</span>
                <span className="preview-value total-value">
                  {(parseInt(user.stock?.[0]?.quantity) || 0) + (parseInt(quantity) || 0)}
                </span>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => nav('/home/viewmed')}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Update Stock
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="stock-guidelines">
        <h4>
          <i className="fas fa-info-circle"></i>
          Stock Guidelines
        </h4>
        <ul>
          <li>
            <i className="fas fa-check-circle"></i>
            Stock quantity should be between 0 and 10,000 units
          </li>
          <li>
            <i className="fas fa-check-circle"></i>
            Low stock alert triggers when stock is below 10 units
          </li>
          <li>
            <i className="fas fa-check-circle"></i>
            The new stock will be added to the current stock
          </li>
          <li>
            <i className="fas fa-check-circle"></i>
            Regular stock updates help maintain inventory accuracy
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AddStock