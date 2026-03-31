// UserHome.jsx - Fixed animation blinking issue
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./UserHome.css";
import axios from "axios";

function UserHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalBookings: 0,
    upcomingAppointments: 0,
    completedVisits: 0,
    healthScore: 85
  });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const lid = sessionStorage.getItem("lid");

  // Set page loaded flag after initial render
  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 100);
  }, []);

  // Update time every second - but don't cause re-animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update active page based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/userhome') {
      setActivePage('dashboard');
    } else if (path === '/userhome/usviewdr') {
      setActivePage('doctors');
    } else if (path === '/userhome/usviewbook') {
      setActivePage('bookings');
    }else if (path === '/userhome/usviewmed') {
      setActivePage('medicine');
    } else if (path === '/userhome/usrfeedback') {
      setActivePage('feedback');
    } else if (path === '/userhome/userprf') {
      setActivePage('profile');
    } else if (path === '/userhome/uschgps') {
      setActivePage('security');
    }
  }, [location]);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const profileRes = await axios.get(`${apiUrl}userprofile/${lid}`);
        setUserName(profileRes.data.name);
        
        const doctorsRes = await axios.get(`${apiUrl}adminviewdoctor`);
        setStats(prev => ({ ...prev, totalDoctors: doctorsRes.data.length }));
        setRecentDoctors(doctorsRes.data.slice(0, 4));
        
        const bookingsRes = await axios.get(`${apiUrl}usviewbooking/${lid}`);
        const bookings = bookingsRes.data;
        
        const today = new Date().toISOString().split('T')[0];
        const upcoming = bookings.filter(b => b.schedule?.date >= today && b.status !== 'cancelled');
        const completed = bookings.filter(b => b.schedule?.date < today || b.status === 'completed');
        
        setStats(prev => ({
          ...prev,
          totalBookings: bookings.length,
          upcomingAppointments: upcoming.length,
          completedVisits: completed.length
        }));
        
        setUpcomingBookings(upcoming.slice(0, 3));
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (lid) {
      fetchUserData();
    }
  }, [lid]);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(`/userhome/${path}`);
    setSidebarOpen(false);
  };

  const formatTimeSlot = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isDashboard = location.pathname === '/userhome';

  // Dashboard Component
  const Dashboard = () => (
    <>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalDoctors}</h3>
            <p>Available Doctors</p>
          </div>
         
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming</p>
          </div>
          <div className="stat-trend">
            <i className="fas fa-clock"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.completedVisits}</h3>
            <p>Completed Visits</p>
          </div>
          <div className="stat-trend completed">
            <i className="fas fa-check"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
          <div className="stat-trend">
            <i className="fas fa-history"></i>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="appointments-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-calendar-week"></i>
            Upcoming Appointments
          </h2>
          <button onClick={() => handleNavigation('usviewbook')} className="view-all">
            View All <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <div className="appointments-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading appointments...</p>
            </div>
          ) : upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking, index) => (
              <div key={index} className="appointment-card">
                <div className="appointment-date-badge">
                  <span className="day">{new Date(booking.schedule?.date).getDate()}</span>
                  <span className="month">
                    {new Date(booking.schedule?.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="appointment-info">
                  <h4>Dr. {booking.schedule?.doctor?.name}</h4>
                  <p className="specialty">{booking.schedule?.doctor?.specialization}</p>
                  <div className="time-slot">
                    <i className="fas fa-clock"></i>
                    <span>{formatTimeSlot(booking.schedule?.fromtime)} - {formatTimeSlot(booking.schedule?.totime)}</span>
                  </div>
                </div>
                <div className={`appointment-status ${booking.status?.toLowerCase()}`}>
                  {booking.status}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-calendar-times"></i>
              <p>No upcoming appointments</p>
              {/* <button onClick={() => handleNavigation('usviewdr')} className="book-btn">Book Now</button> */}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Doctors */}
      <div className="doctors-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-star-of-life"></i>
            Recommended Doctors
          </h2>
          <button onClick={() => handleNavigation('usviewdr')} className="view-all">
            View All <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <div className="doctors-grid">
          {recentDoctors.slice(0, 4).map((doctor, index) => (
            <div key={index} className="doctor-card">
              <div className="doctor-avatar">
                {doctor.photo ? (
                  <img src={`${apiUrl}${doctor.photo}`} alt={doctor.name} />
                ) : (
                  <i className="fas fa-user-md"></i>
                )}
              </div>
              <h4>Dr. {doctor.name}</h4>
              <p className="specialization">{doctor.specialization}</p>
             
              {/* <button onClick={() => handleNavigation('usviewdr')} className="book-now">Book Now</button> */}
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div className="tips-section">
        <div className="tips-header">
          <i className="fas fa-lightbulb"></i>
          <h2>Health Tips for You</h2>
        </div>
        <div className="tips-slider">
          <div className="tip-card">
            <i className="fas fa-apple-alt"></i>
            <p>"Eat a rainbow of fruits and vegetables daily for essential vitamins."</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-walking"></i>
            <p>"Walk 10,000 steps a day to maintain cardiovascular health."</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-bed"></i>
            <p>"Aim for 7-8 hours of quality sleep for optimal recovery."</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-tint"></i>
            <p>"Stay hydrated! Drink at least 8 glasses of water daily."</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="patient-dashboard">
      {/* Mobile Menu Toggle */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Wave Background */}
      <div className="wave-bg">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating heart">❤️</div>
        <div className="floating cross">➕</div>
        <div className="floating pill">💊</div>
        <div className="floating steth">🩺</div>
      </div>

      {/* Sidebar */}
      <aside className={`patient-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <i className="fas fa-heartbeat"></i>
          </div>
          <h2>HealthCare</h2>
          <p>Patient Portal</p>
        </div>


        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              navigate('/userhome');
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-chart-line"></i>
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activePage === 'doctors' ? 'active' : ''}`}
            onClick={() => handleNavigation('usviewdr')}
          >
            <i className="fas fa-user-md"></i>
            <span>Doctors</span>
          </button>
          <button 
            className={`nav-item ${activePage === 'bookings' ? 'active' : ''}`}
            onClick={() => handleNavigation('usviewbook')}
          >
            <i className="fas fa-calendar-check"></i>
            <span>My Appointments</span>
          </button>
          <button 
            className={`nav-item ${activePage === 'medicine' ? 'active' : ''}`}
            onClick={() => handleNavigation('usviewmed')}
          >
            <i className="fas fa-pills"></i>
            <span>Medicine</span>
          </button>
          <button 
            className={`nav-item ${activePage === 'feedback' ? 'active' : ''}`}
            onClick={() => handleNavigation('usrfeedback')}
          >
            <i className="fas fa-star"></i>
            <span>Feedback</span>
          </button>
          <button 
            className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('userprf')}
          >
            <i className="fas fa-user-edit"></i>
            <span>Profile Settings</span>
          </button>
          <button 
            className={`nav-item ${activePage === 'security' ? 'active' : ''}`}
            onClick={() => handleNavigation('uschgps')}
          >
            <i className="fas fa-lock"></i>
            <span>Security</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="patient-main">
        {/* Top Bar */}
        <div className={`top-bar ${pageLoaded ? 'loaded' : ''}`}>
          <div className="greeting-section">
            <h1>{greeting}, {userName || 'Patient'}! 👋</h1>
            <p>Your health is our priority. Stay healthy, stay happy!</p>
          </div>
          <div className="time-section">
            <div className="time-card">
              <i className="fas fa-clock"></i>
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className={`content-area ${pageLoaded ? 'loaded' : ''}`}>
          {isDashboard ? <Dashboard /> : <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default UserHome;