// EditSchedule.jsx
import React, { useState, useEffect } from 'react'
import "./Schedule.css";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function EditSchedule() {
  const location = useLocation();
  const user = location.state;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: user?.date || '',
    fromtime: user?.fromtime || '',
    totime: user?.totime || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [originalData, setOriginalData] = useState({
    date: user?.date || '',
    fromtime: user?.fromtime || '',
    totime: user?.totime || ''
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) {
      navigate('/drhome/viewdrsche');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Show preview when all fields are filled
    if (formData.date && formData.fromtime && formData.totime) {
      setShowPreview(true);
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

  const hasChanges = () => {
    return formData.date !== originalData.date ||
           formData.fromtime !== originalData.fromtime ||
           formData.totime !== originalData.totime;
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
      const res = await axios.post(`${apiUrl}editsche`, {
        date: formData.date,
        fromtime: formData.fromtime,
        totime: formData.totime,
        id: user._id
      });

      if (res.data.status === "ok") {
        alert('Schedule updated successfully!');
        navigate('/drhome/viewdrsche');
      } else {
        alert(res.data.message || 'Error updating schedule');
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const duration = getDuration();
  const hasChangesMade = hasChanges();

  return (
    <div className="edit-schedule-container">
      <div className="edit-schedule-card">
        <div className="schedule-header">
          <div className="header-icon">
            <i className="fas fa-edit"></i>
          </div>
          <h2>Edit Schedule</h2>
          <p>Update your appointment schedule details</p>
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

          {/* Original Schedule Info */}
          <div className="original-schedule-info">
            <div className="info-header">
              <i className="fas fa-info-circle"></i>
              <span>Original Schedule</span>
            </div>
            <div className="info-content">
              <div className="info-item">
                <i className="fas fa-calendar-alt"></i>
                <span>{formatDateForPreview(originalData.date)}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>{formatTimeForPreview(originalData.fromtime)} - {formatTimeForPreview(originalData.totime)}</span>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && hasChangesMade && (
            <div className="schedule-preview">
              <div className="preview-header">
                <i className="fas fa-eye"></i>
                <span>Updated Schedule Preview</span>
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
              onClick={() => navigate('/drhome/viewdrsche')}
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting || !hasChangesMade}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Update Schedule
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
              Ensure the new time slot doesn't conflict with existing appointments
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Allow adequate time between appointments (minimum 30 minutes)
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              Changes will affect future bookings for this time slot
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

export default EditSchedule;