import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import './css/Profile.css';

const Profile = () => {
  const { currentUser, updateUser, logoutUser, isLoggedIn } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    preferences: currentUser?.preferences || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(formData);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      preferences: currentUser?.preferences || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will cancel all your bookings.'
    );
    
    if (confirmDelete) {
      const doubleConfirm = window.confirm(
        'This will permanently delete your account and all associated data. Are you absolutely sure?'
      );
      
      if (doubleConfirm) {
        logoutUser();
        alert('Your account has been deleted.');
        window.location.href = '/';
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="not-logged-in">
          <h1>Please Sign In</h1>
          <p>You need to be logged in to view your profile.</p>
          <button onClick={() => window.history.back()} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser?.firstName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
            </div>
            <h2>{currentUser?.firstName} {currentUser?.lastName}</h2>
            <p className="member-since">
              Member since {new Date(currentUser?.dateCreated || Date.now()).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Travel Preferences</h3>
              <div className="form-group">
                <label htmlFor="preferences">Preferences & Notes</label>
                <textarea
                  id="preferences"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="4"
                  placeholder="Tell us about your travel preferences, dietary restrictions, special occasions, etc."
                />
              </div>
            </div>

            <div className="form-actions">
              {!isEditing ? (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="editing-actions">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="save-btn"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="account-stats">
          <h3>Account Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10</div>
              <div className="stat-label">Nights Stayed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$1,850</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Gold</div>
              <div className="stat-label">Member Status</div>
            </div>
          </div>
        </div>

        <div className="account-actions">
          <h3>Account Actions</h3>
          <div className="actions-list">
            <button onClick={logoutUser} className="action-btn logout">
              Sign Out of Account
            </button>
            <button onClick={handleDeleteAccount} className="action-btn delete">
              Delete Account
            </button>
          </div>
          <p className="delete-warning">
            ⚠️ Deleting your account will permanently remove all your data and cancel active bookings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;