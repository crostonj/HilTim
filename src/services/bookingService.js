// Booking Service for HilTim Hotel
// Handles all booking CRUD operations with localStorage persistence
// In production, this would connect to a real database/API

class BookingService {
  constructor() {
    this.storageKey = 'hiltim_bookings';
    this.initializeStorage();
  }

  // Initialize storage with sample data if empty
  initializeStorage() {
    const existingBookings = localStorage.getItem(this.storageKey);
    if (!existingBookings) {
      const sampleBookings = [
        {
          id: 'BK001',
          userId: 'user123',
          roomType: 'Ocean View Suite',
          checkIn: '2025-10-15',
          checkOut: '2025-10-20',
          adults: 2,
          children: 0,
          guests: 2,
          nights: 5,
          totalPrice: 1100,
          status: 'confirmed',
          dateCreated: '2025-09-10',
          dateModified: '2025-09-10',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-0123',
          specialRequests: 'Late checkout, champagne welcome',
          activityPackages: ['Pearl Harbor Historical Package', 'Ocean Explorer Package'],
          amenityPackages: ['Spa & Wellness Package']
        },
        {
          id: 'BK002',
          userId: 'user123',
          roomType: 'Standard Room',
          checkIn: '2025-11-10',
          checkOut: '2025-11-13',
          adults: 1,
          children: 0,
          guests: 1,
          nights: 3,
          totalPrice: 450,
          status: 'pending',
          dateCreated: '2025-09-12',
          dateModified: '2025-09-12',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-0123',
          specialRequests: '',
          activityPackages: ['Diamond Head Adventure Package'],
          amenityPackages: []
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(sampleBookings));
    }
  }

  // Generate unique booking ID
  generateBookingId() {
    const bookings = this.getAllBookings();
    const lastId = bookings.length > 0 ? 
      Math.max(...bookings.map(b => parseInt(b.id.replace('BK', '')))) : 0;
    return `BK${String(lastId + 1).padStart(3, '0')}`;
  }

  // Get all bookings from storage
  getAllBookings() {
    try {
      const bookings = localStorage.getItem(this.storageKey);
      return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
      console.error('Error reading bookings:', error);
      return [];
    }
  }

  // Save bookings to storage
  saveBookings(bookings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(bookings));
      return true;
    } catch (error) {
      console.error('Error saving bookings:', error);
      return false;
    }
  }

  // CREATE: Add new booking
  createBooking(bookingData) {
    try {
      const bookings = this.getAllBookings();
      const newBooking = {
        id: this.generateBookingId(),
        ...bookingData,
        status: 'confirmed',
        dateCreated: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0]
      };

      bookings.push(newBooking);
      
      if (this.saveBookings(bookings)) {
        return {
          success: true,
          booking: newBooking,
          message: 'Booking created successfully'
        };
      } else {
        return {
          success: false,
          error: 'Failed to save booking'
        };
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: 'Failed to create booking'
      };
    }
  }

  // READ: Get booking by ID
  getBookingById(bookingId) {
    try {
      const bookings = this.getAllBookings();
      const booking = bookings.find(b => b.id === bookingId);
      
      if (booking) {
        return {
          success: true,
          booking: booking
        };
      } else {
        return {
          success: false,
          error: 'Booking not found'
        };
      }
    } catch (error) {
      console.error('Error getting booking:', error);
      return {
        success: false,
        error: 'Failed to retrieve booking'
      };
    }
  }

  // READ: Get bookings by user ID
  getBookingsByUserId(userId) {
    try {
      const bookings = this.getAllBookings();
      const userBookings = bookings.filter(b => b.userId === userId);
      
      return {
        success: true,
        bookings: userBookings
      };
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return {
        success: false,
        error: 'Failed to retrieve user bookings',
        bookings: []
      };
    }
  }

  // UPDATE: Modify existing booking
  updateBooking(bookingId, updatedData) {
    try {
      const bookings = this.getAllBookings();
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex === -1) {
        return {
          success: false,
          error: 'Booking not found'
        };
      }

      // Merge existing data with updates
      bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        ...updatedData,
        dateModified: new Date().toISOString().split('T')[0]
      };

      if (this.saveBookings(bookings)) {
        return {
          success: true,
          booking: bookings[bookingIndex],
          message: 'Booking updated successfully'
        };
      } else {
        return {
          success: false,
          error: 'Failed to save booking updates'
        };
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      return {
        success: false,
        error: 'Failed to update booking'
      };
    }
  }

  // DELETE: Cancel/Delete booking (soft delete by changing status)
  deleteBooking(bookingId) {
    try {
      const bookings = this.getAllBookings();
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex === -1) {
        return {
          success: false,
          error: 'Booking not found'
        };
      }

      // Soft delete by changing status to cancelled
      bookings[bookingIndex].status = 'cancelled';
      bookings[bookingIndex].dateModified = new Date().toISOString().split('T')[0];

      if (this.saveBookings(bookings)) {
        return {
          success: true,
          booking: bookings[bookingIndex],
          message: 'Booking cancelled successfully'
        };
      } else {
        return {
          success: false,
          error: 'Failed to cancel booking'
        };
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      return {
        success: false,
        error: 'Failed to cancel booking'
      };
    }
  }

  // HARD DELETE: Permanently remove booking (use with caution)
  permanentlyDeleteBooking(bookingId) {
    try {
      const bookings = this.getAllBookings();
      const filteredBookings = bookings.filter(b => b.id !== bookingId);
      
      if (bookings.length === filteredBookings.length) {
        return {
          success: false,
          error: 'Booking not found'
        };
      }

      if (this.saveBookings(filteredBookings)) {
        return {
          success: true,
          message: 'Booking permanently deleted'
        };
      } else {
        return {
          success: false,
          error: 'Failed to delete booking'
        };
      }
    } catch (error) {
      console.error('Error permanently deleting booking:', error);
      return {
        success: false,
        error: 'Failed to permanently delete booking'
      };
    }
  }

  // UTILITY: Get bookings by status
  getBookingsByStatus(status) {
    try {
      const bookings = this.getAllBookings();
      const statusBookings = bookings.filter(b => b.status === status);
      
      return {
        success: true,
        bookings: statusBookings
      };
    } catch (error) {
      console.error('Error getting bookings by status:', error);
      return {
        success: false,
        error: 'Failed to retrieve bookings',
        bookings: []
      };
    }
  }

  // UTILITY: Get booking statistics
  getBookingStats() {
    try {
      const bookings = this.getAllBookings();
      
      const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        totalRevenue: bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      };

      return {
        success: true,
        stats: stats
      };
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return {
        success: false,
        error: 'Failed to retrieve booking statistics'
      };
    }
  }

  // UTILITY: Validate booking data
  validateBookingData(bookingData) {
    const required = ['checkIn', 'checkOut', 'adults', 'roomType', 'firstName', 'lastName', 'email'];
    const missing = required.filter(field => !bookingData[field]);
    
    if (missing.length > 0) {
      return {
        valid: false,
        errors: [`Missing required fields: ${missing.join(', ')}`]
      };
    }

    // Validate dates
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const errors = [];

    if (checkIn < today) {
      errors.push('Check-in date cannot be in the past');
    }

    if (checkOut <= checkIn) {
      errors.push('Check-out date must be after check-in date');
    }

    if (bookingData.adults < 1) {
      errors.push('At least one adult is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}

// Export singleton instance
const bookingService = new BookingService();
export default bookingService;