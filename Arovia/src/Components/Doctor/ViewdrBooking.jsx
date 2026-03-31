// ViewdrBooking.jsx
import React, { useEffect, useState } from 'react'
import './Booking.css'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ViewdrBooking() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [statusFilter, setStatusFilter] = useState("all");
  const [scheduleInfo, setScheduleInfo] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem("lid");
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if appointment is past

  const isFutureAppointment = (scheduleDate) => {
  const today = new Date();
  const appointmentDate = new Date(scheduleDate);

  today.setHours(0, 0, 0, 0);
  appointmentDate.setHours(0, 0, 0, 0);

  return appointmentDate > today; // future date
};
  const isPastAppointment = (scheduleDate, scheduleToTime) => {
    const today = new Date();
    const appointmentDate = new Date(scheduleDate);
    today.setHours(0, 0, 0, 0);
    
    // If date is in the past
    if (appointmentDate < today) return true;
    
    // If date is today, check if end time has passed
    if (appointmentDate.toDateString() === today.toDateString()) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      if (scheduleToTime < currentTime) return true;
    }
    return false;
  };

  // Helper function to get display status
  const getDisplayStatus = (booking) => {
    const isPast = isPastAppointment(booking.schedule?.date, booking.schedule?.totime);
    const status = booking.status?.toLowerCase();
    
    // If appointment is past and not prescribed or cancelled, show as Past
    if (isPast && status !== 'prescribed' && status !== 'cancelled') {
      return 'past';
    }
    return status;
  };

  useEffect(() => {
    // Check if we have filtered data from schedule view
    if (location.state?.filteredBookings) {
      console.log("Using filtered bookings from schedule:", location.state.filteredBookings);
      setData(location.state.filteredBookings);
      setFilteredData(location.state.filteredBookings);
      setScheduleInfo({
        scheduleId: location.state.scheduleId,
        scheduleDate: location.state.scheduleDate,
        scheduleFromTime: location.state.scheduleFromTime,
        scheduleToTime: location.state.scheduleToTime
      });
      setLoading(false);
    } else {
      // Fetch all bookings normally
      fetchAllBookings();
    }
  }, [location.state]);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}drviewbooking/${lid}`);
      console.log("All bookings:", res.data);
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    let filtered = data.filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        booking.user?.name?.toLowerCase().includes(searchLower) ||
        booking.schedule?.date?.includes(searchTerm) ||
        booking.date?.includes(searchTerm) ||
        booking.time?.includes(searchTerm);

      const displayStatus = getDisplayStatus(booking);
      const matchesStatus = statusFilter === "all" || displayStatus === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, statusFilter]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'prescribed':
        return 'status-prescribed';
      case 'past':
        return 'status-past';
      default:
        return 'status-pending';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'fa-check-circle';
      case 'pending':
        return 'fa-clock';
      case 'cancelled':
        return 'fa-times-circle';
      case 'prescribed':
        return 'fa-prescription';
      case 'past':
        return 'fa-history';
      default:
        return 'fa-clock';
    }
  };

  const handlePrescription = (booking) => {
    navigate('/drhome/addpres', { state: booking });
  };

  const handleGoBack = () => {
    navigate('/drhome/viewdrsche');
  };

  // Calculate stats based on display status
  const totalBookings = filteredData.length;
  const pendingCount = data.filter(b => {
    const displayStatus = getDisplayStatus(b);
    return displayStatus === 'pending';
  }).length;
  const confirmedCount = data.filter(b => b.status?.toLowerCase() === 'cancelled').length;
  const prescribedCount = data.filter(b => b.status?.toLowerCase() === 'prescribed').length;
  const pastCount = data.filter(b => {
    const displayStatus = getDisplayStatus(b);
    return displayStatus === 'past';
  }).length;

  return (
    <div className="view-booking-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <div className="header-navigation">
            {scheduleInfo && (
              <button className="back-btn" onClick={handleGoBack}>
                <i className="fas fa-arrow-left"></i>
                Back to Schedules
              </button>
            )}
          </div>
          <h2>Patient Appointments</h2>
          {scheduleInfo && (
            <div className="schedule-context">
              <p className="context-text">
                <i className="fas fa-calendar-alt"></i>
                Showing bookings for: {formatDate(scheduleInfo.scheduleDate)} |
                {formatTime(scheduleInfo.scheduleFromTime)} - {formatTime(scheduleInfo.scheduleToTime)}
              </p>
            </div>
          )}
          <p>View and manage your patient bookings</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-calendar-check"></i>
            <span>Total: {totalBookings}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="booking-stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending-stat">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>{pendingCount}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon confirmed-stat">
            <i className="fas fa-ban"></i>
          </div>
          <div className="stat-info">
            <h3>{confirmedCount}</h3>
            <p>Cancelled</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon prescribed-stat">
            <i className="fas fa-prescription"></i>
          </div>
          <div className="stat-info">
            <h3>{prescribedCount}</h3>
            <p>Prescribed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon past-stat">
            <i className="fas fa-history"></i>
          </div>
          <div className="stat-info">
            <h3>{pastCount}</h3>
            <p>Past</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by patient name, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <div className="filter-options">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="prescribed">Prescribed</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="refresh-btn" onClick={fetchAllBookings}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading appointments...</p>
        </div>
      ) : (
        <>
          {/* Booking Cards Grid */}
          {filteredData.length > 0 ? (
            <div className="booking-cards-grid">
              {currentItems.map((booking, index) => {
                const isPast = isPastAppointment(booking.schedule?.date, booking.schedule?.totime);
                const isCancelled = booking.status?.toLowerCase() === 'cancelled';
                const isPrescribed = booking.status?.toLowerCase() === 'prescribed';
                const displayStatus = getDisplayStatus(booking);
                
                return (
                  <div key={booking._id} className={`booking-card ${displayStatus}`}>
                    <div className="card-header">
                      <div className="booking-number">#{indexOfFirstItem + index + 1}</div>
                      <div className={`status-badge ${getStatusBadge(displayStatus)}`}>
                        <i className={`fas ${getStatusIcon(displayStatus)}`}></i>
                        {displayStatus === 'past' ? 'Past' : booking.status}
                      </div>
                    </div>

                    <div className="patient-info">
                      <div className="patient-avatar">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <div className="patient-details">
                        <h3>{booking.user?.name || 'Patient'}</h3>
                        <p className="booking-date">
                          <i className="fas fa-calendar"></i>
                          Booked on: {formatDate(booking.date)} at {booking.time}
                        </p>
                      </div>
                    </div>

                    <div className="schedule-details">
                      <div className="detail-item">
                        <i className="fas fa-calendar-alt"></i>
                        <div>
                          <span>Appointment Date</span>
                          <p>{formatDate(booking.schedule?.date)}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <div>
                          <span>Time Slot</span>
                          <p>{formatTime(booking.schedule?.fromtime)} - {formatTime(booking.schedule?.totime)}</p>
                        </div>
                      </div>
                    </div>
{/* 
                    <div className="card-footer">
                      {isCancelled ? (
                        // ❌ Cancelled appointment
                        <div className="cancelled-text">
                          <i className="fas fa-ban"></i>
                          <span>Appointment Cancelled</span>
                        </div>
                      ) : displayStatus === 'past' ? (
                        // 📅 Past appointment
                        <div className="past-appointment">
                          <i className="fas fa-history"></i>
                          <span>Past Appointment</span>
                        </div>
                      ) : isPrescribed ? (
                        // ✏️ Update prescription (for prescribed appointments)
                        <button
                          className="prescription-btn update"
                          onClick={() => handlePrescription(booking)}
                        >
                          <i className="fas fa-edit"></i>
                          Update Prescription
                        </button>
                      ) : (
                        // ➕ Add prescription (for pending/confirmed appointments)
                        <button
                          className="prescription-btn add"
                          onClick={() => handlePrescription(booking)}
                        >
                          <i className="fas fa-prescription"></i>
                          Add Prescription
                        </button>
                      )}
                    </div> */}

                    <div className="card-footer">
  {isCancelled ? (
    <div className="cancelled-text">
      <i className="fas fa-ban"></i>
      <span>Appointment Cancelled</span>
    </div>
  ) : displayStatus === 'past' ? (
    <div className="past-appointment">
      <i className="fas fa-history"></i>
      <span>Past Appointment</span>
    </div>
  ) : isFutureAppointment(booking.schedule?.date) ? (
    // 🚫 FUTURE → don't show button
    <div className="future-appointment">
      <i className="fas fa-clock"></i>
      <span>Upcoming Appointment</span>
    </div>
  ) : isPrescribed ? (
    <button
      className="prescription-btn update"
      onClick={() => handlePrescription(booking)}
    >
      <i className="fas fa-edit"></i>
      Update Prescription
    </button>
  ) : (
    <button
      className="prescription-btn add"
      onClick={() => handlePrescription(booking)}
    >
      <i className="fas fa-prescription"></i>
      Add Prescription
    </button>
  )}
</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <i className="fas fa-calendar-times"></i>
              <p>No appointments found</p>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")}>
                  Clear Search
                </button>
              )}
              {scheduleInfo && (
                <button onClick={handleGoBack} className="back-to-schedule-btn">
                  <i className="fas fa-arrow-left"></i>
                  Back to Schedules
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="page-dots">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ViewdrBooking;