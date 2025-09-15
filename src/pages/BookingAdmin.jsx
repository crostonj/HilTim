import React, { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';
import './css/BookingAdmin.css';

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all bookings from CSV database
      const allBookings = bookingService.getAllBookings();
      setBookings(allBookings);

      // Load stats
      const statsResult = bookingService.getBookingStats();
      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      console.log(`📊 Loaded ${allBookings.length} bookings from CSV database`);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const handleExportCSV = () => {
    try {
      const result = bookingService.exportBookingsCSV();
      if (result.success) {
        alert(`✅ ${result.message}\n\nThe CSV database file has been downloaded to your computer.`);
      } else {
        alert(`❌ Export failed: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Export failed: ${error.message}`);
    }
  };

  const handleLoadDatabase = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvContent = e.target.result;
        const result = await bookingService.loadCSVDatabase(file);
        
        if (result.success) {
          alert(`✅ ${result.message}\n\nCSV database has been loaded successfully.`);
          await loadData(); // Refresh data
        } else {
          alert(`❌ Failed to load database: ${result.error}`);
        }
      } catch (error) {
        alert(`❌ Failed to load database: ${error.message}`);
      }
      setIsProcessing(false);
    };

    reader.onerror = () => {
      alert('❌ Failed to read CSV file');
      setIsProcessing(false);
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvContent = e.target.result;
        const result = await bookingService.importBookingsFromCSV(csvContent);
        
        if (result.success) {
          let message = `✅ ${result.message}`;
          if (result.errors) {
            message += `\n\nWarnings:\n${result.errors.slice(0, 5).join('\n')}`;
            if (result.errors.length > 5) {
              message += `\n... and ${result.errors.length - 5} more warnings`;
            }
          }
          alert(message);
          await loadData(); // Refresh data
          setShowImportModal(false);
        } else {
          let message = `❌ Import failed: ${result.error}`;
          if (result.errors) {
            message += `\n\nErrors:\n${result.errors.slice(0, 5).join('\n')}`;
            if (result.errors.length > 5) {
              message += `\n... and ${result.errors.length - 5} more errors`;
            }
          }
          alert(message);
        }
      } catch (error) {
        alert(`❌ Import failed: ${error.message}`);
      }
      setIsProcessing(false);
    };

    reader.onerror = () => {
      alert('❌ Failed to read CSV file');
      setIsProcessing(false);
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  const handlePermanentDelete = async (bookingId) => {
    if (window.confirm(`Permanently delete booking ${bookingId}? This cannot be undone.`)) {
      setIsProcessing(true);
      try {
        const result = await bookingService.permanentlyDeleteBooking(bookingId);
        if (result.success) {
          alert(result.message);
          await loadData(); // Reload data
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
      setIsProcessing(false);
    }
  };

  const handleReactivateBooking = async (bookingId) => {
    setIsProcessing(true);
    try {
      const result = await bookingService.updateBooking(bookingId, { status: 'confirmed' });
      if (result.success) {
        alert('Booking reactivated successfully');
        await loadData(); // Reload data
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
    setIsProcessing(false);
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
      <div className="admin-controls">
        <div className="filter-controls">
          <button onClick={() => handleStatusFilter('all')}>All Bookings</button>
          <button onClick={() => handleStatusFilter('confirmed')}>Confirmed</button>
          <button onClick={() => handleStatusFilter('pending')}>Pending</button>
          <button onClick={() => handleStatusFilter('cancelled')}>Cancelled</button>
        </div>

        <div className="csv-controls">
          <button 
            className="load-db-btn" 
            onClick={() => document.getElementById('loadDbInput').click()}
            disabled={isProcessing}
          >
            📂 {isProcessing ? 'Loading...' : 'Load CSV Database'}
          </button>
          <input
            id="loadDbInput"
            type="file"
            accept=".csv"
            onChange={handleLoadDatabase}
            style={{ display: 'none' }}
          />
          <button 
            className="export-btn" 
            onClick={handleExportCSV}
            disabled={isProcessing}
          >
            📥 Export Database
          </button>
          <button 
            className="import-btn" 
            onClick={() => setShowImportModal(true)}
            disabled={isProcessing}
          >
            📤 {isProcessing ? 'Processing...' : 'Replace Database'}
          </button>
        </div>
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

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Replace CSV Database</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowImportModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="import-instructions">
                <h4>⚠️ Database Replacement Warning:</h4>
                <p><strong>This will completely replace your current CSV database!</strong></p>
                <ul>
                  <li>All existing bookings will be replaced with the CSV data</li>
                  <li>CSV must include these columns: id, checkIn, checkOut, adults, roomType, firstName, lastName, email</li>
                  <li>Date format: YYYY-MM-DD (e.g., 2025-12-01)</li>
                  <li>Activity/Amenity packages: separate multiple items with semicolons</li>
                  <li>Invalid rows will be skipped with error messages</li>
                  <li>A new database backup will be automatically downloaded</li>
                </ul>
              </div>

              <div className="file-upload-area">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  id="csv-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="csv-upload" className="upload-label">
                  📁 Choose CSV Database File
                </label>
                <p>Select a CSV file to replace the current database</p>
              </div>

              <div className="sample-format">
                <h4>📄 Sample CSV Format:</h4>
                <pre>
id,userId,checkIn,checkOut,adults,roomType,firstName,lastName,email
BK003,user456,2025-12-01,2025-12-05,2,singleKing,Jane,Smith,jane@email.com
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingAdmin;