// ViewBookings.jsx - Added cancellation functionality
import React, { useEffect, useState } from 'react'
import './ViewBooking.css'
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function ViewBookings() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem("lid");
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}usviewbooking/${lid}`);
      console.log(res.data);
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    let filtered = data.filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        booking.schedule?.doctor?.name?.toLowerCase().includes(searchLower) ||
        booking.schedule?.date?.includes(searchTerm) ||
        booking.date?.includes(searchTerm) ||
        booking.time?.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || booking.status?.toLowerCase() === statusFilter.toLowerCase();
      
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

  // Cancel booking function
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    setCancellingId(selectedBooking._id);
    try {
      const res = await axios.post(`${apiUrl}cancelbooking`, { 
        bookingId: selectedBooking._id 
      });
      
      if (res.data.status === "ok") {
        alert("Appointment cancelled successfully!");
        await fetchdata(); // Refresh the data
        setShowCancelModal(false);
        setSelectedBooking(null);
      } else {
        alert(res.data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Network error. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
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
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'prescribed':
        return 'status-prescribed';
      default:
        return 'status-pending';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return 'fa-check-circle';
      case 'pending':
        return 'fa-clock';
      case 'cancelled':
        return 'fa-times-circle';
      case 'prescribed':
        return 'fa-prescription';
      default:
        return 'fa-clock';
    }
  };

  // Check if appointment is past
  const isPastAppointment = (scheduleDate, scheduleToTime) => {
    const today = new Date();
    const appointmentDate = new Date(scheduleDate);
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) return true;
    if (appointmentDate.toDateString() === today.toDateString()) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      if (scheduleToTime < currentTime) return true;
    }
    return false;
  };

  // Check if cancellation is allowed (only for pending/confirmed appointments that are not past)
  const canCancel = (booking) => {
    if (booking.status?.toLowerCase() === 'cancelled') return false;
    if (booking.status?.toLowerCase() === 'prescribed') return false;
    const isPast = isPastAppointment(booking.schedule?.date, booking.schedule?.totime);
    return !isPast;
  };

  const handleViewPrescription = (booking) => {
    navigate('/userhome/usviewpres', { state: booking });
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  // Calculate stats
  const totalBookings = filteredData.length;
  const pendingCount = data.filter(b => b.status?.toLowerCase() === 'pending').length;
  const confirmedCount = data.filter(b => b.status?.toLowerCase() === 'confirmed').length;
  const prescribedCount = data.filter(b => b.status?.toLowerCase() === 'prescribed').length;
  const cancelledCount = data.filter(b => b.status?.toLowerCase() === 'cancelled').length;

  return (
    <div className="view-bookings-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>My Appointments</h2>
          <p>View and manage your appointment history</p>
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
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{confirmedCount}</h3>
            <p>Confirmed</p>
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
          <div className="stat-icon cancelled-stat">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{cancelledCount}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by doctor name or date..."
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
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="refresh-btn" onClick={fetchdata}>
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
            <div className="bookings-cards-grid">
              {currentItems.map((booking, index) => {
                const isPast = isPastAppointment(booking.schedule?.date, booking.schedule?.totime);
                const doctorPhoto = booking.schedule?.doctor?.photo;
                const cancelAllowed = canCancel(booking);
                
                return (
                  <div key={booking._id} className={`booking-card ${booking.status?.toLowerCase()}`}>
                    <div className="card-header">
                      <div className="booking-number">#{indexOfFirstItem + index + 1}</div>
                      <div className={`status-badge ${getStatusBadge(booking.status)}`}>
                        <i className={`fas ${getStatusIcon(booking.status)}`}></i>
                        {booking.status}
                      </div>
                    </div>
                    
                    <div className="doctor-info">
                      <div className="doctor-avatar">
                        {doctorPhoto ? (
                          <img 
                            src={`${apiUrl}${doctorPhoto}`} 
                            alt={booking.schedule?.doctor?.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/60?text=Doctor';
                            }}
                          />
                        ) : (
                          <i className="fas fa-user-md"></i>
                        )}
                      </div>
                      <div className="doctor-details">
                        <h3>Dr. {booking.schedule?.doctor?.name}</h3>
                        <p className="specialty">{booking.schedule?.doctor?.specialization}</p>
                        <div className="doctor-contact">
                          <span><i className="fas fa-envelope"></i> {booking.schedule?.doctor?.email}</span>
                          <span><i className="fas fa-phone"></i> {booking.schedule?.doctor?.mobile}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="detail-item">
                        <i className="fas fa-calendar-alt"></i>
                        <div>
                          <label>Appointment Date</label>
                          <p>{formatDate(booking.schedule?.date)}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <div>
                          <label>Time Slot</label>
                          <p>{formatTime(booking.schedule?.fromtime)} - {formatTime(booking.schedule?.totime)}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-calendar-day"></i>
                        <div>
                          <label>Booked On</label>
                          <p>{formatDate(booking.date)} at {booking.time}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      {booking.status?.toLowerCase() === 'prescribed' ? (
                        <button 
                          className="view-prescription-btn"
                          onClick={() => handleViewPrescription(booking)}
                        >
                          <i className="fas fa-file-prescription"></i>
                          View Prescription
                        </button>
                      ) : booking.status?.toLowerCase() === 'cancelled' ? (
                        <div 
                        className="cancelled-appointment" 
                        style={{ color: "red", fontWeight: "bold" }}
                      >
                        <i className="fas fa-ban"></i>
                        <span>Appointment Cancelled</span>
                      </div>
                      ) : isPast ? (
                        <div className="past-appointment">
                          <i className="fas fa-history"></i>
                          <span>Past Appointment</span>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <div className="appointment-status-info">
                            <i className="fas fa-info-circle"></i>
                            <span>Awaiting doctor's confirmation</span>
                          </div>
                          {cancelAllowed && (
                            <button 
                              className="cancel-btn"
                              onClick={() => openCancelModal(booking)}
                              disabled={cancellingId === booking._id}
                            >
                              {cancellingId === booking._id ? (
                                <>
                                  <i className="fas fa-spinner fa-spin"></i>
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-times-circle"></i>
                                  Cancel Appointment
                                </>
                              )}
                            </button>
                          )}
                        </div>
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Cancel Appointment</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your appointment with <strong>Dr. {selectedBooking.schedule?.doctor?.name}</strong>?</p>
              <p className="modal-details">
                <strong>Date:</strong> {formatDate(selectedBooking.schedule?.date)}<br/>
                <strong>Time:</strong> {formatTime(selectedBooking.schedule?.fromtime)} - {formatTime(selectedBooking.schedule?.totime)}
              </p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => {
                setShowCancelModal(false);
                setSelectedBooking(null);
              }}>
                <i className="fas fa-times"></i>
                Keep Appointment
              </button>
              <button className="modal-confirm" onClick={handleCancelBooking}>
                <i className="fas fa-trash-alt"></i>
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewBookings;