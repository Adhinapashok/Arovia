// ViewBooking.js
import React, { useEffect, useState } from 'react'
import './ViewBooking.css'
import axios from 'axios';

function ViewBooking() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}adminviewbooking`);
      console.log(res.data);
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
        booking.user?.name?.toLowerCase().includes(searchLower) ||
        booking.schedule?.doctor?.name?.toLowerCase().includes(searchLower) ||
        booking.date?.includes(searchTerm) ||
        booking.time?.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || booking.status?.toLowerCase() === statusFilter.toLowerCase();
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date();
        const bookingDate = new Date(booking.date);
        const diffTime = bookingDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateFilter === "today") {
          matchesDate = bookingDate.toDateString() === today.toDateString();
        } else if (dateFilter === "upcoming") {
          matchesDate = diffDays > 0 && diffDays <= 7;
        } else if (dateFilter === "past") {
          matchesDate = diffDays < 0;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, statusFilter, dateFilter]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get status badge class
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get booking status
  const getBookingStatus = (booking) => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    const diffTime = bookingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'past';
    if (diffDays === 0) return 'today';
    return 'upcoming';
  };

  return (
    <div className="view-booking-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>Appointment Bookings</h2>
          <p>Manage and view all patient appointments</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-calendar-check"></i>
            <span>Total Bookings: {filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by patient name, doctor, date..."
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
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select 
            className="filter-select" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming (7 days)</option>
            <option value="past">Past Appointments</option>
          </select>
          
          <button className="refresh-btn" onClick={fetchdata}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{data.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {data.filter(b => b.status?.toLowerCase() === 'pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        
        <div className="stat-card confirmed">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {data.filter(b => b.status?.toLowerCase() === 'confirmed').length}
            </span>
            <span className="stat-label">Confirmed</span>
          </div>
        </div>
        
        <div className="stat-card today">
          <div className="stat-icon">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {data.filter(b => {
                const today = new Date().toDateString();
                const bookingDate = new Date(b.date).toDateString();
                return bookingDate === today;
              }).length}
            </span>
            <span className="stat-label">Today's Appointments</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : (
        <>
          {/* Bookings Table */}
          <div className="table-responsive">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Booking Type</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((booking, index) => {
                    const bookingStatus = getBookingStatus(booking);
                    
                    return (
                      <tr key={booking._id} className="booking-row">
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <div className="patient-name">
                            <i className="fas fa-user"></i>
                            {booking.user?.name || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div className="doctor-name">
                            <i className="fas fa-user-md"></i>
                            {booking.schedule?.doctor?.name || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <div className="date-cell">
                            <i className="fas fa-calendar"></i>
                            {formatDate(booking.date)}
                          </div>
                        </td>
                        <td>
                          <div className="time-cell">
                            <i className="fas fa-clock"></i>
                            {booking.time}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusBadge(booking.status)}`}>
                            {booking.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <span className={`booking-type-badge ${bookingStatus}`}>
                            {bookingStatus === 'today' ? 'Today' : 
                             bookingStatus === 'upcoming' ? 'Upcoming' : 'Past'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      <div className="no-data-content">
                        <i className="fas fa-calendar-times"></i>
                        <p>No bookings found</p>
                        {searchTerm && (
                          <button onClick={() => setSearchTerm("")}>
                            Clear Search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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

export default ViewBooking;