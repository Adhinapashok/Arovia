// ViewSchedule.js
import React, { useEffect, useState } from "react";
import "./ViewSchedule.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ViewSchedule() {
  const location = useLocation();
  const user = location.state;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}adminviewschedule/${user?._id}`);
      console.log(res.data);
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchdata();
    }
  }, [user]);

  // Search functionality
  useEffect(() => {
    const filtered = data.filter(schedule => {
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

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if schedule is upcoming
  const isUpcoming = (dateString) => {
    const scheduleDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduleDate >= today;
  };

  if (!user) {
    return (
      <div className="view-schedule-container">
        <div className="no-data-content">
          <i className="fas fa-exclamation-circle"></i>
          <h2>No Doctor Selected</h2>
          <p>Please select a doctor to view their schedule.</p>
          <button className="back-btn" onClick={() => navigate('/home/viewdr')}>
            <i className="fas fa-arrow-left"></i>
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-schedule-container">
      {/* Header with Doctor Info */}
      <div className="view-header">
        <div className="header-left">
          <h2>Doctor Schedule</h2>
          <p>View and manage doctor's appointment schedule</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-clock"></i>
            <span>Total Schedules: {filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Doctor Info Card */}
      <div className="doctor-info-card">
        <div className="doctor-avatar">
          <i className="fas fa-user-md"></i>
        </div>
        <div className="doctor-details">
          <h3>{user.name}</h3>
          <div className="doctor-meta">
            <span>
              <i className="fas fa-stethoscope"></i>
              {user.specialization}
            </span>
            <span>
              <i className="fas fa-graduation-cap"></i>
              {user.qualification}
            </span>
            <span>
              <i className="fas fa-briefcase"></i>
              {user.experience} years
            </span>
          </div>
        </div>
        <div className="schedule-stats">
          <div className="stat-item">
            <span className="stat-value">{data.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {data.filter(s => isUpcoming(s.date)).length}
            </span>
            <span className="stat-label">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by date or time..."
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
          <p>Loading schedule...</p>
        </div>
      ) : (
        <>
          {/* Schedule Grid */}
          {filteredData.length > 0 ? (
            <div className="schedule-grid">
              {currentItems.map((schedule, index) => {
                const upcoming = isUpcoming(schedule.date);
                
                return (
                  <div key={index} className={`schedule-card ${upcoming ? 'upcoming' : 'past'}`}>
                    <div className="schedule-card-header">
                      <span className="schedule-number">#{indexOfFirstItem + index + 1}</span>
                      <span className={`status-badge ${upcoming ? 'upcoming' : 'past'}`}>
                        {upcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    
                    <div className="schedule-card-body">
                      <div className="date-info">
                        <i className="fas fa-calendar-alt"></i>
                        <div>
                          <div className="date-full">{formatDate(schedule.date)}</div>
                          <div className="date-day">
                            {new Date(schedule.date).toLocaleDateString(undefined, { weekday: 'long' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="time-info">
                        <i className="fas fa-clock"></i>
                        <div>
                          <div className="time-range">
                            {schedule.fromtime} - {schedule.totime}
                          </div>
                          <div className="time-duration">
                            {(() => {
                              const from = schedule.fromtime.split(':');
                              const to = schedule.totime.split(':');
                              const fromMinutes = parseInt(from[0]) * 60 + parseInt(from[1]);
                              const toMinutes = parseInt(to[0]) * 60 + parseInt(to[1]);
                              const duration = toMinutes - fromMinutes;
                              return `${duration} minutes`;
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="schedule-card-footer">
                      <span className="doctor-name">
                        <i className="fas fa-user-md"></i>
                        Dr. {user.name}
                      </span>
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
    </div>
  );
}

export default ViewSchedule;