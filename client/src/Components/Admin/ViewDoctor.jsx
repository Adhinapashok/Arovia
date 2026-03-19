// ViewDoctor.js
import React, { useEffect, useState } from "react";
import "./ViewDoctor.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ViewDoctor() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}adminviewdoctor`);
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

  // Search functionality
  useEffect(() => {
    const filtered = data.filter(doctor => {
      const searchLower = searchTerm.toLowerCase();
      return (
        doctor.name?.toLowerCase().includes(searchLower) ||
        doctor.email?.toLowerCase().includes(searchLower) ||
        doctor.mobile?.includes(searchTerm) ||
        doctor.specialization?.toLowerCase().includes(searchLower) ||
        doctor.qualification?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const deletedata = async (id) => {
    try {
      await axios.get(`${apiUrl}deletedr/${id}`);
      fetchdata();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleEdit = (doctor) => {
    navigate('/editdr', { state: doctor });
  };

  return (
    <div className="view-doctor-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>Doctor Management</h2>
          <p>Manage and view all doctors in the system</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-user-md"></i>
            <span>Total Doctors: {filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, phone, specialization..."
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
          <select className="filter-select" onChange={(e) => {
            if (e.target.value === "all") {
              setFilteredData(data);
            } else {
              const filtered = data.filter(doc => doc.specialization === e.target.value);
              setFilteredData(filtered);
            }
          }}>
            <option value="all">All Specializations</option>
            {[...new Set(data.map(doc => doc.specialization))].map(spec => (
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
          {/* Doctors Table */}
          <div className="table-responsive">
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Qualification</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((doctor, index) => (
                    <tr key={doctor._id} className="doctor-row">
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>
                        <div className="doctor-photo">
                          <img 
                            src={`${apiUrl}${doctor.photo}`} 
                            alt={doctor.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/50';
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="doctor-name">
                          <span className="name">{doctor.name}</span>
                        </div>
                      </td>
                      <td>{doctor.email}</td>
                      <td>{doctor.mobile}</td>
                      <td>
                        <span className={`badge gender-${doctor.gender?.toLowerCase()}`}>
                          {doctor.gender}
                        </span>
                      </td>
                      <td>{new Date(doctor.dob).toLocaleDateString()}</td>
                      <td>{doctor.qualification}</td>
                      <td>
                        <span className="badge specialization">
                          {doctor.specialization}
                        </span>
                      </td>
                      <td>
                        <span className="experience-badge">
                          {doctor.experience} years
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEdit(doctor)}
                            title="Edit Doctor"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => setDeleteConfirm(doctor._id)}
                            title="Delete Doctor"
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
                        <i className="fas fa-user-md"></i>
                        <p>No doctors found</p>
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
            <p>Are you sure you want to delete this doctor? This action cannot be undone.</p>
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

export default ViewDoctor;