// ViewuserSchedule.jsx - Updated with decreasing slot count
import React, { useEffect, useState } from 'react'
import './ViewuserSchedule.css'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function ViewuserSchedule() {
  const location = useLocation();
  const user = location.state;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingLoading, setBookingLoading] = useState(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem("lid");

  // Helper function to calculate max slots based on time duration
  const calculateMaxSlots = (fromTime, toTime) => {
    const [startHour, startMinute] = fromTime.split(':').map(Number);
    const [endHour, endMinute] = toTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const durationMinutes = endMinutes - startMinutes;
    
    // 1 slot per 6 minutes (max 10 per hour)
    let maxSlots = Math.floor(durationMinutes / 6);
    // Set minimum and maximum limits
    maxSlots = Math.max(5, Math.min(50, maxSlots));
    
    return maxSlots;
  };

  // Helper function to check if schedule is in the past (based on date AND time)
  const isPastSchedule = (dateString, toTime) => {
    const scheduleDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If date is in the past, it's past
    if (scheduleDate < today) {
      return true;
    }
    
    // If date is today, check if end time has passed
    if (scheduleDate.toDateString() === today.toDateString()) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Compare current time with end time
      if (toTime < currentTime) {
        return true;
      }
    }
    
    return false;
  };

  // Helper function to check if schedule is available (future)
  const isAvailableSchedule = (dateString, toTime) => {
    return !isPastSchedule(dateString, toTime);
  };

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}doctorviewschedule/${user.login}`);
      console.log(res.data);
      
      // Filter out past schedules (based on date AND time) and only keep future/today schedules that haven't ended
      const futureSchedules = res.data.filter(schedule => 
        isAvailableSchedule(schedule.date, schedule.totime)
      );
      
      // Fetch booking counts for each schedule
      const schedulesWithCounts = await Promise.all(
        futureSchedules.map(async (schedule) => {
          try {
            const bookingsRes = await axios.get(`${apiUrl}schedulebookings/${schedule._id}`);
            const bookedCount = bookingsRes.data.count;
            const maxSlots = calculateMaxSlots(schedule.fromtime, schedule.totime);
            const availableSlots = maxSlots - bookedCount;
            
            return {
              ...schedule,
              bookedCount,
              maxSlots,
              availableSlots,
              isFullyBooked: availableSlots <= 0,
              isToday: new Date(schedule.date).toDateString() === new Date().toDateString(),
              bookingPercentage: (bookedCount / maxSlots) * 100
            };
          } catch (error) {
            console.error("Error fetching bookings for schedule:", schedule._id);
            const maxSlots = calculateMaxSlots(schedule.fromtime, schedule.totime);
            return {
              ...schedule,
              bookedCount: 0,
              maxSlots: maxSlots,
              availableSlots: maxSlots,
              isFullyBooked: false,
              isToday: new Date(schedule.date).toDateString() === new Date().toDateString(),
              bookingPercentage: 0
            };
          }
        })
      );
      
      setData(schedulesWithCounts);
      setFilteredData(schedulesWithCounts);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchdata();
    } else {
      navigate('/userhome/usviewdr');
    }
  }, [user]);

  // Search functionality
  useEffect(() => {
    let filtered = data.filter(schedule => {
      const searchLower = searchTerm.toLowerCase();
      return (
        schedule.date?.toLowerCase().includes(searchLower) ||
        schedule.fromtime?.toLowerCase().includes(searchLower) ||
        schedule.totime?.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const bookschedule = async (id) => {
    setBookingLoading(id);
    try {
      const res = await axios.post(`${apiUrl}userbookschedule`, { id, lid });
      if (res.data.status === "ok") {
        alert(res.data.message);
        // Refresh the schedule data to show updated availability
        await fetchdata();
        // Navigate to user home after successful booking
        navigate('/userhome');
      } else {
        alert(res.data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Error booking schedule:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Booking failed. Please try again.");
      } else {
        alert("Network error. Please check your connection and try again.");
      }
    } finally {
      setBookingLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="schedule-error">
        <i className="fas fa-exclamation-circle"></i>
        <h2>No Doctor Selected</h2>
        <p>Please select a doctor to view their schedule</p>
        <button onClick={() => navigate('/userhome/usviewdr')}>Back to Doctors</button>
      </div>
    );
  }

  if (!loading && filteredData.length === 0) {
    return (
      <div className="schedule-error">
        <i className="fas fa-calendar-times"></i>
        <h2>No Available Schedules</h2>
        <p>There are no upcoming appointments available for Dr. {user.name} at the moment.</p>
        <button onClick={() => navigate('/userhome/usviewdr')}>Back to Doctors</button>
      </div>
    );
  }

  return (
    <div className="view-schedule-container">
      {/* Doctor Info Header */}
      <div className="doctor-info-header">
        <div className="doctor-avatar-large">
          {user.photo ? (
            <img src={`${apiUrl}${user.photo}`} alt={user.name} />
          ) : (
            <i className="fas fa-user-md"></i>
          )}
        </div>
        <div className="doctor-details">
          <h2>Dr. {user.name}</h2>
          <p className="specialization">{user.specialization}</p>
          <p className="qualification">{user.qualification}</p>
          <div className="doctor-stats">
            <span>
              <i className="fas fa-briefcase"></i>
              {user.experience} years exp.
            </span>
            <span>
              <i className="fas fa-envelope"></i>
              {user.email}
            </span>
            <span>
              <i className="fas fa-phone"></i>
              {user.mobile}
            </span>
          </div>
        </div>
        <div className="back-button">
          <button onClick={() => navigate('/userhome/usviewdr')} className="back-btn">
            <i className="fas fa-arrow-left"></i>
            Back to Doctors
          </button>
        </div>
      </div>

      {/* Search Bar */}
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
        <button className="refresh-btn" onClick={fetchdata}>
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading available schedules...</p>
        </div>
      ) : (
        <>
          {/* Schedule Cards Grid */}
          {filteredData.length > 0 ? (
            <div className="schedule-cards-grid">
              {currentItems.map((schedule, index) => {
                const duration = (() => {
                  const from = schedule.fromtime.split(':');
                  const to = schedule.totime.split(':');
                  const fromMinutes = parseInt(from[0]) * 60 + parseInt(from[1]);
                  const toMinutes = parseInt(to[0]) * 60 + parseInt(to[1]);
                  const durationMinutes = toMinutes - fromMinutes;
                  const hours = Math.floor(durationMinutes / 60);
                  const minutes = durationMinutes % 60;
                  if (hours > 0 && minutes > 0) {
                    return `${hours}h ${minutes}m`;
                  } else if (hours > 0) {
                    return `${hours}h`;
                  } else {
                    return `${minutes}m`;
                  }
                })();
                
                const availableSlots = schedule.availableSlots || 0;
                const maxSlots = schedule.maxSlots || 0;
                const bookedSlots = schedule.bookedCount || 0;
                const isFullyBooked = schedule.isFullyBooked || availableSlots <= 0;
                const bookingPercentage = schedule.bookingPercentage || 0;
                
                // Show warning if schedule is today and end time is approaching
                const isToday = schedule.isToday;
                const currentTime = getCurrentTime();
                const isEndingSoon = isToday && schedule.totime > currentTime && 
                  (parseInt(schedule.totime.split(':')[0]) - parseInt(currentTime.split(':')[0]) <= 1);
                
                return (
                  <div key={schedule._id} className={`schedule-card ${isFullyBooked ? 'full' : 'available'}`}>
                    <div className="card-header">
                      <div className="card-number">#{indexOfFirstItem + index + 1}</div>
                      <div className={`status-badge ${isFullyBooked ? 'full' : 'available'}`}>
                        {isFullyBooked ? 'Fully Booked' : `${availableSlots} slots left`}
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="date-section">
                        <i className="fas fa-calendar-alt"></i>
                        <div className="date-info">
                          <div className="date-full">{formatDate(schedule.date)}</div>
                          <div className="date-day">
                            {new Date(schedule.date).toLocaleDateString(undefined, { weekday: 'long' })}
                            {isToday && <span className="today-badge">Today</span>}
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
                            <i className="fas fa-hourglass-half"></i>
                            {duration}
                          </div>
                          {isEndingSoon && !isFullyBooked && (
                            <div className="ending-soon-warning">
                              <i className="fas fa-exclamation-triangle"></i>
                              Ends soon!
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Availability Info with Progress Bar */}
                      <div className="availability-info">
                        <i className="fas fa-users"></i>
                        <div className="availability-details">
                          <div className="slots-info">
                            <span className={`availability-status ${!isFullyBooked ? 'available' : 'full'}`}>
                              {!isFullyBooked ? `${availableSlots} slots available` : 'No slots available'}
                            </span>
                            <span className="total-slots">({maxSlots} total slots)</span>
                          </div>
                          <div className="slot-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${bookingPercentage}%` }}
                              ></div>
                            </div>
                            <span className="booked-count">{bookedSlots} booked</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      {!isFullyBooked ? (
                        <button 
                          className="book-btn"
                          onClick={() => bookschedule(schedule._id)}
                          disabled={bookingLoading === schedule._id}
                        >
                          {bookingLoading === schedule._id ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i>
                              Booking...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-calendar-check"></i>
                              Book Appointment
                            </>
                          )}
                        </button>
                      ) : (
                        <button className="book-btn disabled" disabled>
                          <i className="fas fa-clock"></i>
                          Fully Booked
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
              <p>No available schedules found</p>
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
    </div>
  );
}

export default ViewuserSchedule;