// AddSchedule.jsx
import React, { useState } from 'react'
import "./Schedule.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddSchedule() {
  const [formData, setFormData] = useState({
    date: '',
    fromtime: '',
    totime: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const nav = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem("lid");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Show preview when both date and times are filled
    if (formData.date && formData.fromtime && formData.totime && name !== 'date') {
      setShowPreview(true);
    } else if (name === 'date' && formData.fromtime && formData.totime && value) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
      }
    }

    // From Time validation
    if (!formData.fromtime) {
      newErrors.fromtime = 'Start time is required';
    }

    // To Time validation
    if (!formData.totime) {
      newErrors.totime = 'End time is required';
    } else if (formData.fromtime && formData.totime) {
      if (formData.totime <= formData.fromtime) {
        newErrors.totime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTimeForPreview = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDateForPreview = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(`${apiUrl}addschedule`, {
        date: formData.date,
        fromtime: formData.fromtime,
        totime: formData.totime,
        lid: lid
      });

      if (res.data.status === "ok") {
        alert('Schedule added successfully!');
        nav('/drhome');
      } else {
        alert(res.data.message || 'Error adding schedule');
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDuration = () => {
    if (!formData.fromtime || !formData.totime) return null;
    
    const [startHour, startMinute] = formData.fromtime.split(':');
    const [endHour, endMinute] = formData.totime.split(':');
    
    const startMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    const endMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
    const durationMinutes = endMinutes - startMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const duration = getDuration();

  return (
    <div className="add-schedule-container">
      <div className="add-schedule-card">
        <div className="schedule-header">
          <div className="header-icon">
            <i className="fas fa-calendar-plus"></i>
          </div>
          <h2>Add New Schedule</h2>
          <p>Create appointment slots for patient bookings</p>
        </div>

        <form onSubmit={onSubmit} className="schedule-form">
          <div className="form-group">
            <label>
              <i className="fas fa-calendar-alt"></i>
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              name="date"
              className={`form-input ${errors.date ? 'error' : ''}`}
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="time-group">
            <div className="form-group time-field">
              <label>
                <i className="fas fa-hourglass-start"></i>
                From Time <span className="required">*</span>
              </label>
              <input
                type="time"
                name="fromtime"
                className={`form-input ${errors.fromtime ? 'error' : ''}`}
                value={formData.fromtime}
                onChange={handleChange}
                step="60"
              />
              {errors.fromtime && <span className="error-message">{errors.fromtime}</span>}
            </div>

            <div className="form-group time-field">
              <label>
                <i className="fas fa-hourglass-end"></i>
                To Time <span className="required">*</span>
              </label>
              <input
                type="time"
                name="totime"
                className={`form-input ${errors.totime ? 'error' : ''}`}
                value={formData.totime}
                onChange={handleChange}
                step="60"
              />
              {errors.totime && <span className="error-message">{errors.totime}</span>}
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="schedule-preview">
              <div className="preview-header">
                <i className="fas fa-eye"></i>
                <span>Schedule Preview</span>
              </div>
              <div className="preview-content">
                <div className="preview-item">
                  <i className="fas fa-calendar-day"></i>
                  <div>
                    <strong>Date</strong>
                    <p>{formatDateForPreview(formData.date)}</p>
                  </div>
                </div>
                <div className="preview-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <strong>Time Slot</strong>
                    <p>{formatTimeForPreview(formData.fromtime)} - {formatTimeForPreview(formData.totime)}</p>
                  </div>
                </div>
                {duration && (
                  <div className="preview-item">
                    <i className="fas fa-hourglass-half"></i>
                    <div>
                      <strong>Duration</strong>
                      <p>{duration}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Duration Indicator */}
          {duration && !showPreview && (
            <div className="duration-indicator">
              <i className="fas fa-hourglass-half"></i>
              <span>Duration: {duration}</span>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => nav('/drhome')}
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
                  Adding Schedule...
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle"></i>
                  Add Schedule
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="schedule-tips">
          <h4>
            <i className="fas fa-lightbulb"></i>
            Tips
          </h4>
          <ul>
            <li>
              <i className="fas fa-check-circle"></i>
              Schedule appointments at least 24 hours in advance
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Allow adequate time between appointments (minimum 30 minutes)
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Double-check the time slot to avoid conflicts
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              You can view all your schedules in the "View Schedule" section
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddSchedule;