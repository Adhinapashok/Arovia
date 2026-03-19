// AdminHome.js - Updated with correct stats from your backend
import React, { useState, useEffect } from "react";
import "./AdminHome.css";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";

function AdminHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    doctors: 0,
    staff: 0,
    medicines: 0,
    bookings: 0,
    feedback: 0,
    totalPatients: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    prescribedBookings: 0,
    averageRating: 0,
    lowStockItems: [],
    todayAppointments: []
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch all stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          doctorsRes, 
          staffRes, 
          medicinesRes, 
          bookingsRes, 
          feedbackRes,
          usersRes
        ] = await Promise.all([
          axios.get(`${apiUrl}adminviewdoctor`),
          axios.get(`${apiUrl}viewstaff`),
          axios.get(`${apiUrl}viewmed`),
          axios.get(`${apiUrl}adminviewbooking`),
          axios.get(`${apiUrl}adminviewfeedback`),
          axios.get(`${apiUrl}userviewall`) // You'll need to create this endpoint
        ]);

        // Process doctors data
        const doctors = doctorsRes.data;
        
        // Process staff data
        const staff = staffRes.data;
        
        // Process medicines data with stock
        const medicines = medicinesRes.data;
        
        // Process bookings data
        const bookings = bookingsRes.data;
        const pendingBookings = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
        const cancelledBookings = bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length;
        const prescribedBookings = bookings.filter(b => b.status?.toLowerCase() === 'prescribed').length;

        // Process feedback data
        const feedbacks = feedbackRes.data;
        const avgRating = feedbacks.length > 0 
          ? (feedbacks.reduce((acc, curr) => acc + parseFloat(curr.rating), 0) / feedbacks.length).toFixed(1)
          : 0;

        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        
        // Filter today's appointments
        const todayApps = bookings
          .filter(b => b.date === today)
          .slice(0, 4)
          .map(b => ({
            id: b._id,
            time: b.time,
            patient: b.user?.name || 'Patient',
            doctor: b.schedule?.doctor?.name || 'Doctor',
            status: b.status
          }));

        // Calculate low stock items (stock < 10)
        const lowStock = medicines
          .filter(m => m.stock && m.stock[0]?.quantity < 10)
          .map(m => ({
            medicine: m.medname,
            quantity: m.stock[0]?.quantity || 0,
            id: m._id
          }))
          .slice(0, 4);

        // Create recent activities from bookings and feedback
        const activities = [
          ...bookings.slice(0, 3).map(b => ({
            icon: 'calendar-check',
            text: `New appointment booked for ${b.user?.name || 'Patient'}`,
            time: b.date === today ? 'Today' : new Date(b.date).toLocaleDateString(),
            color: '#8b5cf6',
            path: '/viewbook'
          })),
          ...feedbacks.slice(0, 2).map(f => ({
            icon: 'star',
            text: `New ${f.rating}-star feedback from ${f.user?.name || 'Patient'}`,
            time: f.date === today ? 'Today' : new Date(f.date).toLocaleDateString(),
            color: '#f59e0b',
            path: '/viewfeed'
          }))
        ];

        setStats({
          doctors: doctors.length,
          staff: staff.length,
          medicines: medicines.length,
          bookings: bookings.length,
          feedback: feedbacks.length,
          totalPatients: usersRes.data?.length || 0,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          prescribedBookings,
          averageRating: avgRating,
          lowStockItems: lowStock,
          todayAppointments: todayApps
        });

        setRecentActivities(activities);

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
    } else if (path.includes('/adddr') || path.includes('/viewdr') || path.includes('/editdr')) {
      setActiveSection('doctors');
    } else if (path.includes('/addstf') || path.includes('/viewstf') || path.includes('/editstf')) {
      setActiveSection('staff');
    } else if (path.includes('/addmed') || path.includes('/viewmed') || path.includes('/editmed')) {
      setActiveSection('medicines');
    } else if (path.includes('/viewbook')) {
      setActiveSection('bookings');
    } else if (path.includes('/viewfeed')) {
      setActiveSection('feedback');
    } else if (path.includes('/admchngpas')) {
      setActiveSection('security');
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

  // Navigation handlers
  const handleNavigation = (path, section) => {
    setActiveSection(section);
    navigate(`/home${path}`);
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  // Check if current path is dashboard
  const isDashboard = location.pathname === '/home';

  // Get admin name from session
  const adminName = "Admin"; // You can get this from session if stored

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

        <div className="admin-profile-card">
          <div className="profile-avatar">
            <div className="avatar-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="profile-info">
              <h4>Dr. {adminName}</h4>
              <p>Administrator</p>
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{stats.totalPatients}</span>
              <span className="stat-label">Patients</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.doctors}</span>
              <span className="stat-label">Doctors</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.averageRating}</span>
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

          {/* Bookings */}
          <div 
            className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => handleNavigation('/viewbook', 'bookings')}
          >
            <i className="fas fa-calendar-check"></i>
            <div className="nav-info">
              <span className="nav-label">Bookings</span>
              <span className="nav-count">{stats.bookings} Total</span>
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
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-container">
          {isDashboard ? (
            <DashboardHome 
              stats={stats} 
              onNavigate={handleNavigation} 
              loading={loading}
              recentActivities={recentActivities}
            />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

// Dashboard Home Component
const DashboardHome = ({ stats, onNavigate, loading, recentActivities }) => {
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

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
            <i className="fas fa-check-circle"></i> Active
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewstf', 'staff')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <i className="fas fa-users"></i>
          </div>
          <h4>Total Staff</h4>
          <span className="stat-number">{stats.staff}</span>
          <span className="stat-trend">
            <i className="fas fa-check-circle"></i> Active
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewmed', 'medicines')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            <i className="fas fa-pills"></i>
          </div>
          <h4>Medicines</h4>
          <span className="stat-number">{stats.medicines}</span>
          <span className="stat-trend">
            <i className="fas fa-exclamation-triangle"></i> {stats.lowStockItems.length} Low Stock
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewbook', 'bookings')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <h4>Total Bookings</h4>
          <span className="stat-number">{stats.bookings}</span>
          <span className="stat-trend">
            <i className="fas fa-clock"></i> {stats.pendingBookings} Pending
          </span>
        </div>

        <div className="stat-card" onClick={() => onNavigate('/viewfeed', 'feedback')}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <i className="fas fa-star"></i>
          </div>
          <h4>Feedback</h4>
          <span className="stat-number">{stats.feedback}</span>
          <span className="stat-trend">
            <i className="fas fa-star"></i> {stats.averageRating} Avg
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <i className="fas fa-user-check"></i>
          </div>
          <h4>Patients</h4>
          <span className="stat-number">{stats.totalPatients}</span>
          <span className="stat-trend">
            <i className="fas fa-arrow-up"></i> Registered
          </span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item recent-activities">
          <div className="section-header">
            <h2>Recent Activities</h2>
            <span className="view-all" onClick={() => onNavigate('/viewbook', 'bookings')}>
              View All <i className="fas fa-arrow-right"></i>
            </span>
          </div>

          <div className="activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div 
                  className="activity-item" 
                  key={index}
                  onClick={() => onNavigate(activity.path, '')}
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
              ))
            ) : (
              <div className="no-activities">
                <i className="fas fa-inbox"></i>
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid-item upcoming-appointments">
          <div className="section-header">
            <h2>Today's Appointments</h2>
            <span className="view-all" onClick={() => onNavigate('/viewbook', 'bookings')}>
              View All <i className="fas fa-arrow-right"></i>
            </span>
          </div>

          <div className="schedule-list">
            {stats.todayAppointments.length > 0 ? (
              stats.todayAppointments.map((appointment, index) => (
                <div className="schedule-item" key={index}>
                  <div className="schedule-time">{appointment.time}</div>
                  <div className="schedule-details">
                    <h4>{appointment.patient}</h4>
                    <p>{appointment.doctor}</p>
                  </div>
                  <span className={`schedule-status ${appointment.status?.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-appointments">
                <i className="fas fa-calendar-check"></i>
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid-item low-stock">
          <div className="section-header">
            <h2>Low Stock Alert</h2>
            <span className="view-all" onClick={() => onNavigate('/viewmed', 'medicines')}>
              Manage Stock <i className="fas fa-arrow-right"></i>
            </span>
          </div>

          <div className="stock-list">
            {stats.lowStockItems.length > 0 ? (
              stats.lowStockItems.map((item, index) => (
                <div className="stock-item" key={index}>
                  <div className="stock-info">
                    <h4>{item.medicine}</h4>
                    <p>Stock: {item.quantity} units</p>
                  </div>
                  <span className={`stock-status ${item.quantity < 5 ? 'critical' : 'low'}`}>
                    {item.quantity < 5 ? 'Critical' : 'Low'}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-stock">
                <i className="fas fa-check-circle"></i>
                <p>All items are well stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Stats Summary */}
      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-label">Pending</span>
          <span className="summary-value pending">{stats.pendingBookings}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Confirmed</span>
          <span className="summary-value confirmed">{stats.confirmedBookings}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Prescribed</span>
          <span className="summary-value prescribed">{stats.prescribedBookings}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Cancelled</span>
          <span className="summary-value cancelled">{stats.cancelledBookings}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;