// DoctorViewStaff.js
import React, { useEffect, useState } from "react";
import "./DoctorViewStaff.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DoctorViewStaff() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [roleFilter, setRoleFilter] = useState("all");
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}viewstaff`);
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
    let filtered = data.filter(staff => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        staff.name?.toLowerCase().includes(searchLower) ||
        staff.email?.toLowerCase().includes(searchLower) ||
        staff.phoneno?.includes(searchTerm) ||
        staff.role?.toLowerCase().includes(searchLower) ||
        staff.qualification?.toLowerCase().includes(searchLower);
      
      const matchesRole = roleFilter === "all" || staff.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, roleFilter]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get unique roles for filter
  const uniqueRoles = [...new Set(data.map(staff => staff.role))];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="doctor-staff-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>Staff Directory</h2>
          <p>View all hospital staff members</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-users"></i>
            <span>Total Staff: {filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="staff-stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{filteredData.length}</h3>
            <p>Total Staff</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon roles-icon">
            <i className="fas fa-tags"></i>
          </div>
          <div className="stat-info">
            <h3>{uniqueRoles.length}</h3>
            <p>Departments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon experience-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3>
              {data.length > 0 
                ? Math.round(data.reduce((acc, curr) => acc + parseInt(curr.experience || 0), 0) / data.length)
                : 0}
            </h3>
            <p>Avg Experience (yrs)</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, phone, role, qualification..."
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
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
          <p>Loading staff members...</p>
        </div>
      ) : (
        <>
          {/* Staff Cards Grid */}
          {filteredData.length > 0 ? (
            <div className="staff-cards-grid">
              {currentItems.map((staff, index) => (
                <div key={staff._id} className="staff-card">
                  <div className="card-header">
                    <div className="staff-number">#{indexOfFirstItem + index + 1}</div>
                    <div className="role-badge" style={{ background: getRoleColor(staff.role) }}>
                      {staff.role}
                    </div>
                  </div>
                  
                  <div className="staff-avatar">
                    <img 
                      src={`${apiUrl}${staff.photo}`} 
                      alt={staff.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100?text=Staff';
                      }}
                    />
                  </div>
                  
                  <div className="staff-info">
                    <h3>{staff.name}</h3>
                    <p className="qualification">{staff.qualification}</p>
                    <div className="experience">
                      <i className="fas fa-briefcase"></i>
                      {staff.experience} years experience
                    </div>
                  </div>
                  
                  <div className="staff-contact">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>{staff.email}</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>{staff.phoneno}</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-venus-mars"></i>
                      <span>{staff.gender}</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-calendar"></i>
                      <span>DOB: {formatDate(staff.dob)}</span>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="staff-badge">
                      <i className="fas fa-id-card"></i>
                      Staff ID: {staff._id?.slice(-6).toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <i className="fas fa-users-slash"></i>
              <p>No staff members found</p>
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

// Helper function to get role color
const getRoleColor = (role) => {
  const colors = {
    'Nurse': 'linear-gradient(135deg, #10b981, #059669)',
    'Doctor': 'linear-gradient(135deg, #3b82f6, #2563eb)',
    'Receptionist': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'Lab Technician': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'Pharmacist': 'linear-gradient(135deg, #ec4899, #db2777)',
    'Administrative': 'linear-gradient(135deg, #6366f1, #4f46e5)',
    'HR': 'linear-gradient(135deg, #14b8a6, #0d9488)',
    'Cleaner': 'linear-gradient(135deg, #6b7280, #4b5563)',
    'Security': 'linear-gradient(135deg, #1f2937, #111827)'
  };
  return colors[role] || 'linear-gradient(135deg, #6b7280, #4b5563)';
};

export default DoctorViewStaff;