// DoctorHome.jsx - Updated with Profile in dropdown
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import './DoctorHome.css'
import axios from 'axios'

function DoctorHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [doctorName, setDoctorName] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState({
    totalSchedules: 0,
    upcomingSchedules: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem('lid');

  // Update time every second - but don't cause re-animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set page loaded flag after initial render
  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 100);
  }, []);

  // Update active page based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/drhome') {
      setActivePage('dashboard');
    } else if (path === '/drhome/addsche') {
      setActivePage('addsche');
    } else if (path === '/drhome/viewdrsche') {
      setActivePage('viewsche');
    }else if (path === '/drhome/drvistf') {
      setActivePage('staff');
    } else if (path === '/drhome/viewdrbook') {
      setActivePage('viewbook');
    } else if (path === '/drhome/viewdrprof') {
      setActivePage('profile');
    } else if (path === '/drhome/drchngpas') {
      setActivePage('changepass');
    } else if (path === '/drhome/viewstaff') {
      setActivePage('staff');
    }
  }, [location]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        
        // Fetch doctor profile
        const profileRes = await axios.get(`${apiUrl}drprofile/${lid}`);
        setDoctorName(profileRes.data.name);
        
        // Fetch doctor schedules
        const scheduleRes = await axios.get(`${apiUrl}doctorviewschedule/${lid}`);
        const schedules = scheduleRes.data;
        
        // Fetch doctor bookings
        const bookingRes = await axios.get(`${apiUrl}drviewbooking/${lid}`);
        const bookings = bookingRes.data;
        
        const today = new Date().toISOString().split('T')[0];
        const upcomingSchedules = schedules.filter(s => s.date >= today).length;
        
        // Calculate booking stats
        const pendingBookings = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status?.toLowerCase() === 'prescribed').length;
        
        setStats({
          totalSchedules: schedules.length,
          upcomingSchedules: upcomingSchedules,
          totalBookings: bookings.length,
          pendingBookings: pendingBookings,
          confirmedBookings: confirmedBookings
        });
        
        // Create recent activities
        const activities = [];
        
        // Add recent bookings
        bookings.slice(0, 3).forEach(booking => {
          activities.push({
            icon: 'calendar-check',
            text: `New appointment booked by ${booking.user?.name || 'Patient'}`,
            time: booking.date === today ? 'Today' : booking.date,
            color: '#8b5cf6',
            type: 'booking'
          });
        });
        
        // Add recent schedules
        schedules.slice(0, 2).forEach(schedule => {
          activities.push({
            icon: 'clock',
            text: `Schedule added for ${schedule.date}`,
            time: schedule.date === today ? 'Today' : schedule.date,
            color: '#10b981',
            type: 'schedule'
          });
        });
        
        setRecentActivities(activities.slice(0, 5));
        
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (lid) {
      fetchDoctorData();
    }
  }, [lid]);

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

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(`/drhome/${path}`);
  };

  // Dashboard Component
  const Dashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon schedule-icon">
            <i className="fas fa-calendar-week"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalSchedules}</h3>
            <p>Total Schedules</p>
          </div>
          <div className="stat-trend">
            <i className="fas fa-arrow-up"></i>
            <span></span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon upcoming-icon">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.upcomingSchedules}</h3>
            <p>Upcoming Schedules</p>
          </div>
          <div className="stat-trend">
            <i className="fas fa-clock"></i>
            <span></span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon booking-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
          <div className="stat-trend">
            <i className="fas fa-users"></i>
            <span></span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.pendingBookings}</h3>
            <p>Past/Pending Bookings</p>
          </div>
          <div className="stat-trend pending">
            <i className="fas fa-hourglass-half"></i>
            <span></span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon confirmed-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.confirmedBookings}</h3>
            <p>Prescribed</p>
          </div>
          <div className="stat-trend confirmed">
            <i className="fas fa-check"></i>
            <span></span>
          </div>
        </div>
      </div>

      {/* Quick Actions
      <div className="quick-actions-section">
        <h2 className="section-title">
          <i className="fas fa-bolt"></i>
          Quick Actions
        </h2>
        <div className="actions-grid">
          <div onClick={() => handleNavigation('addsche')} className="action-card">
            <div className="action-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <h3>Add Schedule</h3>
            <p>Create new appointment slots</p>
            <span className="action-link">Add Schedule →</span>
          </div>

          <div onClick={() => handleNavigation('viewdrsche')} className="action-card">
            <div className="action-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3>View Schedule</h3>
            <p>View all your appointments</p>
            <span className="action-link">View Schedule →</span>
          </div>

          <div onClick={() => handleNavigation('viewstaff')} className="action-card">
            <div className="action-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>View Staff</h3>
            <p>View all hospital staff members</p>
            <span className="action-link">View Staff →</span>
          </div>

          <div onClick={() => handleNavigation('viewdrbook')} className="action-card">
            <div className="action-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>View Bookings</h3>
            <p>Manage patient bookings</p>
            <span className="action-link">View Bookings →</span>
          </div>
        </div>
      </div> */}

      {/* Recent Activities */}
      <div className="recent-activities-section">
        <h2 className="section-title">
          <i className="fas fa-history"></i>
          Recent Activities
        </h2>
        <div className="activities-list">
          {loading ? (
            <div className="loading-activities">
              <div className="spinner"></div>
              <p>Loading activities...</p>
            </div>
          ) : recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: activity.color }}>
                  <i className={`fas fa-${activity.icon}`}></i>
                </div>
                <div className="activity-details">
                  <p>{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
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
    </>
  );

  const isDashboard = location.pathname === '/drhome';

  return (
    <div className="doctor-home">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Navbar */}
      <nav className="doctor-navbar">
        <div className="nav-brand">
          <div className="brand-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          <div className="brand-text">
            <h2>AROVIA</h2>
            <span>Doctor Panel</span>
          </div>
        </div>

        <div className="nav-links">
          <button 
            className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/drhome')}
          >
            <i className="fas fa-chart-pie"></i>
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-link ${activePage === 'addsche' ? 'active' : ''}`}
            onClick={() => handleNavigation('addsche')}
          >
            <i className="fas fa-plus-circle"></i>
            <span>Add Schedule</span>
          </button>
          <button 
            className={`nav-link ${activePage === 'viewsche' ? 'active' : ''}`}
            onClick={() => handleNavigation('viewdrsche')}
          >
            <i className="fas fa-calendar-alt"></i>
            <span> Schedule</span>
          </button>
          <button 
            className={`nav-link ${activePage === 'staff' ? 'active' : ''}`}
            onClick={() => handleNavigation('drvistf')}
          >
            <i className="fas fa-users"></i>
            <span>Staffs</span>
          </button>
          <button 
            className={`nav-link ${activePage === 'viewbook' ? 'active' : ''}`}
            onClick={() => handleNavigation('viewdrbook')}
          >
            <i className="fas fa-calendar-check"></i>
            <span> Bookings</span>
          </button>
        </div>

        <div className="nav-right">
          <div className="doctor-badge">
            <i className="fas fa-user-circle"></i>
            <span>Dr. {doctorName || 'Doctor'}</span>
          </div>
          <div className="dropdown">
            <button className="dropdown-btn">
              <i className="fas fa-chevron-down"></i>
            </button>
            <div className="dropdown-content">
              <button onClick={() => handleNavigation('viewdrprof')} className="dropdown-item">
                <i className="fas fa-user-md"></i>
                View Profile
              </button>
              <button onClick={() => handleNavigation('drchngpas')} className="dropdown-item">
                <i className="fas fa-lock"></i>
                Change Password
              </button>
              <button onClick={handleLogout} className="dropdown-item logout">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="doctor-main">
        {/* Welcome Section */}
        <div className={`welcome-section ${pageLoaded ? 'loaded' : ''}`}>
          <div className="welcome-text">
            <h1>Welcome back, Dr. {doctorName}</h1>
            <p>Manage your appointments and schedule with ease</p>
          </div>
          <div className="date-time">
            <div className="date-card">
              <i className="fas fa-calendar-alt"></i>
              <span>{formattedDate}</span>
            </div>
            <div className="time-card">
              <i className="fas fa-clock"></i>
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content - Renders child routes */}
        <div className={`content-area ${pageLoaded ? 'loaded' : ''}`}>
          {isDashboard ? <Dashboard /> : <Outlet />}
        </div>
      </div>
    </div>
  )
}

export default DoctorHome