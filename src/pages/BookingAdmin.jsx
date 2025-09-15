import React, { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';
import './css/BookingAdmin.css';

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load all bookings
    const allBookings = bookingService.getAllBookings();
    setBookings(allBookings);

    // Load stats
    const statsResult = bookingService.getBookingStats();
    if (statsResult.success) {
      setStats(statsResult.stats);
    }

    setLoading(false);
  };

  const handleStatusFilter = (status) => {
    if (status === 'all') {
      setBookings(bookingService.getAllBookings());
    } else {
      const result = bookingService.getBookingsByStatus(status);
      if (result.success) {
        setBookings(result.bookings);
      }
    }
  };

  const handlePermanentDelete = (bookingId) => {
    if (window.confirm(`Permanently delete booking ${bookingId}? This cannot be undone.`)) {
      const result = bookingService.permanentlyDeleteBooking(bookingId);
      if (result.success) {
        alert(result.message);
        loadData(); // Reload data
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  const handleReactivateBooking = (bookingId) => {
    const result = bookingService.updateBooking(bookingId, { status: 'confirmed' });
    if (result.success) {
      alert('Booking reactivated successfully');
      loadData(); // Reload data
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading booking data...</div>;
  }

  return (
    <div className="booking-admin">
      <div className="admin-header">
        <h1>HilTim Hotel - Booking Administration</h1>
        <p>Comprehensive booking management system</p>
      </div>

      {/* Statistics Dashboard */}
      {stats && (
        <div className="stats-dashboard">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card confirmed">
            <h3>Confirmed</h3>
            <div className="stat-value">{stats.confirmed}</div>
          </div>
          <div className="stat-card pending">
            <h3>Pending</h3>
            <div className="stat-value">{stats.pending}</div>
          </div>
          <div className="stat-card cancelled">
            <h3>Cancelled</h3>
            <div className="stat-value">{stats.cancelled}</div>
          </div>
          <div className="stat-card revenue">
            <h3>Total Revenue</h3>
            <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="filter-controls">
        <button onClick={() => handleStatusFilter('all')}>All Bookings</button>
        <button onClick={() => handleStatusFilter('confirmed')}>Confirmed</button>
        <button onClick={() => handleStatusFilter('pending')}>Pending</button>
        <button onClick={() => handleStatusFilter('cancelled')}>Cancelled</button>
      </div>

      {/* Bookings Table */}
      <div className="bookings-table">
        <h2>Booking Records ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Nights</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className={`status-${booking.status}`}>
                  <td>{booking.id}</td>
                  <td>{booking.firstName} {booking.lastName}</td>
                  <td>{booking.roomType}</td>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td>{formatDate(booking.checkOut)}</td>
                  <td>{booking.nights}</td>
                  <td>${booking.totalPrice}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{formatDate(booking.dateCreated)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View
                      </button>
                      {booking.status === 'cancelled' && (
                        <button 
                          className="reactivate-btn"
                          onClick={() => handleReactivateBooking(booking.id)}
                        >
                          Reactivate
                        </button>
                      )}
                      <button 
                        className="delete-btn"
                        onClick={() => handlePermanentDelete(booking.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details - {selectedBooking.id}</h2>
              <button 
                className="close-btn" 
                onClick={() => setSelectedBooking(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="booking-details-grid">
                <div><strong>Guest:</strong> {selectedBooking.firstName} {selectedBooking.lastName}</div>
                <div><strong>Email:</strong> {selectedBooking.email}</div>
                <div><strong>Phone:</strong> {selectedBooking.phone}</div>
                <div><strong>Room Type:</strong> {selectedBooking.roomType}</div>
                <div><strong>Check-in:</strong> {formatDate(selectedBooking.checkIn)}</div>
                <div><strong>Check-out:</strong> {formatDate(selectedBooking.checkOut)}</div>
                <div><strong>Guests:</strong> {selectedBooking.guests}</div>
                <div><strong>Nights:</strong> {selectedBooking.nights}</div>
                <div><strong>Total Price:</strong> ${selectedBooking.totalPrice}</div>
                <div><strong>Status:</strong> {selectedBooking.status}</div>
                <div><strong>Created:</strong> {formatDate(selectedBooking.dateCreated)}</div>
                <div><strong>Modified:</strong> {formatDate(selectedBooking.dateModified)}</div>
              </div>

              {selectedBooking.activityPackages && selectedBooking.activityPackages.length > 0 && (
                <div className="packages-section">
                  <h4>Activity Packages:</h4>
                  <ul>
                    {selectedBooking.activityPackages.map((pkg, index) => (
                      <li key={index}>{pkg}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedBooking.amenityPackages && selectedBooking.amenityPackages.length > 0 && (
                <div className="packages-section">
                  <h4>Amenity Packages:</h4>
                  <ul>
                    {selectedBooking.amenityPackages.map((pkg, index) => (
                      <li key={index}>{pkg}</li>
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
      )}
    </div>
  );
};

export default BookingAdmin;