// ViewMedicine.js
import React, { useEffect, useState } from 'react'
import './ViewMedicine.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewMedicine() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}viewmed`);
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
    let filtered = data.filter(medicine => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        medicine.medname?.toLowerCase().includes(searchLower) ||
        medicine.brandname?.toLowerCase().includes(searchLower) ||
        medicine.category?.toLowerCase().includes(searchLower) ||
        medicine.dosagestrength?.toLowerCase().includes(searchLower);
      
      const matchesCategory = categoryFilter === "all" || medicine.category === categoryFilter;
      
      const stockQuantity = medicine.stock?.[0]?.quantity || 0;
      let matchesStock = true;
      if (stockFilter === "low") {
        matchesStock = stockQuantity < 10;
      } else if (stockFilter === "out") {
        matchesStock = stockQuantity === 0;
      } else if (stockFilter === "available") {
        matchesStock = stockQuantity > 0;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, categoryFilter, stockFilter]);

  const deletedata = async (id) => {
    try {
      await axios.get(`${apiUrl}deletemed/${id}`);
      fetchdata();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleEdit = (medicine) => {
    navigate('/home/editmed', { state: medicine });
  };

  const handleAddStock = (medicine) => {
    navigate('/home/addstk', { state: medicine });
  };

  // Get unique categories for filter
  const uniqueCategories = [...new Set(data.map(med => med.category))];

  // Check expiry status
  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 30) return 'expiring-soon';
    return 'valid';
  };

  // Get stock status
  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="view-medicine-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>Medicine Inventory</h2>
          <p>Manage and view all medicines in stock</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-pills"></i>
            <span>Total Medicines: {filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by medicine name, brand, category..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            className="filter-select" 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="available">In Stock</option>
            <option value="low">Low Stock (&lt;10)</option>
            <option value="out">Out of Stock</option>
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
          <p>Loading medicines...</p>
        </div>
      ) : (
        <>
          {/* Medicine Table */}
          <div className="table-responsive">
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Dosage</th>
                  <th>Manufacture</th>
                  <th>Price (₹)</th>
                  <th>Stock</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((medicine, index) => {
                    const stockQuantity = medicine.stock?.[0]?.quantity || 0;
                    const expiryStatus = getExpiryStatus(medicine.expirydate);
                    const stockStatus = getStockStatus(stockQuantity);
                    
                    return (
                      <tr key={medicine._id} className="medicine-row">
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <div className="medicine-name">
                            <span className="name">{medicine.medname}</span>
                          </div>
                        </td>
                        <td>{medicine.brandname}</td>
                        <td>
                          <span className="badge category-badge">
                            {medicine.category}
                          </span>
                        </td>
                        <td>{medicine.dosagestrength}</td>
                        <td>{new Date(medicine.manufacture).toLocaleDateString()}</td>
                        <td>
                          <span className="price">₹{medicine.price}</span>
                        </td>
                        <td>
                          <div className="stock-info">
                            <span className={`stock-badge ${stockStatus}`}>
                              {stockQuantity} units
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`expiry-badge ${expiryStatus}`}>
                            {new Date(medicine.expirydate).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${expiryStatus}`}>
                            {expiryStatus === 'expired' ? 'Expired' : 
                             expiryStatus === 'expiring-soon' ? 'Expiring Soon' : 'Valid'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => handleEdit(medicine)}
                              title="Edit Medicine"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="stock-btn"
                              onClick={() => handleAddStock(medicine)}
                              title="Update Stock"
                            >
                              <i className="fas fa-boxes"></i>
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => setDeleteConfirm(medicine._id)}
                              title="Delete Medicine"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className="no-data">
                      <div className="no-data-content">
                        <i className="fas fa-pills"></i>
                        <p>No medicines found</p>
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
            <p>Are you sure you want to delete this medicine? This action cannot be undone.</p>
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

export default ViewMedicine;