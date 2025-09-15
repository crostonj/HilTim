# HilTim Hotel Booking Service

A comprehensive booking management service for the HilTim Hotel application with **CSV as the primary database**.

## 🗃️ **CSV Database System**

The HilTim booking service uses **CSV files as the primary database**, providing:

- ✅ **Direct CSV Storage** - All booking data stored in CSV format
- ✅ **Automatic Backups** - Every operation downloads updated CSV files
- ✅ **Portable Database** - Easily transfer and backup your entire database
- ✅ **Excel Compatible** - Open, edit, and analyze in spreadsheet applications
- ✅ **Version Control** - Keep historical versions of your database

## Features

### Core CRUD Operations
- ✅ **Create** new bookings with validation
- ✅ **Read** bookings by ID, user, or status  
- ✅ **Update** existing bookings
- ✅ **Delete** bookings (soft delete with cancellation)

### CSV Database Management
- 📂 **Load Database** - Upload a CSV file to replace the current database
- 📥 **Export Database** - Download the current database as CSV
- 📤 **Replace Database** - Import CSV data to completely replace existing bookings
- 🔄 **Automatic Sync** - Every booking change updates the CSV database
- 💾 **Auto Backup** - Automatic CSV downloads after each database change

## How It Works

### Database Storage
Instead of traditional SQL databases, the service uses CSV files:

1. **In-Memory Cache** - Fast access to booking data
2. **CSV Persistence** - All changes saved to CSV format
3. **Auto-Download** - Updated database files downloaded automatically
4. **Browser Storage** - LocalStorage backup for reliability

### File Management
```javascript
// Every booking operation automatically:
// 1. Updates in-memory cache
// 2. Saves to CSV format
// 3. Downloads updated database file
// 4. Updates localStorage backup

const result = await bookingService.createBooking(bookingData);
// → New CSV database file automatically downloaded
```

### CSV Database Format
```csv
id,userId,roomType,checkIn,checkOut,adults,children,guests,nights,totalPrice,status,dateCreated,dateModified,firstName,lastName,email,phone,specialRequests,activityPackages,amenityPackages
BK001,user123,Ocean View Suite,2025-10-15,2025-10-20,2,0,2,5,1100,confirmed,2025-09-10,2025-09-10,John,Doe,john@email.com,+1-555-0123,"Late checkout, champagne",Pearl Harbor Historical Package;Ocean Explorer Package,Spa & Wellness Package
```

### Database Operations
```javascript
// Load existing CSV database file
const result = await bookingService.loadCSVDatabase(file);

// Create new booking (auto-saves to CSV database)
const result = await bookingService.createBooking(bookingData);

// Update booking (auto-saves to CSV database) 
const result = await bookingService.updateBooking(bookingId, updates);

// Export current database
const result = bookingService.exportBookingsCSV('backup.csv');

// Replace entire database with CSV data
const result = await bookingService.importBookingsFromCSV(csvContent);
```

## Admin Interface

The BookingAdmin component provides comprehensive CSV database management:

### Database Controls
- 📂 **Load CSV Database** - Upload and load a CSV database file
- 📥 **Export Database** - Download current database as CSV
- 📤 **Replace Database** - Import CSV to completely replace current data

### Features
- **Drag & Drop** CSV file uploads
- **Real-time validation** with detailed error reporting
- **Processing states** with disabled buttons during operations
- **Mobile responsive** design for all devices

## Technical Architecture

### Service Layer (`bookingService.js`)
- **CSV-First Design** - Primary storage in CSV format
- **Async Operations** - All CRUD operations return promises
- **In-Memory Caching** - Fast data access with CSV persistence
- **Auto-Backup System** - Every change triggers CSV download
- **Validation System** - Comprehensive data validation

### Data Flow
1. **User Action** → Booking operation requested
2. **Cache Update** → In-memory data updated immediately  
3. **CSV Generation** → Data converted to CSV format
4. **File Download** → Updated database file downloaded
5. **Backup Storage** → LocalStorage updated for reliability

This architecture ensures your booking data is always available as portable CSV files while maintaining fast performance through intelligent caching.

## Usage Examples

### Import the Service
```javascript
import bookingService from './services/bookingService';
```

### Create a New Booking
```javascript
const newBookingData = {
  checkIn: '2025-12-01',
  checkOut: '2025-12-05',
  adults: 2,
  children: 0,
  roomType: 'singleKing',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@email.com',
  phone: '+1-555-0123',
  specialRequests: 'Ocean view room preferred',
  activityPackages: ['Pearl Harbor Historical Package'],
  amenityPackages: ['Spa & Wellness Package'],
  userId: 'user123',
  totalPrice: 880,
  nights: 4
};

const result = bookingService.createBooking(newBookingData);
if (result.success) {
  console.log('Booking created:', result.booking);
  alert(`Booking confirmed! ID: ${result.booking.id}`);
} else {
  console.error('Error:', result.error);
}
```

### Get User's Bookings
```javascript
const userBookings = bookingService.getBookingsByUserId('user123');
if (userBookings.success) {
  console.log('User bookings:', userBookings.bookings);
} else {
  console.error('Error loading bookings:', userBookings.error);
}
```

### Update a Booking
```javascript
const updatedData = {
  checkOut: '2025-12-07', // Extended stay
  nights: 6,
  totalPrice: 1320,
  specialRequests: 'Ocean view room preferred, late checkout'
};

const result = bookingService.updateBooking('BK001', updatedData);
if (result.success) {
  console.log('Booking updated:', result.booking);
  alert(result.message);
} else {
  console.error('Update failed:', result.error);
}
```

### Cancel a Booking
```javascript
const result = bookingService.deleteBooking('BK001');
if (result.success) {
  console.log('Booking cancelled:', result.booking);
  alert(result.message);
} else {
  console.error('Cancellation failed:', result.error);
}
```

### Get Booking Statistics
```javascript
const stats = bookingService.getBookingStats();
if (stats.success) {
  console.log('Booking statistics:', stats.stats);
  // { total: 5, confirmed: 3, pending: 1, cancelled: 1, totalRevenue: 2750 }
}
```

### Validate Booking Data
```javascript
const validation = bookingService.validateBookingData(bookingData);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  alert(`Please fix:\n${validation.errors.join('\n')}`);
}
```

## API Reference

### Methods

#### `createBooking(bookingData)`
Creates a new booking record.
- **Parameters:** `bookingData` (object) - Booking information
- **Returns:** `{ success: boolean, booking?: object, error?: string, message?: string }`

#### `getBookingById(bookingId)`
Retrieves a specific booking by ID.
- **Parameters:** `bookingId` (string) - The booking ID
- **Returns:** `{ success: boolean, booking?: object, error?: string }`

#### `getBookingsByUserId(userId)`
Gets all bookings for a specific user.
- **Parameters:** `userId` (string) - The user ID
- **Returns:** `{ success: boolean, bookings: array, error?: string }`

#### `updateBooking(bookingId, updatedData)`
Updates an existing booking.
- **Parameters:** 
  - `bookingId` (string) - The booking ID
  - `updatedData` (object) - Fields to update
- **Returns:** `{ success: boolean, booking?: object, error?: string, message?: string }`

#### `deleteBooking(bookingId)`
Cancels a booking (soft delete).
- **Parameters:** `bookingId` (string) - The booking ID
- **Returns:** `{ success: boolean, booking?: object, error?: string, message?: string }`

#### `getBookingsByStatus(status)`
Retrieves bookings filtered by status.
- **Parameters:** `status` (string) - 'confirmed', 'pending', or 'cancelled'
- **Returns:** `{ success: boolean, bookings: array, error?: string }`

#### `getBookingStats()`
Returns booking statistics.
- **Returns:** `{ success: boolean, stats?: object, error?: string }`

#### `validateBookingData(bookingData)`
Validates booking data before creation/update.
- **Parameters:** `bookingData` (object) - Data to validate
- **Returns:** `{ valid: boolean, errors: array }`

## Data Structure

### Booking Object
```javascript
{
  id: 'BK001',                    // Auto-generated
  userId: 'user123',              // Required
  checkIn: '2025-12-01',          // Required (YYYY-MM-DD)
  checkOut: '2025-12-05',         // Required (YYYY-MM-DD)
  adults: 2,                      // Required (min: 1)
  children: 0,                    // Optional
  guests: 2,                      // Calculated (adults + children)
  nights: 4,                      // Calculated
  roomType: 'singleKing',         // Required
  totalPrice: 880,                // Required
  firstName: 'John',              // Required
  lastName: 'Doe',                // Required
  email: 'john@email.com',        // Required
  phone: '+1-555-0123',           // Optional
  specialRequests: 'Text...',     // Optional
  activityPackages: [],           // Optional array
  amenityPackages: [],            // Optional array
  status: 'confirmed',            // Auto-set ('confirmed', 'pending', 'cancelled')
  dateCreated: '2025-09-14',      // Auto-set
  dateModified: '2025-09-14'      // Auto-updated
}
```

## Integration Points

### Used By
- `BookingPage.jsx` - Creating and modifying bookings
- `MyBookings.jsx` - Displaying user bookings and cancellations
- `BookingAdmin.jsx` - Administrative management

### Storage
- **Development:** localStorage (key: 'hiltim_bookings')
- **Production Ready:** Easy to swap for API calls or database integration

## Error Handling

All service methods return a consistent response format:
```javascript
{
  success: true/false,
  data?: any,           // Varies by method
  error?: string,       // Error message if success: false
  message?: string      // Success message if available
}
```

## Production Notes

To integrate with a real backend:
1. Replace localStorage calls with API endpoints
2. Add authentication headers
3. Implement error retry logic
4. Add loading states
5. Consider pagination for large datasets