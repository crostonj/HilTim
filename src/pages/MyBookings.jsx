import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import bookingService from '../services/bookingService';
import './css/MyBookings.css';

const MyBookings = () => {
  const { currentUser, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Load user bookings from service
      const result = bookingService.getBookingsByUserId(currentUser.id);
      
      if (result.success) {
        setBookings(result.bookings);
      } else {
        console.error('Error loading bookings:', result.error);
        setBookings([]);
      }
      
      setIsLoading(false);
    }
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleModifyBooking = (booking) => {
    // Store the booking data for modification
    const modifyData = {
      ...booking,
      isModifying: true,
      originalBookingId: booking.id
    };
    localStorage.setItem('modifyBookingData', JSON.stringify(modifyData));
    
    // Navigate to booking page in modify mode
    navigate('/booking?modify=true');
  };

  const handleCancelBooking = (booking) => {
    const isConfirmed = window.confirm(`Are you sure you want to cancel booking ${booking.id}?\n\nRoom: ${booking.roomType}\nDates: ${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}\n\nThis action cannot be undone.`);
    
    if (isConfirmed) {
      const result = bookingService.deleteBooking(booking.id);
      
      if (result.success) {
        // Update local state to reflect the cancellation
        setBookings(prevBookings => 
          prevBookings.map(b => 
            b.id === booking.id 
              ? { ...b, status: 'cancelled' }
              : b
          )
        );
        alert(`${result.message}\n\nBooking ${booking.id} has been cancelled successfully.`);
      } else {
        alert(`Error cancelling booking: ${result.error}`);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="my-bookings-page">
        <div className="not-logged-in">
          <h1>Please Sign In</h1>
          <p>You need to be logged in to view your bookings.</p>
          <Link to="/" className="back-home-btn">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Manage your reservations at HilTim Hotel Honolulu</p>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-bookings-icon">🏨</div>
          <h2>No Bookings Found</h2>
          <p>You haven't made any reservations yet. Start planning your Hawaiian getaway!</p>
          <Link to="/booking" className="book-now-btn">Book Your Stay</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-info">
                  <h3>Booking #{booking.id}</h3>
                  <span 
                    className="booking-status"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="booking-dates">
                  <span className="date-range">
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </span>
                  <span className="nights">{booking.nights} nights</span>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-section">
                  <h4>Accommodation</h4>
                  <p><strong>Room:</strong> {booking.roomType}</p>
                  <p><strong>Guests:</strong> {booking.guests}</p>
                  <p><strong>Total Price:</strong> <span className="price">${booking.totalPrice}</span></p>
                </div>

                {booking.activityPackages.length > 0 && (
                  <div className="detail-section">
                    <h4>Activity Packages</h4>
                    <ul className="packages-list">
                      {booking.activityPackages.map((pkg, index) => (
                        <li key={index}>{pkg}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {booking.amenityPackages.length > 0 && (
                  <div className="detail-section">
                    <h4>Amenity Packages</h4>
                    <ul className="packages-list">
                      {booking.amenityPackages.map((pkg, index) => (
                        <li key={index}>{pkg}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {booking.specialRequests && (
                  <div className="detail-section">
                    <h4>Special Requests</h4>
                    <p>{booking.specialRequests}</p>
                  </div>
                )}
              </div>

              <div className="booking-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => handleViewDetails(booking)}
                >
                  View Details
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => handleModifyBooking(booking)}
                >
                  Modify Booking
                </button>
                {booking.status === 'confirmed' && (
                  <button 
                    className="action-btn danger"
                    onClick={() => handleCancelBooking(booking)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

              <div className="booking-footer">
                <small>Booked on {formatDate(booking.dateCreated)}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="booking-actions-section">
        <h3>Need to make changes?</h3>
        <div className="action-buttons">
          <Link to="/booking" className="new-booking-btn">Book Another Stay</Link>
          <Link to="/contact" className="contact-btn">Contact Hotel</Link>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details - {selectedBooking.id}</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-body-grid">
                <div className="details-column">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Room Type:</label>
                      <span>{selectedBooking.roomType}</span>
                    </div>
                    <div className="detail-item">
                      <label>Check-in:</label>
                      <span>{formatDate(selectedBooking.checkIn)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Check-out:</label>
                      <span>{formatDate(selectedBooking.checkOut)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Guests:</label>
                      <span>{selectedBooking.guests}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nights:</label>
                      <span>{selectedBooking.nights}</span>
                    </div>
                    <div className="detail-item">
                      <label>Total Price:</label>
                      <span className="price">${selectedBooking.totalPrice}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(selectedBooking.status) }}
                      >
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Booked On:</label>
                      <span>{formatDate(selectedBooking.dateCreated)}</span>
                    </div>
                  </div>
                </div>

                <div className="packages-column">
                  {selectedBooking.activityPackages && selectedBooking.activityPackages.length > 0 && (
                    <div className="packages-section">
                      <h4>Activity Packages:</h4>
                      <ul>
                        {selectedBooking.activityPackages.map((pkg, index) => (
                          <li key={index}>🏖️ {pkg}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedBooking.amenityPackages && selectedBooking.amenityPackages.length > 0 && (
                    <div className="packages-section">
                      <h4>Amenity Packages:</h4>
                      <ul>
                        {selectedBooking.amenityPackages.map((pkg, index) => (
                          <li key={index}>✨ {pkg}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedBooking.specialRequests && (
                    <div className="packages-section">
                      <h4>Special Requests:</h4>
                      <p>{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="action-btn secondary" 
                onClick={() => {
                  setShowDetailsModal(false);
                  handleModifyBooking(selectedBooking);
                }}
              >
                Modify Booking
              </button>
              {selectedBooking.status === 'confirmed' && (
                <button 
                  className="action-btn danger" 
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleCancelBooking(selectedBooking);
                  }}
                >
                  Cancel Booking
                </button>
              )}
              <button 
                className="action-btn primary" 
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;