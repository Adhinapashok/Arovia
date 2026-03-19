// ViewStaff.js
import React, { useEffect, useState } from "react";
import "./ViewDoctor.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewStaff() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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

  const deletedata = async (id) => {
    try {
      await axios.get(`${apiUrl}deletestf/${id}`);
      fetchdata();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleEdit = (staff) => {
    navigate('/home/editstf', { state: staff });
  };

  // Get unique roles for filter
  const uniqueRoles = [...new Set(data.map(staff => staff.role))];

  return (
    <div className="view-staff-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>Staff Management</h2>
          <p>Manage and view all staff members in the system</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-users"></i>
            <span>Total Staff: {filteredData.length}</span>
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
          {/* Staff Table */}
          <div className="table-responsive">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Staff Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Qualification</th>
                  <th>Role</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((staff, index) => (
                    <tr key={staff._id} className="staff-row">
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>
                        <div className="staff-photo">
                          <img 
                            src={`${apiUrl}${staff.photo}`} 
                            alt={staff.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/50';
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="staff-name">
                          <span className="name">{staff.name}</span>
                        </div>
                      </td>
                      <td>{staff.email}</td>
                      <td>{staff.phoneno}</td>
                      <td>
                        <span className={`badge gender-${staff.gender?.toLowerCase()}`}>
                          {staff.gender}
                        </span>
                      </td>
                      <td>{new Date(staff.dob).toLocaleDateString()}</td>
                      <td>{staff.qualification}</td>
                      <td>
                        <span className="badge role-badge">
                          {staff.role}
                        </span>
                      </td>
                      <td>
                        <span className="experience-badge">
                          {staff.experience} years
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEdit(staff)}
                            title="Edit Staff"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => setDeleteConfirm(staff._id)}
                            title="Delete Staff"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="no-data">
                      <div className="no-data-content">
                        <i className="fas fa-users"></i>
                        <p>No staff members found</p>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Confirm Delete</h3>
            </div>
            <p>Are you sure you want to delete this staff member? This action cannot be undone.</p>
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

export default ViewStaff;