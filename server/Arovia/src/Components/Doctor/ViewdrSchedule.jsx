// ViewdrSchedule.jsx
import React, { useEffect, useState } from "react";
import "./Schedule.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewdrSchedule() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [bookingCounts, setBookingCounts] = useState({});
  const [allBookings, setAllBookings] = useState([]);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem("lid");
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      
      // Fetch schedules
      const scheduleRes = await axios.get(`${apiUrl}doctorviewschedule/${lid}`);
      console.log("Schedules:", scheduleRes.data);
      setData(scheduleRes.data);
      setFilteredData(scheduleRes.data);
      
      // Fetch all bookings for this doctor
      const bookingsRes = await axios.get(`${apiUrl}drviewbooking/${lid}`);
      console.log("All Bookings:", bookingsRes.data);
      setAllBookings(bookingsRes.data);
      
      // Calculate booking counts for each schedule
      const counts = {};
      scheduleRes.data.forEach(schedule => {
        const scheduleBookings = bookingsRes.data.filter(
          booking => booking.schedule?._id === schedule._id
        );
        counts[schedule._id] = scheduleBookings.length;
      });
      setBookingCounts(counts);
      
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
    let filtered = data.filter(schedule => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        schedule.date?.toLowerCase().includes(searchLower) ||
        schedule.fromtime?.toLowerCase().includes(searchLower) ||
        schedule.totime?.toLowerCase().includes(searchLower);
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date();
        const scheduleDate = new Date(schedule.date);
        const diffTime = scheduleDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateFilter === "today") {
          matchesDate = scheduleDate.toDateString() === today.toDateString();
        } else if (dateFilter === "upcoming") {
          matchesDate = diffDays > 0;
        } else if (dateFilter === "past") {
          matchesDate = diffDays < 0;
        }
      }
      
      return matchesSearch && matchesDate;
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, dateFilter]);

  const deletedata = async (id) => {
    try {
      await axios.get(`${apiUrl}deletesche/${id}`);
      fetchdata();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
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

  // Check if schedule is upcoming
  const isUpcoming = (dateString) => {
    const scheduleDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduleDate >= today;
  };

  const handleEdit = (schedule) => {
    navigate('/drhome/editsche', { state: schedule });
  };

  const handleViewBookings = (schedule) => {
    // Filter bookings for this specific schedule
    const scheduleBookings = allBookings.filter(
      booking => booking.schedule?._id === schedule._id
    );
    
    // Navigate to view bookings with the filtered data
    navigate('/drhome/viewdrbook', { 
      state: { 
        scheduleId: schedule._id,
        scheduleDate: schedule.date,
        scheduleFromTime: schedule.fromtime,
        scheduleToTime: schedule.totime,
        filteredBookings: scheduleBookings
      } 
    });
  };

  // Get total schedules count
  const totalSchedules = filteredData.length;
  const upcomingCount = data.filter(s => isUpcoming(s.date)).length;
  const pastCount = data.filter(s => !isUpcoming(s.date)).length;

  return (
    <div className="view-schedule-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>My Schedule</h2>
          <p>View and manage your appointment slots</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-calendar-week"></i>
            <span>Total: {totalSchedules}</span>
          </div>
          <div className="stat-badge upcoming">
            <i className="fas fa-calendar-day"></i>
            <span>Upcoming: {upcomingCount}</span>
          </div>
          <div className="stat-badge past">
            <i className="fas fa-calendar-check"></i>
            <span>Past: {pastCount}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="schedule-stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-info">
            <h3>{totalSchedules}</h3>
            <p>Total Schedules</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon upcoming-icon">
            <i className="fas fa-calendar-week"></i>
          </div>
          <div className="stat-info">
            <h3>{upcomingCount}</h3>
            <p>Upcoming</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon past-icon">
            <i className="fas fa-calendar-check"></i>
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
            placeholder="Search by date..."
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
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
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
          <p>Loading schedule...</p>
        </div>
      ) : (
        <>
          {/* Schedule Cards Grid */}
          {filteredData.length > 0 ? (
            <div className="schedule-cards-grid">
              {currentItems.map((schedule, index) => {
                const upcoming = isUpcoming(schedule.date);
                const bookingCount = bookingCounts[schedule._id] || 0;
                
                return (
                  <div key={schedule._id} className={`schedule-card ${upcoming ? 'upcoming' : 'past'}`}>
                    <div className="card-header">
                      <div className="card-number">#{indexOfFirstItem + index + 1}</div>
                      <div className={`status-badge ${upcoming ? 'upcoming' : 'past'}`}>
                        {upcoming ? 'Upcoming' : 'Past'}
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="date-section">
                        <i className="fas fa-calendar-alt"></i>
                        <div className="date-info">
                          <div className="date-full">{formatDate(schedule.date)}</div>
                          <div className="date-day">
                            {new Date(schedule.date).toLocaleDateString(undefined, { weekday: 'long' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="time-section">
                        <i className="fas fa-clock"></i>
                        <div className="time-info">
                          <div className="time-range">
                            {formatTime(schedule.fromtime)} - {formatTime(schedule.totime)}
                          </div>
                          <div className="time-duration">
                            {(() => {
                              const from = schedule.fromtime.split(':');
                              const to = schedule.totime.split(':');
                              const fromMinutes = parseInt(from[0]) * 60 + parseInt(from[1]);
                              const toMinutes = parseInt(to[0]) * 60 + parseInt(to[1]);
                              const duration = toMinutes - fromMinutes;
                              const hours = Math.floor(duration / 60);
                              const minutes = duration % 60;
                              if (hours > 0 && minutes > 0) {
                                return `${hours}h ${minutes}m`;
                              } else if (hours > 0) {
                                return `${hours}h`;
                              } else {
                                return `${minutes}m`;
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Booking Count Section */}
                      <div className="booking-count-section">
                        <div className={`booking-badge ${bookingCount > 0 ? 'has-bookings' : 'no-bookings'}`}>
                          <i className={`fas ${bookingCount > 0 ? 'fa-users' : 'fa-calendar-plus'}`}></i>
                          <span>{bookingCount} {bookingCount === 1 ? 'Booking' : 'Bookings'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <div className="action-buttons">
                        <button 
                         style={{padding:'0.6rem 0.8rem'}}
                          className="view-bookings-btn"
                          onClick={() => handleViewBookings(schedule)}
                          title="View Bookings for this schedule"
                        >
                          <i className="fas fa-calendar-check"></i>
                          <span>View Bookings</span>
                          {bookingCount > 0 && (
                            <span className="booking-count-indicator">{bookingCount}</span>
                          )}
                        </button>
                        <button 
                        style={{padding:'0.6rem 4.7rem'}}
                          className="edit-btn"
                          onClick={() => handleEdit(schedule)}
                          title="Edit Schedule"
                        >
                          <i className="fas fa-edit"></i>
                          <span>Edit</span>
                        </button>
                        <button 
                         style={{padding:'0.6rem 4.7rem'}}
                          className="delete-btn"
                          onClick={() => setDeleteConfirm(schedule._id)}
                          title="Delete Schedule"
                        >
                          <i className="fas fa-trash-alt"></i>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <i className="fas fa-calendar-times"></i>
              <p>No schedules found</p>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Confirm Delete</h3>
            </div>
            <p>Are you sure you want to delete this schedule? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="modal-confirm" onClick={() => deletedata(deleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewdrSchedule;