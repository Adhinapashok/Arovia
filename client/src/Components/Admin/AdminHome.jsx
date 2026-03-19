// AdminHome.js - Updated version without edit options
import React, { useState, useEffect } from "react";
import "./AdminHome.css";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update active section based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/home') {
      setActiveSection('dashboard');
    } else if (path.includes('/adddr') || path.includes('/viewdr')) {
      setActiveSection('doctors');
    } else if (path.includes('/addstf') || path.includes('/viewstf')) {
      setActiveSection('staff');
    } else if (path.includes('/addmed') || path.includes('/viewmed')) {
      setActiveSection('medicines');
    } else if (path.includes('/viewbook')) {
      setActiveSection('bookings');
    } else if (path.includes('/viewfeed')) {
      setActiveSection('feedback');
    } else if (path.includes('/admchngpas')) {
      setActiveSection('security');
    } else if (path.includes('/viewsche')) {
      setActiveSection('schedule');
    } else if (path.includes('/viewpresc')) {
      setActiveSection('prescriptions');
    } else if (path.includes('/addstk')) {
      setActiveSection('stock');
    }
  }, [location]);

  // Format date
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Navigation handlers - Updated paths to include /home prefix
  const handleNavigation = (path, section) => {
    setActiveSection(section);
    navigate(`/home${path}`);
  };

  // Stats data
  const stats = {
    doctors: 75,
    staff: 45,
    medicines: 120,
    bookings: 310,
    feedback: 250,
    prescriptions: 180,
    schedule: 45,
    stock: 65
  };

  // Check if current path is dashboard
  const isDashboard = location.pathname === '/home';

  return (
    <div className="adminhome">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <h2>AROVIA</h2>
          <span className="logo-badge">Healthcare</span>
        </div>

        <div className="admin-profile-card" onClick={() => handleNavigation('/viewdrprof', 'profile')}>
          <div className="profile-avatar">
            <div className="avatar-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="profile-info">
              <h4>Dr. Admin</h4>
              <p>Administrator</p>
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">12</span>
              <span className="stat-label">Years</span>
            </div>
            <div className="stat">
              <span className="stat-value">5k+</span>
              <span className="stat-label">Patients</span>
            </div>
            <div className="stat">
              <span className="stat-value">98%</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>

        <nav className="nav-section">
          {/* Dashboard */}
          <div 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('', 'dashboard')}
          >
            <i className="fas fa-chart-pie"></i>
            <div className="nav-info">
              <span className="nav-label">Dashboard</span>
              <span className="nav-count">Overview</span>
            </div>
          </div>

          {/* Doctors Section */}
          <div className="nav-group">
            <div 
              className={`nav-item ${activeSection === 'doctors' ? 'active' : ''}`}
            >
              <i className="fas fa-user-md"></i>
              <div className="nav-info">
                <span className="nav-label">Doctors</span>
                <span className="nav-count">{stats.doctors} Total</span>
              </div>
              <i className="fas fa-chevron-down nav-arrow"></i>
            </div>
            <div className="nav-subitems">
              <div 
                className={`nav-item small ${location.pathname === '/home/adddr' ? 'active' : ''}`}
                onClick={() => handleNavigation('/adddr', 'doctors')}
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add Doctor</span>
              </div>
              <div 
                className={`nav-item small ${location.pathname === '/home/viewdr' ? 'active' : ''}`}
                onClick={() => handleNavigation('/viewdr', 'doctors')}
              >
                <i className="fas fa-list"></i>
                <span>View All</span>
              </div>
            </div>
          </div>

          {/* Staff Section */}
          <div className="nav-group">
            <div 
              className={`nav-item ${activeSection === 'staff' ? 'active' : ''}`}
            >
              <i className="fas fa-users"></i>
              <div className="nav-info">
                <span className="nav-label">Staff</span>
                <span className="nav-count">{stats.staff} Total</span>
              </div>
              <i className="fas fa-chevron-down nav-arrow"></i>
            </div>
            <div className="nav-subitems">
              <div 
                className={`nav-item small ${location.pathname === '/home/addstf' ? 'active' : ''}`}
                onClick={() => handleNavigation('/addstf', 'staff')}
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add Staff</span>
              </div>
              <div 
                className={`nav-item small ${location.pathname === '/home/viewstf' ? 'active' : ''}`}
                onClick={() => handleNavigation('/viewstf', 'staff')}
              >
                <i className="fas fa-list"></i>
                <span>View All</span>
              </div>
            </div>
          </div>

          {/* Medicines Section */}
          <div className="nav-group">
            <div 
              className={`nav-item ${activeSection === 'medicines' ? 'active' : ''}`}
            >
              <i className="fas fa-pills"></i>
              <div className="nav-info">
                <span className="nav-label">Medicines</span>
                <span className="nav-count">{stats.medicines} Items</span>
              </div>
              <i className="fas fa-chevron-down nav-arrow"></i>
            </div>
            <div className="nav-subitems">
              <div 
                className={`nav-item small ${location.pathname === '/home/addmed' ? 'active' : ''}`}
                onClick={() => handleNavigation('/addmed', 'medicines')}
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add Medicine</span>
              </div>
              <div 
                className={`nav-item small ${location.pathname === '/home/viewmed' ? 'active' : ''}`}
                onClick={() => handleNavigation('/viewmed', 'medicines')}
              >
                <i className="fas fa-list"></i>
                <span>View All</span>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div 
            className={`nav-item ${activeSection === 'stock' ? 'active' : ''}`}
            onClick={() => handleNavigation('/addstk', 'stock')}
          >
            <i className="fas fa-boxes"></i>
            <div className="nav-info">
              <span className="nav-label">Stock</span>
              <span className="nav-count">{stats.stock} Items</span>
            </div>
          </div>

          {/* Bookings */}
          <div 
            className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => handleNavigation('/viewbook', 'bookings')}
          >
            <i className="fas fa-calendar-check"></i>
            <div className="nav-info">
              <span className="nav-label">Bookings</span>
              <span className="nav-count">{stats.bookings} Appointments</span>
            </div>
          </div>

          {/* Prescriptions */}
          <div 
            className={`nav-item ${activeSection === 'prescriptions' ? 'active' : ''}`}
            onClick={() => handleNavigation('/viewpresc', 'prescriptions')}
          >
            <i className="fas fa-prescription"></i>
            <div className="nav-info">
              <span className="nav-label">Prescriptions</span>
              <span className="nav-count">{stats.prescriptions} Total</span>
            </div>
          </div>

          {/* Schedule */}
          <div 
            className={`nav-item ${activeSection === 'schedule' ? 'active' : ''}`}
            onClick={() => handleNavigation('/viewsche', 'schedule')}
          >
            <i className="fas fa-clock"></i>
            <div className="nav-info">
              <span className="nav-label">Schedule</span>
              <span className="nav-count">{stats.schedule} Appointments</span>
            </div>
          </div>

          {/* Feedback */}
          <div 
            className={`nav-item ${activeSection === 'feedback' ? 'active' : ''}`}
            onClick={() => handleNavigation('/viewfeed', 'feedback')}
          >
            <i className="fas fa-star"></i>
            <div className="nav-info">
              <span className="nav-label">Feedback</span>
              <span className="nav-count">{stats.feedback} Reviews</span>
            </div>
          </div>

          {/* Security */}
          <div 
            className={`nav-item ${activeSection === 'security' ? 'active' : ''}`}
            onClick={() => handleNavigation('/admchngpas', 'security')}
          >
            <i className="fas fa-lock"></i>
            <div className="nav-info">
              <span className="nav-label">Security</span>
              <span className="nav-count">Change Password</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <h1>Welcome back, Admin</h1>
            <div className="date-badge">
              <i className="far fa-calendar-alt"></i>
              <span>{formattedDate}</span>
              <i className="far fa-clock" style={{ marginLeft: '1rem' }}></i>
              <span>{formattedTime}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="header-actions">
              <button className="notification-btn">
                <i className="far fa-bell"></i>
                <span className="notification-badge">3</span>
              </button>
              <button 
                className="settings-btn"
                onClick={() => handleNavigation('/viewdrprof', 'profile')}
              >
                <i className="fas fa-user-circle"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content - This is where the child routes will render */}
        <div className="page-container">
          {isDashboard ? <DashboardHome stats={stats} onNavigate={handleNavigation} /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}

// Dashboard Home Component
const DashboardHome = ({ stats, onNavigate }) => {
  const recentActivities = [
    { icon: 'user-md', text: 'New doctor Dr. Smith joined', time: '5 min ago', color: '#3b82f6', path: '/viewdr' },
    { icon: 'calendar-check', text: 'New appointment booked', time: '15 min ago', color: '#8b5cf6', path: '/viewbook' },
    { icon: 'pills', text: 'Medicine stock updated', time: '1 hour ago', color: '#ec4899', path: '/viewmed' },
    { icon: 'star', text: 'New feedback received', time: '2 hours ago', color: '#f59e0b', path: '/viewfeed' },
    { icon: 'user', text: 'New staff member added', time: '3 hours ago', color: '#10b981', path: '/viewstf' },
    { icon: 'prescription', text: 'Prescription generated', time: '4 hours ago', color: '#6366f1', path: '/viewpresc' }
  ];

  return (
    <div className="dashboard-home">
      <div className="quick-stats">
        <div className="stat-card" onClick={() => onNavigate('/viewdr', 'doctors')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <i className="fas fa-user-md"></i>
          </div>
          <h4>Total Doctors</h4>
          <span className="stat-number">{stats.doctors}</span>
          <span className="stat-trend">
            <i className="fas fa-arrow-up"></i> 12% this month
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewstf', 'staff')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <i className="fas fa-users"></i>
          </div>
          <h4>Total Staff</h4>
          <span className="stat-number">{stats.staff}</span>
          <span className="stat-trend">
            <i className="fas fa-arrow-up"></i> 8% this month
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewmed', 'medicines')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            <i className="fas fa-pills"></i>
          </div>
          <h4>Medicines</h4>
          <span className="stat-number">{stats.medicines}</span>
          <span className="stat-trend down">
            <i className="fas fa-arrow-down"></i> 5% low stock
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewbook', 'bookings')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <h4>Bookings</h4>
          <span className="stat-number">{stats.bookings}</span>
          <span className="stat-trend">
            <i className="fas fa-arrow-up"></i> 23% this week
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewfeed', 'feedback')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <i className="fas fa-star"></i>
          </div>
          <h4>Feedback</h4>
          <span className="stat-number">{stats.feedback}</span>
          <span className="stat-trend">
            <i className="fas fa-arrow-up"></i> 15% this week
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewpresc', 'prescriptions')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <i className="fas fa-prescription"></i>
          </div>
          <h4>Prescriptions</h4>
          <span className="stat-number">{stats.prescriptions}</span>
          <span className="stat-trend">
            <i className="fas fa-arrow-up"></i> 7% this week
          </span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item recent-activities">
          <div className="section-header">
            <h2>Recent Activities</h2>
            <span className="view-all" onClick={() => onNavigate('/viewdr', 'doctors')}>
              View All <i className="fas fa-arrow-right"></i>
            </span>
          </div>

          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div 
                className="activity-item" 
                key={index}
                onClick={() => onNavigate(activity.path, activity.icon)}
              >
                <div className="activity-icon" style={{ background: `linear-gradient(135deg, ${activity.color}, ${activity.color}dd)` }}>
                  <i className={`fas fa-${activity.icon}`}></i>
                </div>
                <div className="activity-details">
                  <p>{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <i className="fas fa-chevron-right" style={{ color: '#64748b' }}></i>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-item upcoming-appointments">
          <div className="section-header">
            <h2>Today's Schedule</h2>
            <span className="view-all" onClick={() => onNavigate('/viewsche', 'schedule')}>
              View All <i className="fas fa-arrow-right"></i>
            </span>
          </div>

          <div className="schedule-list">
            <div className="schedule-item">
              <div className="schedule-time">09:00 AM</div>
              <div className="schedule-details">
                <h4>Dr. Sarah Johnson</h4>
                <p>General Checkup - Room 101</p>
              </div>
              <span className="schedule-status confirmed">Confirmed</span>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">10:30 AM</div>
              <div className="schedule-details">
                <h4>Dr. Michael Chen</h4>
                <p>Cardiology Consultation</p>
              </div>
              <span className="schedule-status pending">Pending</span>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">02:00 PM</div>
              <div className="schedule-details">
                <h4>Dr. Emily Williams</h4>
                <p>Pediatric Checkup</p>
              </div>
              <span className="schedule-status confirmed">Confirmed</span>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">04:30 PM</div>
              <div className="schedule-details">
                <h4>Dr. James Brown</h4>
                <p>Surgery Follow-up</p>
              </div>
              <span className="schedule-status confirmed">Confirmed</span>
            </div>
          </div>
        </div>

        <div className="grid-item low-stock">
          <div className="section-header">
            <h2>Low Stock Alert</h2>
            <span className="view-all" onClick={() => onNavigate('/addstk', 'stock')}>
              Manage Stock <i className="fas fa-arrow-right"></i>
            </span>
          </div>

          <div className="stock-list">
            <div className="stock-item">
              <div className="stock-info">
                <h4>Paracetamol</h4>
                <p>Stock: 15 units</p>
              </div>
              <span className="stock-status low">Low</span>
            </div>
            <div className="stock-item">
              <div className="stock-info">
                <h4>Amoxicillin</h4>
                <p>Stock: 8 units</p>
              </div>
              <span className="stock-status critical">Critical</span>
            </div>
            <div className="stock-item">
              <div className="stock-info">
                <h4>Ibuprofen</h4>
                <p>Stock: 12 units</p>
              </div>
              <span className="stock-status low">Low</span>
            </div>
            <div className="stock-item">
              <div className="stock-info">
                <h4>Insulin</h4>
                <p>Stock: 5 units</p>
              </div>
              <span className="stock-status critical">Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;