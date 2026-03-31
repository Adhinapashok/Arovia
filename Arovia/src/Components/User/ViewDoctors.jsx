// ViewDoctors.jsx - Increased font sizes, removed rating
import React, { useEffect, useState } from 'react'
import './ViewDoctors.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewDoctors() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [specializationFilter, setSpecializationFilter] = useState("all");
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}adminviewdoctor`);
      console.log(res.data);
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    let filtered = data.filter(doctor => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        doctor.name?.toLowerCase().includes(searchLower) ||
        doctor.email?.toLowerCase().includes(searchLower) ||
        doctor.mobile?.includes(searchTerm) ||
        doctor.specialization?.toLowerCase().includes(searchLower) ||
        doctor.qualification?.toLowerCase().includes(searchLower);
      
      const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter;
      
      return matchesSearch && matchesSpecialization;
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, specializationFilter]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get unique specializations for filter
  const uniqueSpecializations = [...new Set(data.map(doc => doc.specialization))];

  const handleViewSchedule = (doctor) => {
    navigate('/userhome/usviewsch', { state: doctor });
  };

  return (
    <div className="view-doctors-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>Our Doctors</h2>
          <p>Find and book appointments with our experienced specialists</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-user-md"></i>
            <span>{filteredData.length} Doctors Available</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, specialization, qualification..."
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
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="all">All Specializations</option>
            {uniqueSpecializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
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
          <p>Loading doctors...</p>
        </div>
      ) : (
        <>
          {/* Doctors Grid */}
          {filteredData.length > 0 ? (
            <div className="doctors-grid">
              {currentItems.map((doctor, index) => (
                <div key={doctor._id} className="doctor-card">
                  <div className="doctor-card-header">
                    <div className="doctor-number">#{indexOfFirstItem + index + 1}</div>
                  </div>
                  
                  <div className="doctor-avatar">
                    <img 
                      src={`${apiUrl}${doctor.photo}`} 
                      alt={doctor.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100?text=Doctor';
                      }}
                    />
                  </div>
                  
                  <div className="doctor-name">
                    <h3>Dr. {doctor.name}</h3>
                  </div>
                  
                  <div className="doctor-specialization">
                    <span className="specialization-badge">{doctor.specialization}</span>
                  </div>
                  
                  <div className="doctor-qualification">
                    <p>{doctor.qualification}</p>
                  </div>
                  
                  <div className="doctor-experience">
                    <i className="fas fa-briefcase"></i>
                    <span>{doctor.experience} years experience</span>
                  </div>
                  
                  <div className="doctor-contact-info">
                    <div className="contact-email">
                      <i className="fas fa-envelope"></i>
                      <span>{doctor.email}</span>
                    </div>
                    <div className="contact-phone">
                      <i className="fas fa-phone"></i>
                      <span>{doctor.mobile}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="view-schedule-btn"
                    onClick={() => handleViewSchedule(doctor)}
                  >
                    View Schedule
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <i className="fas fa-user-md"></i>
              <p>No doctors found</p>
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

export default ViewDoctors;