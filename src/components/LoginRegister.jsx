import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import './css/LoginRegister.css';

const LoginRegister = ({ onClose, mode = 'login' }) => {
  const { loginUser } = useUser();
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    preferences: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (currentMode === 'register') {
        // Simulate user creation (in a real app, this would call an API)
        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dateCreated: new Date().toISOString(),
          preferences: formData.preferences
        };
        
        loginUser(newUser);
        alert('Account created successfully!');
        onClose();
      } else {
        // Simulate login (in a real app, this would validate credentials)
        if (formData.email) {
          const user = {
            id: Date.now().toString(),
            email: formData.email,
            firstName: 'Guest',
            lastName: 'User',
            phone: '',
            dateCreated: new Date().toISOString(),
            preferences: ''
          };
          
          loginUser(user);
          alert('Logged in successfully!');
          onClose();
        } else {
          setError('Please enter your email address');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setCurrentMode(currentMode === 'login' ? 'register' : 'login');
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      preferences: ''
    });
    setError('');
  };

  return (
    <div className="login-register-overlay">
      <div className="login-register-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="login-register-header">
          <h2>{currentMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {currentMode === 'login' 
              ? 'Sign in to manage your bookings and preferences'
              : 'Join HilTim Hotel for exclusive offers and easy booking'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-register-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          {currentMode === 'register' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="First name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="preferences">Travel Preferences (Optional)</label>
                <textarea
                  id="preferences"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleInputChange}
                  placeholder="Tell us about your travel preferences..."
                  rows="3"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 
             currentMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-register-footer">
          <p>
            {currentMode === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "
            }
            <button 
              type="button" 
              className="switch-mode-button" 
              onClick={switchMode}
            >
              {currentMode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;