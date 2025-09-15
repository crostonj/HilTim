import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import LoginRegister from './components/LoginRegister';
import bookingService from './services/bookingService';
import './css/BookingPage.css';

const BookingPage = () => {
  const { currentUser, isLoggedIn } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [originalBookingId, setOriginalBookingId] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    roomType: 'standard',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    activityPackages: [],
    amenityPackages: []
  });

  // Pre-fill form with user data when logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      }));
    }
  }, [currentUser]);

  // Handle pre-selected packages from localStorage
  useEffect(() => {
    const selectedActivity = localStorage.getItem('selectedActivityPackage');
    const selectedAmenity = localStorage.getItem('selectedAmenityPackage');
    
    if (selectedActivity) {
      const activityPackage = JSON.parse(selectedActivity);
      setFormData(prev => ({
        ...prev,
        activityPackages: [activityPackage]
      }));
      // Clear after use
      localStorage.removeItem('selectedActivityPackage');
    }
    
    if (selectedAmenity) {
      const amenityPackage = JSON.parse(selectedAmenity);
      setFormData(prev => ({
        ...prev,
        amenityPackages: [amenityPackage]
      }));
      // Clear after use
      localStorage.removeItem('selectedAmenityPackage');
    }
  }, []);

  // Handle modify booking mode
  useEffect(() => {
    const isModify = searchParams.get('modify') === 'true';
    if (isModify) {
      setIsModifyMode(true);
      const modifyData = localStorage.getItem('modifyBookingData');
      if (modifyData) {
        const bookingData = JSON.parse(modifyData);
        setOriginalBookingId(bookingData.id);
        
        // Pre-fill form with existing booking data
        setFormData({
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          adults: bookingData.guests,
          children: 0, // Assuming children data isn't stored
          roomType: bookingData.roomType === 'Ocean View Suite' ? 'singleKing' : 
                   bookingData.roomType === 'Double King Suite' ? 'doubleKing' : 'standard',
          firstName: currentUser?.firstName || '',
          lastName: currentUser?.lastName || '',
          email: currentUser?.email || '',
          phone: currentUser?.phone || '',
          specialRequests: bookingData.specialRequests || '',
          activityPackages: bookingData.activityPackages ? 
            bookingData.activityPackages.map((name, index) => ({ id: index + 1, name, description: name })) : [],
          amenityPackages: bookingData.amenityPackages ? 
            bookingData.amenityPackages.map((name, index) => ({ id: index + 1, name, description: name })) : []
        });
        
        // Clear the stored data after using it
        localStorage.removeItem('modifyBookingData');
      }
    }
  }, [searchParams, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    // Calculate total price based on room type
    const roomPrices = {
      standard: 150,
      singleKing: 220,
      doubleKing: 380
    };
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = roomPrices[formData.roomType] * nights;
    
    const bookingData = {
      ...formData,
      totalPrice,
      userId: currentUser.id,
      nights
    };
    
    // Validate booking data
    const validation = bookingService.validateBookingData(bookingData);
    if (!validation.valid) {
      alert(`Please fix the following errors:\n\n${validation.errors.join('\n')}`);
      return;
    }
    
    try {
      // Handle booking creation or modification using service
      if (isModifyMode) {
        const result = await bookingService.updateBooking(originalBookingId, bookingData);
        
        if (result.success) {
          alert(`Booking ${originalBookingId} successfully updated for ${currentUser.firstName}!
          
          Updated Details:
          Room: ${bookingData.roomType} 
          Check-in: ${bookingData.checkIn}
          Check-out: ${bookingData.checkOut}
          Nights: ${nights}
          Total: $${totalPrice}
          
          Your CSV database has been updated with the changes.
          A confirmation email with your updated reservation details has been sent to ${currentUser.email}.`);
          
          // Navigate back to My Bookings
          navigate('/my-bookings');
        } else {
          alert(`Error updating booking: ${result.error}`);
        }
      } else {
        const result = await bookingService.createBooking(bookingData);
        
        if (result.success) {
          alert(`Booking confirmed for ${currentUser.firstName}! 
          Booking ID: ${result.booking.id}
          Room: ${bookingData.roomType} 
          Nights: ${nights}
          Total: $${totalPrice}
          
          Your booking has been saved to the CSV database.
          We will send a confirmation email to ${currentUser.email}.`);
          
          // Navigate to My Bookings to show the new booking
          navigate('/my-bookings');
        } else {
          alert(`Error creating booking: ${result.error}`);
        }
      }
    } catch (error) {
      alert(`Error processing booking: ${error.message}`);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{isModifyMode ? 'Modify Your Booking' : 'Book Your Stay at HilTim Hotel Honolulu'}</h1>
        <p>{isModifyMode ? 
          `Update your reservation details for booking ${originalBookingId}` : 
          'Reserve your perfect Hawaiian getaway and create tropical memories'
        }</p>
        {isModifyMode && (
          <div className="modify-notice">
            <span className="modify-badge">✏️ Modifying Existing Booking</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <section className="dates-section">
          <h3>Select Your Dates</h3>
          <div className="date-inputs">
            <div className="input-group">
              <label htmlFor="checkIn">Check-in Date</label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="checkOut">Check-out Date</label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </section>

        <section className="guests-section">
          <h3>Guests & Rooms</h3>
          <div className="guest-inputs">
            <div className="input-group">
              <label htmlFor="adults">Adults</label>
              <select
                id="adults"
                name="adults"
                value={formData.adults}
                onChange={handleInputChange}
                required
              >
                {[1,2,3,4].map(num => (
                  <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="children">Children</label>
              <select
                id="children"
                name="children"
                value={formData.children}
                onChange={handleInputChange}
              >
                {[0,1,2,3,4].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="room-section">
          <h3>Room Type</h3>
          <div className="room-options">
            <div className="room-option">
              <input
                type="radio"
                id="standard"
                name="roomType"
                value="standard"
                checked={formData.roomType === 'standard'}
                onChange={handleInputChange}
              />
              <label htmlFor="standard">
                <strong>Island View Room</strong> - $180/night<br/>
                <small>Queen bed, partial ocean view, lanai, free WiFi</small>
              </label>
            </div>
            <div className="room-option">
              <input
                type="radio"
                id="deluxe"
                name="roomType"
                value="deluxe"
                checked={formData.roomType === 'deluxe'}
                onChange={handleInputChange}
              />
              <label htmlFor="deluxe">
                <strong>Ocean View Suite</strong> - $280/night<br/>
                <small>King bed, full ocean view, private lanai, premium amenities</small>
              </label>
            </div>
            <div className="room-option">
              <input
                type="radio"
                id="suite"
                name="roomType"
                value="suite"
                checked={formData.roomType === 'suite'}
                onChange={handleInputChange}
              />
              <label htmlFor="suite">
                <strong>Beachfront Presidential Suite</strong> - $450/night<br/>
                <small>Separate living area, panoramic ocean views, butler service, private beach access</small>
              </label>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h3>Contact Information</h3>
          <div className="contact-inputs">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </section>

        {/* Selected Packages Section */}
        {(formData.activityPackages.length > 0 || formData.amenityPackages.length > 0) && (
          <section className="packages-section">
            <h3>Selected Packages</h3>
            {formData.activityPackages.map((pkg, index) => (
              <div key={`activity-${index}`} className="selected-package">
                <div className="package-info">
                  <h4>🏖️ {pkg.name}</h4>
                  <p className="package-price">${pkg.price}/person</p>
                  <p className="package-description">{pkg.description}</p>
                </div>
                <button 
                  type="button" 
                  className="remove-package-btn"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      activityPackages: prev.activityPackages.filter((_, i) => i !== index)
                    }));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            {formData.amenityPackages.map((pkg, index) => (
              <div key={`amenity-${index}`} className="selected-package">
                <div className="package-info">
                  <h4>✨ {pkg.name}</h4>
                  <p className="package-price">${pkg.price}/person</p>
                  <p className="package-description">{pkg.description}</p>
                </div>
                <button 
                  type="button" 
                  className="remove-package-btn"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      amenityPackages: prev.amenityPackages.filter((_, i) => i !== index)
                    }));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </section>
        )}

        <section className="requests-section">
          <h3>Special Requests</h3>
          <div className="input-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows="4"
              placeholder="Any special requests? (Lei greeting, romantic setup, dietary restrictions, island tours, etc.)"
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {!isLoggedIn ? 'Sign In to Book' : 
             isModifyMode ? 'Update Booking' : 'Complete Booking'}
          </button>
          {isModifyMode && (
            <button 
              type="button" 
              className="cancel-modify-button"
              onClick={() => window.history.back()}
            >
              Cancel Modification
            </button>
          )}
        </div>
      </form>
      
      {showLoginModal && (
        <LoginRegister 
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default BookingPage;