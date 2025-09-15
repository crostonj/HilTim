// Booking Service for HilTim Hotel
// Handles all booking CRUD operations with CSV file persistence
// In production, this would connect to a real database/API

class BookingService {
  constructor() {
    this.csvFileName = 'hiltim_bookings.csv';
    this.csvHeaders = [
      'id', 'userId', 'roomType', 'checkIn', 'checkOut', 'adults', 'children', 
      'guests', 'nights', 'totalPrice', 'status', 'dateCreated', 'dateModified',
      'firstName', 'lastName', 'email', 'phone', 'specialRequests', 
      'activityPackages', 'amenityPackages'
    ];
    this.csvFileHandle = null; // Store file handle for direct CSV file access
    this.bookingsCache = []; // In-memory cache for performance
    this.isInitialized = false;
    this.initializeCSVDatabase();
  }

  // Initialize CSV database with file system access
  async initializeCSVDatabase() {
    try {
      // For browsers that support File System Access API
      if ('showOpenFilePicker' in window) {
        await this.initializeFileSystemAccess();
      } else {
        // Fallback: Use localStorage with automatic file downloads
        await this.initializeFallbackStorage();
      }
      this.isInitialized = true;
    } catch (error) {
      console.warn('File System Access not available, using fallback storage:', error);
      await this.initializeFallbackStorage();
      this.isInitialized = true;
    }
  }

  // Initialize with File System Access API (Chrome/Edge)
  async initializeFileSystemAccess() {
    try {
      // Try to get existing file handle from localStorage
      const storedHandle = localStorage.getItem('csvFileHandle');
      if (storedHandle) {
        // In practice, file handles can't be stored - this is a placeholder for future implementation
        // For now, fall back to localStorage approach
        await this.initializeFallbackStorage();
        return;
      }

      // Create new CSV database file
      await this.createNewCSVDatabase();
    } catch (error) {
      console.error('Error with File System Access:', error);
      await this.initializeFallbackStorage();
    }
  }

  // Create new CSV database file
  async createNewCSVDatabase() {
    try {
      const sampleBookings = this.getSampleBookings();
      this.bookingsCache = sampleBookings;
      
      // Auto-download the initial database file
      const csvContent = this.arrayToCSV(sampleBookings);
      this.downloadCSV(csvContent, this.csvFileName);
      
      // Store in localStorage as backup
      localStorage.setItem('hiltim_bookings_csv', csvContent);
      
      console.log('✅ CSV Database initialized with sample data');
    } catch (error) {
      console.error('Error creating CSV database:', error);
    }
  }

  // Fallback initialization using localStorage + file downloads
  async initializeFallbackStorage() {
    try {
      // Check if we have existing CSV data
      const existingCSV = localStorage.getItem('hiltim_bookings_csv');
      if (existingCSV) {
        this.bookingsCache = this.csvToArray(existingCSV);
        console.log('📁 Loaded existing CSV database from storage');
      } else {
        // Create initial database with sample data
        const sampleBookings = this.getSampleBookings();
        this.bookingsCache = sampleBookings;
        const csvContent = this.arrayToCSV(sampleBookings);
        localStorage.setItem('hiltim_bookings_csv', csvContent);
        this.downloadCSV(csvContent, this.csvFileName);
        console.log('✅ CSV Database initialized with sample data');
      }
    } catch (error) {
      console.error('Error initializing fallback storage:', error);
      this.bookingsCache = [];
    }
  }

  // Get sample bookings for initial database
  getSampleBookings() {
    return [
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
  }

  // Convert array of objects to CSV format
  arrayToCSV(data) {
    if (!data || data.length === 0) {
      return this.csvHeaders.join(',') + '\n';
    }

    const csvRows = [];
    
    // Add headers
    csvRows.push(this.csvHeaders.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = this.csvHeaders.map(header => {
        let value = row[header] || '';
        
        // Handle arrays (convert to semicolon-separated string)
        if (Array.isArray(value)) {
          value = value.join(';');
        }
        
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = `"${value}"`;
          }
        }
        
        return value;
      });
      
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  }

