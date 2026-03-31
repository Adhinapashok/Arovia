// UsviewMedicine.jsx
import React, { useEffect, useState } from 'react'
import './UserviewMed.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UsviewMedicine() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}userviewmed`);
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
    <div className="userview-medicine-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>Medicine Inventory</h2>
          <p>Browse and view all available medicines</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-pills"></i>
            <span>Total Medicines: {filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="medicine-stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-icon">
            <i className="fas fa-pills"></i>
          </div>
          <div className="stat-info">
            <h3>{filteredData.length}</h3>
            <p>Total Medicines</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon categories-icon">
            <i className="fas fa-tags"></i>
          </div>
          <div className="stat-info">
            <h3>{uniqueCategories.length}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon in-stock-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{data.filter(m => (m.stock?.[0]?.quantity || 0) > 0).length}</h3>
            <p>In Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon low-stock-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <h3>{data.filter(m => (m.stock?.[0]?.quantity || 0) < 10 && (m.stock?.[0]?.quantity || 0) > 0).length}</h3>
            <p>Low Stock</p>
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
          {/* Medicine Cards Grid - Card Layout Instead of Table */}
          {filteredData.length > 0 ? (
            <div className="medicine-cards-grid">
              {currentItems.map((medicine, index) => {
                const stockQuantity = medicine.stock?.[0]?.quantity || 0;
                const expiryStatus = getExpiryStatus(medicine.expirydate);
                const stockStatus = getStockStatus(stockQuantity);
                
                return (
                  <div key={medicine._id} className={`medicine-card ${stockStatus}`}>
                    <div className="card-header">
                      <div className="medicine-number">#{indexOfFirstItem + index + 1}</div>
                      <div className={`stock-status-badge ${stockStatus}`}>
                        {stockStatus === 'in-stock' && 'In Stock'}
                        {stockStatus === 'low-stock' && 'Low Stock'}
                        {stockStatus === 'out-of-stock' && 'Out of Stock'}
                      </div>
                    </div>
                    
                    <div className="medicine-name-large">
                      <h3>{medicine.medname}</h3>
                      <p className="brand">{medicine.brandname}</p>
                    </div>
                    
                    <div className="medicine-details">
                      <div className="detail-item">
                        <i className="fas fa-tag"></i>
                        <span>Category:</span>
                        <strong>{medicine.category}</strong>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-flask"></i>
                        <span>Dosage:</span>
                        <strong>{medicine.dosagestrength}</strong>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>Mfg Date:</span>
                        <strong>{new Date(medicine.manufacture).toLocaleDateString()}</strong>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-rupee-sign"></i>
                        <span>Price:</span>
                        <strong className="price">₹{medicine.price}</strong>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-boxes"></i>
                        <span>Stock:</span>
                        <strong>{stockQuantity} units</strong>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-calendar-times"></i>
                        <span>Expiry:</span>
                        <strong className={`expiry-text ${expiryStatus}`}>
                          {new Date(medicine.expirydate).toLocaleDateString()}
                        </strong>
                      </div>
                    </div>
                    
                    <div className="expiry-status">
                      <div className={`expiry-badge ${expiryStatus}`}>
                        <i className={`fas ${expiryStatus === 'expired' ? 'fa-skull' : expiryStatus === 'expiring-soon' ? 'fa-hourglass-half' : 'fa-check-circle'}`}></i>
                        {expiryStatus === 'expired' && 'Expired'}
                        {expiryStatus === 'expiring-soon' && 'Expiring Soon'}
                        {expiryStatus === 'valid' && 'Valid'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <i className="fas fa-pills"></i>
              <p>No medicines found</p>
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

export default UsviewMedicine;