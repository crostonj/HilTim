// User account management utilities
import fs from 'fs';
import path from 'path';

const USERS_CSV_PATH = path.join(process.cwd(), 'data', 'users.csv');
const BOOKINGS_CSV_PATH = path.join(process.cwd(), 'data', 'bookings.csv');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// User CSV headers
const USER_HEADERS = 'id,email,firstName,lastName,phone,dateCreated,preferences\n';
const BOOKING_HEADERS = 'id,userId,roomType,checkIn,checkOut,guests,totalPrice,activityPackages,amenityPackages,status,dateCreated,specialRequests\n';

// Initialize CSV files if they don't exist
const initializeCSVFiles = () => {
  ensureDataDirectory();
  
  if (!fs.existsSync(USERS_CSV_PATH)) {
    fs.writeFileSync(USERS_CSV_PATH, USER_HEADERS);
  }
  
  if (!fs.existsSync(BOOKINGS_CSV_PATH)) {
    fs.writeFileSync(BOOKINGS_CSV_PATH, BOOKING_HEADERS);
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Parse CSV line
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result.map(field => field.replace(/^"|"$/g, ''));
};

// Escape CSV field
const escapeCSVField = (field) => {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// User Account Functions
export const createUserAccount = async (userData) => {
  try {
    initializeCSVFiles();
    
    const userId = generateId();
    const user = {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
      dateCreated: new Date().toISOString(),
      preferences: userData.preferences || ''
    };
    
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Append user to CSV
    const userLine = [
      escapeCSVField(user.id),
      escapeCSVField(user.email),
      escapeCSVField(user.firstName),
      escapeCSVField(user.lastName),
      escapeCSVField(user.phone),
      escapeCSVField(user.dateCreated),
      escapeCSVField(user.preferences)
    ].join(',') + '\n';
    
    fs.appendFileSync(USERS_CSV_PATH, userLine);
    
    return user;
  } catch (error) {
    console.error('Error creating user account:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    initializeCSVFiles();
    
    if (!fs.existsSync(USERS_CSV_PATH)) {
      return null;
    }
    
    const csvContent = fs.readFileSync(USERS_CSV_PATH, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      if (fields[1] === email) {
        return {
          id: fields[0],
          email: fields[1],
          firstName: fields[2],
          lastName: fields[3],
          phone: fields[4],
          dateCreated: fields[5],
          preferences: fields[6]
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const getUserById = async (userId) => {
  try {
    initializeCSVFiles();
    
    if (!fs.existsSync(USERS_CSV_PATH)) {
      return null;
    }
    
    const csvContent = fs.readFileSync(USERS_CSV_PATH, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      if (fields[0] === userId) {
        return {
          id: fields[0],
          email: fields[1],
          firstName: fields[2],
          lastName: fields[3],
          phone: fields[4],
          dateCreated: fields[5],
          preferences: fields[6]
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Booking Functions
export const createBooking = async (bookingData, userId) => {
  try {
    initializeCSVFiles();
    
    const bookingId = generateId();
    const booking = {
      id: bookingId,
      userId: userId,
      roomType: bookingData.roomType,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      totalPrice: bookingData.totalPrice,
      activityPackages: JSON.stringify(bookingData.activityPackages || []),
      amenityPackages: JSON.stringify(bookingData.amenityPackages || []),
      status: 'confirmed',
      dateCreated: new Date().toISOString(),
      specialRequests: bookingData.specialRequests || ''
    };
    
    // Append booking to CSV
    const bookingLine = [
      escapeCSVField(booking.id),
      escapeCSVField(booking.userId),
      escapeCSVField(booking.roomType),
      escapeCSVField(booking.checkIn),
      escapeCSVField(booking.checkOut),
      escapeCSVField(booking.guests),
      escapeCSVField(booking.totalPrice),
      escapeCSVField(booking.activityPackages),
      escapeCSVField(booking.amenityPackages),
      escapeCSVField(booking.status),
      escapeCSVField(booking.dateCreated),
      escapeCSVField(booking.specialRequests)
    ].join(',') + '\n';
    
    fs.appendFileSync(BOOKINGS_CSV_PATH, bookingLine);
    
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    initializeCSVFiles();
    
    if (!fs.existsSync(BOOKINGS_CSV_PATH)) {
      return [];
    }
    
    const csvContent = fs.readFileSync(BOOKINGS_CSV_PATH, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    const bookings = [];
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      if (fields[1] === userId) {
        bookings.push({
          id: fields[0],
          userId: fields[1],
          roomType: fields[2],
          checkIn: fields[3],
          checkOut: fields[4],
          guests: fields[5],
          totalPrice: fields[6],
          activityPackages: JSON.parse(fields[7] || '[]'),
          amenityPackages: JSON.parse(fields[8] || '[]'),
          status: fields[9],
          dateCreated: fields[10],
          specialRequests: fields[11]
        });
      }
    }
    
    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return [];
  }
};

export const getAllBookings = async () => {
  try {
    initializeCSVFiles();
    
    if (!fs.existsSync(BOOKINGS_CSV_PATH)) {
      return [];
    }
    
    const csvContent = fs.readFileSync(BOOKINGS_CSV_PATH, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    const bookings = [];
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      if (fields.length >= 12) {
        bookings.push({
          id: fields[0],
          userId: fields[1],
          roomType: fields[2],
          checkIn: fields[3],
          checkOut: fields[4],
          guests: fields[5],
          totalPrice: fields[6],
          activityPackages: JSON.parse(fields[7] || '[]'),
          amenityPackages: JSON.parse(fields[8] || '[]'),
          status: fields[9],
          dateCreated: fields[10],
          specialRequests: fields[11]
        });
      }
    }
    
    return bookings;
  } catch (error) {
    console.error('Error getting all bookings:', error);
    return [];
  }
};