  // Convert CSV format back to array of objects
  csvToArray(csvString) {
    if (!csvString || csvString.trim() === '') {
      return [];
    }

    const lines = csvString.split('\n').filter(line => line.trim() !== '');
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const row = {};

      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Handle numeric fields
        if (['adults', 'children', 'guests', 'nights', 'totalPrice'].includes(header)) {
          value = value ? Number(value) : 0;
        }
        
        // Handle array fields (semicolon-separated)
        if (['activityPackages', 'amenityPackages'].includes(header)) {
          value = value ? value.split(';').filter(item => item.trim() !== '') : [];
        }
        
        row[header] = value;
      });

      data.push(row);
    }

    return data;
  }

  // Parse a single CSV line handling quoted values
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Handle escaped quotes
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    
    return result;
  }

  // Save bookings to CSV database (both cache and persistent storage)
  async saveBookingsToCSVDatabase(bookings) {
    try {
      // Update in-memory cache
      this.bookingsCache = [...bookings];
      
      const csvContent = this.arrayToCSV(bookings);
      
      // Save to localStorage as backup
      localStorage.setItem('hiltim_bookings_csv', csvContent);
      
      // Auto-download updated CSV file as the "database save"
      this.downloadCSV(csvContent, this.csvFileName);
      
      console.log(`💾 Database saved: ${bookings.length} bookings written to CSV`);
      return true;
    } catch (error) {
      console.error('Error saving bookings to CSV database:', error);
      return false;
    }
  }

  // Get all bookings from CSV database
  getAllBookings() {
    try {
      // Return from cache if available
      if (this.bookingsCache && this.bookingsCache.length >= 0) {
        return this.bookingsCache;
      }
      
      // Fallback: read from localStorage
      const csvContent = localStorage.getItem('hiltim_bookings_csv');
      const bookings = this.csvToArray(csvContent || '');
      this.bookingsCache = bookings;
      
      return bookings;
    } catch (error) {
      console.error('Error reading bookings from CSV database:', error);
      return [];
    }
  }

  // Save bookings array back to CSV database
  async saveBookings(bookings) {
    return await this.saveBookingsToCSVDatabase(bookings);
  }

  // Load CSV database from uploaded file
  async loadCSVDatabase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const csvContent = e.target.result;
          const bookings = this.csvToArray(csvContent);
          
          // Update cache and persistent storage
          this.bookingsCache = bookings;
          localStorage.setItem('hiltim_bookings_csv', csvContent);
          
          console.log(`📂 CSV Database loaded: ${bookings.length} bookings`);
          resolve({
            success: true,
            message: `Successfully loaded ${bookings.length} bookings from CSV database`,
            recordCount: bookings.length
          });
        } catch (error) {
          console.error('Error loading CSV database:', error);
          reject({
            success: false,
            error: 'Failed to load CSV database'
          });
        }
      };
      
      reader.onerror = () => {
        reject({
          success: false,
          error: 'Failed to read CSV file'
        });
      };
      
      reader.readAsText(file);
    });
  }

  // Download CSV file to user's computer (database backup)
  downloadCSV(csvContent, filename = 'hiltim_bookings.csv') {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`📥 Database backup downloaded: ${filename}`);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  }

  // Generate unique booking ID
  generateBookingId() {
    const bookings = this.getAllBookings();
    const lastId = bookings.length > 0 ? 
      Math.max(...bookings.map(b => parseInt(b.id.replace('BK', '')))) : 0;
    return `BK${String(lastId + 1).padStart(3, '0')}`;
  }

  // Export current bookings to CSV file
  exportBookingsCSV(filename = `hiltim_bookings_${new Date().toISOString().split('T')[0]}.csv`) {
    const bookings = this.getAllBookings();
    const csvContent = this.arrayToCSV(bookings);
    this.downloadCSV(csvContent, filename);
    
    return {
      success: true,
      message: `Exported ${bookings.length} bookings to ${filename}`,
      recordCount: bookings.length
    };
  }

  // Import bookings from CSV content (replace current database)
  async importBookingsFromCSV(csvContent) {
    try {
      const importedBookings = this.csvToArray(csvContent);
      
      if (importedBookings.length === 0) {
        return {
          success: false,
          error: 'No valid booking data found in CSV'
        };
      }

      // Validate each booking
      const errors = [];
      const validBookings = [];

      importedBookings.forEach((booking, index) => {
        const validation = this.validateBookingData(booking);
        if (validation.valid) {
          // Ensure unique ID
          if (!booking.id) {
            booking.id = this.generateBookingId();
          }
          validBookings.push(booking);
        } else {
          errors.push(`Row ${index + 2}: ${validation.errors.join(', ')}`);
        }
      });

      if (validBookings.length === 0) {
        return {
          success: false,
          error: 'No valid bookings found',
          errors: errors
        };
      }

      // Replace entire database with imported bookings
      if (await this.saveBookings(validBookings)) {
        console.log(`📊 Database replaced with imported data: ${validBookings.length} bookings`);
        return {
          success: true,
          message: `Successfully imported ${validBookings.length} bookings to CSV database`,
          imported: validBookings.length,
          errors: errors.length > 0 ? errors : null
        };
      } else {
        return {
          success: false,
          error: 'Failed to save imported bookings to CSV database'
        };
      }
    } catch (error) {
      console.error('Error importing CSV to database:', error);
      return {
        success: false,
        error: 'Failed to import CSV data to database'
      };
    }
  }

  // CREATE: Add new booking to CSV database
  async createBooking(bookingData) {
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
      
      if (await this.saveBookings(bookings)) {
        console.log(`✅ New booking created: ${newBooking.id}`);
        return {
          success: true,
          booking: newBooking,
          message: 'Booking created successfully and saved to CSV database'
        };
      } else {
        return {
          success: false,
          error: 'Failed to save booking to CSV database'
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

  // UPDATE: Modify existing booking in CSV database
  async updateBooking(bookingId, updatedData) {
    try {
      const bookings = this.getAllBookings();
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex === -1) {
        return {
          success: false,
          error: 'Booking not found in CSV database'
        };
      }

      // Merge existing data with updates
      bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        ...updatedData,
        dateModified: new Date().toISOString().split('T')[0]
      };

      if (await this.saveBookings(bookings)) {
        console.log(`📝 Booking updated: ${bookingId}`);
        return {
          success: true,
          booking: bookings[bookingIndex],
          message: 'Booking updated successfully in CSV database'
        };
      } else {
        return {
          success: false,
          error: 'Failed to save booking updates to CSV database'
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

  // DELETE: Cancel/Delete booking in CSV database (soft delete by changing status)
  async deleteBooking(bookingId) {
    try {
      const bookings = this.getAllBookings();
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex === -1) {
        return {
          success: false,
          error: 'Booking not found in CSV database'
        };
      }

      // Soft delete by changing status to cancelled
      bookings[bookingIndex].status = 'cancelled';
      bookings[bookingIndex].dateModified = new Date().toISOString().split('T')[0];

      if (await this.saveBookings(bookings)) {
        console.log(`❌ Booking cancelled: ${bookingId}`);
        return {
          success: true,
          booking: bookings[bookingIndex],
          message: 'Booking cancelled successfully in CSV database'
        };
      } else {
        return {
          success: false,
          error: 'Failed to cancel booking in CSV database'
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

  // HARD DELETE: Permanently remove booking from CSV database (use with caution)
  async permanentlyDeleteBooking(bookingId) {
    try {
      const bookings = this.getAllBookings();
      const filteredBookings = bookings.filter(b => b.id !== bookingId);
      
      if (bookings.length === filteredBookings.length) {
        return {
          success: false,
          error: 'Booking not found in CSV database'
        };
      }

      if (await this.saveBookings(filteredBookings)) {
        console.log(`🗑️ Booking permanently deleted: ${bookingId}`);
        return {
          success: true,
          message: 'Booking permanently deleted from CSV database'
        };
      } else {
        return {
          success: false,
          error: 'Failed to delete booking from CSV database'
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