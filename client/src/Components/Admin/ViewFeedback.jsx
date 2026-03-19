// ViewFeedback.js
import React, { useEffect, useState } from 'react'
import './ViewFeedback.css'
import axios from 'axios'

function ViewFeedback() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  
  const apiUrl = import.meta.env.VITE_API_URL

  const fetchdata = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${apiUrl}adminviewfeedback`)
      console.log(res.data)
      setData(res.data)
      setFilteredData(res.data)
    } catch (error) {
      console.error("Error fetching feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchdata()
  }, [])

  // Search and filter functionality
  useEffect(() => {
    let filtered = data.filter(feedback => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        feedback.review?.toLowerCase().includes(searchLower) ||
        feedback.date?.includes(searchTerm)
      
      const matchesRating = ratingFilter === "all" || feedback.rating === parseInt(ratingFilter)
      
      return matchesSearch && matchesRating
    })

    // Sort feedback
    if (sortOrder === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortOrder === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortOrder === "highest") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortOrder === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating)
    }
    
    setFilteredData(filtered)
    setCurrentPage(1)
  }, [searchTerm, data, ratingFilter, sortOrder])

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Render star rating
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`fas fa-star ${i <= rating ? 'filled' : 'empty'}`}
        ></i>
      )
    }
    return stars
  }

  // Get rating color
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'excellent'
    if (rating >= 3) return 'good'
    if (rating >= 2) return 'average'
    return 'poor'
  }

  // Calculate average rating
  const averageRating = data.length > 0 
    ? (data.reduce((acc, curr) => acc + curr.rating, 0) / data.length).toFixed(1)
    : 0

  return (
    <div className="view-feedback-container">
      {/* Header Section */}
      <div className="view-header">
        <div className="header-left">
          <h2>Patient Feedback</h2>
          <p>View and manage patient reviews and ratings</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <i className="fas fa-star"></i>
            <span>Total Feedback: {filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <i className="fas fa-comment"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{data.length}</span>
            <span className="stat-label">Total Reviews</span>
          </div>
        </div>
        
        <div className="stat-card average">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{averageRating}</span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
        
        <div className="stat-card excellent">
          <div className="stat-icon">
            <i className="fas fa-smile"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {data.filter(f => f.rating >= 4).length}
            </span>
            <span className="stat-label">Excellent (4-5⭐)</span>
          </div>
        </div>
        
        <div className="stat-card poor">
          <div className="stat-icon">
            <i className="fas fa-frown"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {data.filter(f => f.rating <= 2).length}
            </span>
            <span className="stat-label">Poor (1-2⭐)</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search reviews..."
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
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select 
            className="filter-select" 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
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
          <p>Loading feedback...</p>
        </div>
      ) : (
        <>
          {/* Feedback Grid */}
          {filteredData.length > 0 ? (
            <div className="feedback-grid">
              {currentItems.map((feedback, index) => (
                <div key={index} className="feedback-card">
                  <div className="feedback-header">
                    <span className="feedback-number">#{indexOfFirstItem + index + 1}</span>
                    <span className="feedback-date">
                      <i className="far fa-calendar-alt"></i>
                      {formatDate(feedback.date)}
                    </span>
                  </div>
                  
                  <div className="feedback-rating">
                    <div className="stars">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className={`rating-badge ${getRatingColor(feedback.rating)}`}>
                      {feedback.rating}.0
                    </span>
                  </div>
                  
                  <div className="feedback-review">
                    <i className="fas fa-quote-left"></i>
                    <p>{feedback.review}</p>
                  </div>
                  
                  <div className="feedback-footer">
                    <span className="rating-label">
                      {feedback.rating === 5 ? 'Excellent' :
                       feedback.rating === 4 ? 'Very Good' :
                       feedback.rating === 3 ? 'Good' :
                       feedback.rating === 2 ? 'Average' : 'Poor'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <i className="fas fa-star"></i>
              <p>No feedback found</p>
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
                  const pageNum = i + 1
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
                    )
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="page-dots">...</span>
                  }
                  return null
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
  )
}

export default ViewFeedback