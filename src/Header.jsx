import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext';
import LoginRegister from './components/LoginRegister';
import './css/Header.css';

const Header = () => {
  const location = useLocation();
  const { currentUser, logoutUser, isLoggedIn } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setShowUserMenu(false);
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/" className="logo-link">HilTim Hotel Honolulu</Link>
      </div>
      <nav className="nav-menu">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/booking" 
          className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`}
        >
          Book Now
        </Link>
        <Link 
          to="/rooms" 
          className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}
        >
          Rooms & Suites
        </Link>
        <Link 
          to="/activities" 
          className={`nav-link ${location.pathname === '/activities' ? 'active' : ''}`}
        >
          Activity Packages
        </Link>
        <Link 
          to="/amenities" 
          className={`nav-link ${location.pathname === '/amenities' ? 'active' : ''}`}
        >
          Amenities
        </Link>
        <Link 
          to="/contact" 
          className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
        >
          Contact
        </Link>
        
        <div className="user-section">
          {isLoggedIn ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-icon">👤</span>
                <span className="user-name">
                  {currentUser.firstName || currentUser.email}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-full-name">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="user-email">{currentUser.email}</p>
                  </div>
                  <div className="user-actions">
                    <Link to="/my-bookings" className="dropdown-link">
                      My Bookings
                    </Link>
                    <Link to="/profile" className="dropdown-link">
                      Profile Settings
                    </Link>
                    <button onClick={handleLogout} className="dropdown-button">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="login-button"
              onClick={() => setShowLoginModal(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
      
      {showLoginModal && (
        <LoginRegister 
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </header>
  );
};

export default Header;
