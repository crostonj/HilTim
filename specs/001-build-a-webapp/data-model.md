# Data Model: Hotel Website Entities

**Date**: September 18, 2025  
**Feature**: Hotel Website with Booking System  
**Phase**: 1 - Data Design and Entity Definitions

## Frontend Data Model Overview

This data model defines TypeScript interfaces and state management patterns for the hotel website frontend. Since this is initially a frontend-only application with mock data, the focus is on type safety, state management, and future API integration.

## Core Entity Interfaces

### Guest
**Purpose**: Represents a person making a hotel reservation

```typescript
interface Guest {
  readonly id: string;              // UUID for guest identification
  firstName: string;                // Required, 1-50 characters
  lastName: string;                 // Required, 1-50 characters  
  email: string;                    // Required, valid email format
  phone: string;                    // Required, formatted phone number
  address?: Address;                // Optional billing/contact address
  preferences?: GuestPreferences;   // Optional room and service preferences
  readonly createdAt: Date;         // Guest record creation timestamp
  readonly updatedAt: Date;         // Last modification timestamp
}

interface Address {
  street: string;                   // Street address
  city: string;                     // City name
  state: string;                    // State/province
  zipCode: string;                  // Postal code
  country: string;                  // Country (defaults to 'US')
}

interface GuestPreferences {
  roomType?: RoomType;              // Preferred room category
  floorPreference?: FloorPreference; // Floor location preference
  smokingPreference: boolean;        // Smoking room preference
  accessibilityNeeds: AccessibilityNeed[]; // ADA requirements
  dietaryRestrictions: string[];     // Food allergy/dietary info
  contactMethod: ContactMethod;      // Preferred communication method
}

type FloorPreference = 'high' | 'low' | 'middle' | 'no-preference';
type AccessibilityNeed = 'wheelchair' | 'visual' | 'hearing' | 'mobility' | 'cognitive';
type ContactMethod = 'email' | 'phone' | 'text';
```

**Validation Rules**:
- `firstName`, `lastName`: 1-50 characters, letters/hyphens/apostrophes only
- `email`: Valid email format, max 100 characters, required for booking
- `phone`: Valid US/international format, required for booking
- `address`: All fields required if address provided

### Room
**Purpose**: Represents hotel accommodations available for booking

```typescript
interface Room {
  readonly id: string;              // Unique room identifier
  roomNumber?: string;              // Physical room number (optional for types)
  type: RoomType;                   // Room category
  name: string;                     // Display name
  description: string;              // Detailed description
  shortDescription: string;         // Brief summary for cards
  capacity: RoomCapacity;           // Occupancy limits
  amenities: string[];              // Room-specific amenities
  images: RoomImage[];              // Photo gallery
  pricing: RoomPricing;             // Rate information
  availability: RoomAvailability;   // Availability calendar
  details: RoomDetails;             // Physical characteristics
  policies: RoomPolicies;           // Rules and restrictions
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

type RoomType = 'standard' | 'deluxe' | 'suite' | 'penthouse' | 'family';

interface RoomCapacity {
  adults: number;                   // Max adult occupancy (1-8)
  children: number;                 // Max child occupancy (0-4)
  total: number;                    // Max total occupancy
}

interface RoomImage {
  readonly id: string;              // Image identifier
  url: string;                      // Image URL (responsive)
  altText: string;                  // Accessibility description
  isPrimary: boolean;               // Main room image
  category: ImageCategory;          // Image type
}

type ImageCategory = 'bedroom' | 'bathroom' | 'view' | 'amenity' | 'layout';

interface RoomPricing {
  baseRate: number;                 // Standard nightly rate
  currency: string;                 // Currency code (USD)
  taxRate: number;                  // Tax percentage (0-1)
  fees: RoomFee[];                  // Additional charges
  seasonalRates: SeasonalRate[];    // Variable pricing
}

interface RoomFee {
  type: FeeType;                    // Fee category
  amount: number;                   // Fee amount
  isPerNight: boolean;              // Per night vs per stay
  description: string;              // Fee explanation
  isTaxable: boolean;               // Subject to tax
}

type FeeType = 'cleaning' | 'resort' | 'parking' | 'pet' | 'wifi' | 'other';

interface SeasonalRate {
  readonly id: string;              // Rate period identifier
  name: string;                     // Rate period name
  startDate: Date;                  // Rate period start
  endDate: Date;                    // Rate period end  
  rate: number;                     // Rate for this period
  multiplier?: number;              // Alternative: rate multiplier
}

interface RoomAvailability {
  isCurrentlyAvailable: boolean;    // Real-time availability
  availableCalendar: AvailabilityDay[]; // Next 90 days
  minimumStay: number;              // Min nights required
  maximumStay: number;              // Max nights allowed
}

interface AvailabilityDay {
  date: Date;                       // Calendar date
  isAvailable: boolean;             // Room available this date
  rate?: number;                    // Rate for this date
  minimumStay?: number;             // Min stay if different
}

interface RoomDetails {
  area: number;                     // Square footage
  bedConfiguration: BedConfiguration; // Bed setup
  viewType: ViewType;               // Room view category  
  bathroomType: BathroomType;       // Bathroom features
  floorRange: string;               // Available floors
  isAccessible: boolean;            // ADA compliant
  smokingAllowed: boolean;          // Smoking policy
  hasBalcony: boolean;              // Balcony/patio
  hasKitchenette: boolean;          // Kitchen facilities
}

interface BedConfiguration {
  primaryBed: BedType;              // Main bed type
  primaryBedCount: number;          // Number of primary beds
  secondaryBed?: BedType;           // Additional bed type
  secondaryBedCount?: number;       // Number of additional beds
  maxOccupancy: number;             // Total bed capacity
}

type BedType = 'king' | 'queen' | 'double' | 'twin' | 'sofa-bed' | 'murphy-bed';
type ViewType = 'ocean' | 'city' | 'garden' | 'pool' | 'courtyard' | 'mountain' | 'interior';
type BathroomType = 'standard' | 'luxury' | 'spa' | 'accessible' | 'shared';

interface RoomPolicies {
  checkInTime: string;              // Earliest check-in (24hr format)
  checkOutTime: string;             // Latest check-out (24hr format)
  cancellationPolicy: string;       // Cancellation terms
  modificationPolicy: string;       // Change terms
  petPolicy: PetPolicy;             // Pet accommodation
  partyPolicy: string;              // Event/party rules
}

interface PetPolicy {
  allowed: boolean;                 // Pets permitted
  types: PetType[];                 // Allowed pet types
  fee?: number;                     // Pet fee amount
  restrictions: string[];           // Pet rules
  deposit?: number;                 // Pet deposit
}

type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'other';
```

### Booking
**Purpose**: Represents a hotel reservation and booking state

```typescript
interface Booking {
  readonly id: string;              // Booking UUID
  confirmationNumber: string;       // Human-readable confirmation
  status: BookingStatus;            // Current booking state
  guest: Guest;                     // Guest information
  room: BookingRoom;                // Booked room details
  stay: StayDetails;                // Check-in/out information
  occupancy: RoomCapacity;          // Guest count
  packages: BookingPackage[];       // Selected add-ons
  pricing: BookingPricing;          // Cost breakdown
  payment: PaymentInformation;      // Payment details
  specialRequests?: string;         // Guest notes/requests
  metadata: BookingMetadata;        // System information
}

type BookingStatus = 
  | 'draft'         // In-progress booking (localStorage)
  | 'pending'       // Awaiting payment
  | 'confirmed'     // Payment successful
  | 'checked-in'    // Guest arrived
  | 'checked-out'   // Stay completed
  | 'cancelled'     // Booking cancelled
  | 'no-show';      // Guest failed to arrive

interface BookingRoom {
  roomId: string;                   // Reference to Room.id
  roomType: RoomType;               // Room category
  roomName: string;                 // Display name
  roomNumber?: string;              // Assigned room (if available)
}

interface StayDetails {
  checkInDate: Date;                // Arrival date
  checkOutDate: Date;               // Departure date
  numberOfNights: number;           // Calculated stay length
  actualCheckIn?: Date;             // Actual arrival time
  actualCheckOut?: Date;            // Actual departure time
  earlyCheckInRequested: boolean;   // Early arrival request
  lateCheckOutRequested: boolean;   // Late departure request
}

interface BookingPackage {
  packageId: string;                // Reference to Package.id
  packageName: string;              // Package display name
  quantity: number;                 // Number of packages
  totalCost: number;                // Package cost
}

interface BookingPricing {
  roomCost: PricingBreakdown;       // Room charges
  packageCost: number;              // Add-on packages
  subtotal: number;                 // Before taxes/fees
  taxes: number;                    // Tax amount
  fees: RoomFee[];                  // Applied fees
  total: number;                    // Final amount
  currency: string;                 // Currency code
  estimatedOnly: boolean;           // Pricing may change
}

interface PricingBreakdown {
  baseRate: number;                 // Nightly rate
  numberOfNights: number;           // Stay duration
  seasonalAdjustments: SeasonalAdjustment[]; // Rate modifications
  subtotal: number;                 // Room cost before fees
}

interface SeasonalAdjustment {
  date: Date;                       // Adjustment date
  originalRate: number;             // Base rate
  adjustedRate: number;             // Modified rate
  reason: string;                   // Adjustment explanation
}

interface PaymentInformation {
  method?: PaymentMethod;           // Payment type
  status: PaymentStatus;            // Payment state
  transactionId?: string;           // Payment processor ID
  amount?: number;                  // Payment amount
  currency?: string;                // Payment currency
  billingAddress?: Address;         // Billing information
  lastFourDigits?: string;          // Card last 4 digits
  expirationMonth?: number;         // Card expiration month
  expirationYear?: number;          // Card expiration year
}

type PaymentMethod = 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | 'cash';
type PaymentStatus = 'pending' | 'processing' | 'authorized' | 'captured' | 'failed' | 'refunded';

interface BookingMetadata {
  readonly createdAt: Date;         // Booking creation
  readonly updatedAt: Date;         // Last modification
  createdBy: string;                // Booking source
  ipAddress?: string;               // Client IP (privacy compliant)
  userAgent?: string;               // Browser info (analytics)
  referralSource?: string;          // Marketing attribution
}
```

### Package
**Purpose**: Represents hotel package offerings and add-on services

```typescript
interface Package {
  readonly id: string;              // Package identifier
  name: string;                     // Package display name
  shortName: string;                // Brief name for selection
  description: string;              // Full package description
  summary: string;                  // Brief description for cards
  type: PackageType;                // Package category
  includes: PackageInclusion[];     // What's included
  pricing: PackagePricing;          // Cost structure
  images: PackageImage[];           // Package imagery
  availability: PackageAvailability; // When available
  restrictions: PackageRestrictions; // Limitations and rules
  isActive: boolean;                // Currently offered
  sortOrder: number;                // Display ordering
  metadata: PackageMetadata;        // System information
}

type PackageType = 
  | 'romance'       // Couples packages
  | 'family'        // Family-friendly packages
  | 'business'      // Business travel enhancements
  | 'wellness'      // Spa and wellness packages
  | 'dining'        // Restaurant and culinary packages
  | 'adventure'     // Activity-based packages
  | 'seasonal'      // Holiday/seasonal offerings
  | 'luxury';       // Premium upgrade packages

interface PackageInclusion {
  readonly id: string;              // Inclusion identifier
  type: InclusionType;              // What type of inclusion
  name: string;                     // Inclusion name
  description: string;              // Detailed description
  quantity?: number;                // How many included
  estimatedValue?: number;          // Monetary value
  isHighlight: boolean;             // Featured inclusion
}

type InclusionType = 'meal' | 'activity' | 'service' | 'amenity' | 'transportation' | 'upgrade';

interface PackagePricing {
  basePrice: number;                // Package cost
  isPerPerson: boolean;             // Per person vs per booking
  isPerNight: boolean;              // Per night vs per stay
  currency: string;                 // Currency code
  minimumStay?: number;             // Required minimum nights
  validityPeriod: DateRange;        // When pricing is valid
  discounts: PackageDiscount[];     // Available discounts
}

interface DateRange {
  startDate: Date;                  // Period start
  endDate?: Date;                   // Period end (null = ongoing)
}

interface PackageDiscount {
  type: DiscountType;               // Discount category
  amount: number;                   // Discount value
  isPercentage: boolean;            // Percentage vs fixed amount
  minimumStay?: number;             // Required nights for discount
  validDays: number[];              // Days of week (0=Sunday)
}

type DiscountType = 'early-bird' | 'extended-stay' | 'repeat-guest' | 'seasonal' | 'group';

interface PackageImage {
  readonly id: string;              // Image identifier
  url: string;                      // Image URL
  altText: string;                  // Accessibility text
  isPrimary: boolean;               // Main package image
  category: PackageImageCategory;   // Image type
}

type PackageImageCategory = 'hero' | 'amenity' | 'activity' | 'food' | 'room-upgrade';

interface PackageAvailability {
  isCurrentlyAvailable: boolean;    // Available now
  availableCalendar: AvailabilityDay[]; // Specific date availability
  daysOfWeek: number[];             // Available days (0=Sunday)
  blackoutDates: Date[];            // Unavailable dates
  seasonalAvailability: SeasonalAvailability[]; // Seasonal restrictions
}

interface SeasonalAvailability {
  name: string;                     // Season name
  startDate: Date;                  // Season start
  endDate: Date;                    // Season end
  isAvailable: boolean;             // Available during season
  priceModifier?: number;           // Price adjustment
}

interface PackageRestrictions {
  minimumAge?: number;              // Age requirement
  maximumOccupancy?: number;        // Max guests
  compatibleRoomTypes: RoomType[];  // Allowed room categories
  advanceBookingRequired: number;   // Days notice required
  cancellationDeadline: number;     // Hours before cancellation fee
  transferable: boolean;            // Can be moved to different booking
}

interface PackageMetadata {
  readonly createdAt: Date;         // Package creation
  readonly updatedAt: Date;         // Last modification
  popularityScore: number;          // Booking frequency metric
  averageRating?: number;           // Guest rating average
  totalBookings: number;            // Historical booking count
}
```

### Amenity
**Purpose**: Represents hotel facilities and services

```typescript
interface Amenity {
  readonly id: string;              // Amenity identifier
  name: string;                     // Amenity display name
  shortName: string;                // Brief name for lists
  description: string;              // Full description
  category: AmenityCategory;        // Amenity grouping
  subcategory?: string;             // Specific amenity type
  location: AmenityLocation;        // Where amenity is located
  operatingHours: OperatingSchedule; // When amenity is available
  pricing: AmenityPricing;          // Cost information
  images: AmenityImage[];           // Amenity photos
  features: AmenityFeature[];       // Specific capabilities
  restrictions: AmenityRestrictions; // Age/access limitations
  contact: ContactInformation;      // Amenity contact details
  booking: BookingRequirements;     // Reservation information
  isActive: boolean;                // Currently available
  metadata: AmenityMetadata;        // System information
}

type AmenityCategory = 
  | 'recreation'      // Pool, gym, games, sports
  | 'dining'          // Restaurants, bars, room service  
  | 'business'        // Meeting rooms, business center
  | 'wellness'        // Spa, fitness, health services
  | 'convenience'     // Concierge, parking, laundry
  | 'entertainment'   // Shows, events, live music
  | 'family'          // Kids club, playground, childcare
  | 'outdoor';        // Garden, beach, outdoor activities

interface AmenityLocation {
  building?: string;                // Building name/number
  floor?: string;                   // Floor location
  room?: string;                    // Room/suite number
  area: string;                     // General location description
  coordinates?: GeographicCoordinates; // GPS coordinates
  directions?: string;              // How to find amenity
}

interface GeographicCoordinates {
  latitude: number;                 // Latitude coordinate
  longitude: number;                // Longitude coordinate
}

interface OperatingSchedule {
  regularHours: WeeklyHours;        // Standard operating hours
  holidayHours: HolidayHours[];     // Holiday schedule
  seasonalHours: SeasonalHours[];   // Seasonal variations
  specialEvents: SpecialEvent[];    // Event-based closures/hours
  timezone: string;                 // Time zone identifier
}

interface WeeklyHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

interface DayHours {
  isOpen: boolean;                  // Amenity open this day
  openTime?: string;                // Opening time (HH:mm format)
  closeTime?: string;               // Closing time (HH:mm format)
  breaks: TimeBreak[];              // Closure periods during day
  notes?: string;                   // Special notes for this day
}

interface TimeBreak {
  startTime: string;                // Break start (HH:mm)
  endTime: string;                  // Break end (HH:mm)
  reason: string;                   // Reason for break
}

interface HolidayHours {
  holidayName: string;              // Holiday name
  date: Date;                       // Holiday date
  hours?: DayHours;                 // Special hours (null if closed)
  isRecurring: boolean;             // Annual holiday
}

interface SeasonalHours {
  seasonName: string;               // Season identifier
  startDate: Date;                  // Season start
  endDate: Date;                    // Season end
  hours: WeeklyHours;               // Hours during season
}

interface SpecialEvent {
  eventName: string;                // Event name
  startDateTime: Date;              // Event start
  endDateTime: Date;                // Event end
  impactType: EventImpact;          // How event affects amenity
  description?: string;             // Event details
}

type EventImpact = 'closed' | 'limited-access' | 'special-hours' | 'private-event';

interface AmenityPricing {
  isFree: boolean;                  // Complimentary for guests
  pricing?: PricingStructure;       // Cost details (if paid)
  memberDiscounts: Discount[];      // Available discounts
  packageInclusions: string[];      // Packages that include amenity
}

interface PricingStructure {
  type: PricingType;                // How pricing works
  basePrice: number;                // Standard rate
  currency: string;                 // Currency code
  validityPeriod: DateRange;        // When pricing is valid
  variations: PriceVariation[];     // Different rates
}

type PricingType = 'per-use' | 'per-hour' | 'per-day' | 'per-person' | 'per-group' | 'membership';

interface PriceVariation {
  condition: string;                // When this price applies
  price: number;                    // Alternative price
  description: string;              // Explanation
}

interface Discount {
  type: DiscountType;               // Discount category
  amount: number;                   // Discount value
  isPercentage: boolean;            // Percentage vs fixed
  eligibilityRequirement: string;   // Who qualifies
}

interface AmenityImage {
  readonly id: string;              // Image identifier
  url: string;                      // Image URL
  altText: string;                  // Accessibility description
  isPrimary: boolean;               // Main amenity image
  category: AmenityImageCategory;   // Image type
}

type AmenityImageCategory = 'exterior' | 'interior' | 'equipment' | 'activity' | 'staff';

interface AmenityFeature {
  name: string;                     // Feature name
  description: string;              // Feature description
  isHighlight: boolean;             // Featured capability
  category: FeatureCategory;        // Feature type
}

type FeatureCategory = 'equipment' | 'service' | 'accessibility' | 'safety' | 'comfort';

interface AmenityRestrictions {
  minimumAge?: number;              // Age requirement
  maximumAge?: number;              // Age limit
  adultSupervisionRequired: boolean; // Child supervision needed
  accessibilityFeatures: AccessibilityFeature[]; // ADA features
  capacityLimit?: number;           // Maximum occupancy
  dressCode?: string;               // Clothing requirements
  healthRestrictions: string[];     // Health/safety limitations
  guestOnly: boolean;               // Restricted to hotel guests
}

interface AccessibilityFeature {
  type: AccessibilityType;          // Feature type
  description: string;              // Feature description
  available: boolean;               // Currently available
}

type AccessibilityType = 'wheelchair-access' | 'visual-aids' | 'hearing-aids' | 'mobility-assistance';

interface ContactInformation {
  phone?: string;                   // Direct phone number
  email?: string;                   // Direct email
  extension?: string;               // Hotel extension
  website?: string;                 // Amenity website
  socialMedia: SocialMediaLinks;    // Social media accounts
}

interface SocialMediaLinks {
  instagram?: string;               // Instagram handle
  facebook?: string;                // Facebook page
  twitter?: string;                 // Twitter handle
  youtube?: string;                 // YouTube channel
}

interface BookingRequirements {
  reservationRequired: boolean;     // Booking needed
  advanceNoticeRequired: number;    // Hours notice needed
  cancellationPolicy?: string;      // Cancellation terms
  maxReservationLength?: number;    // Maximum booking duration
  bookingMethods: BookingMethod[];  // How to book
}

type BookingMethod = 'online' | 'phone' | 'email' | 'front-desk' | 'mobile-app';

interface AmenityMetadata {
  readonly createdAt: Date;         // Amenity creation
  readonly updatedAt: Date;         // Last modification
  popularityRanking: number;        // Usage popularity
  maintenanceSchedule: MaintenanceEvent[]; // Planned maintenance
  averageRating?: number;           // Guest rating average
  totalReviews: number;             // Review count
}

interface MaintenanceEvent {
  startDate: Date;                  // Maintenance start
  endDate: Date;                    // Maintenance end
  type: MaintenanceType;            // Maintenance category
  description: string;              // Maintenance details
  impactLevel: ImpactLevel;         // Service disruption level
}

type MaintenanceType = 'routine' | 'repair' | 'upgrade' | 'deep-clean' | 'inspection';
type ImpactLevel = 'no-impact' | 'minor-disruption' | 'limited-service' | 'closed';
```

## State Management Patterns

### React Context Structure

```typescript
// Global application state contexts
interface AppContexts {
  BookingContext: BookingContextType;     // Booking flow state
  UIContext: UIContextType;               // UI state and preferences  
  UserContext: UserContextType;           // User session and preferences
}

interface BookingContextType {
  // Current booking state
  currentBooking: Booking | null;
  availableRooms: Room[];
  selectedPackages: Package[];
  
  // Booking actions
  actions: {
    updateGuest: (guest: Partial<Guest>) => void;
    selectRoom: (roomId: string) => void;
    addPackage: (packageId: string) => void;
    removePackage: (packageId: string) => void;
    updateStayDates: (checkIn: Date, checkOut: Date) => void;
    calculatePricing: () => BookingPricing;
    saveBookingDraft: () => void;
    loadBookingDraft: () => void;
    clearBooking: () => void;
    submitBooking: () => Promise<BookingResult>;
  };
  
  // Booking flow state
  currentStep: BookingStep;
  validationErrors: ValidationError[];
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

type BookingStep = 'dates' | 'rooms' | 'packages' | 'guest-info' | 'payment' | 'confirmation';

interface BookingResult {
  success: boolean;
  booking?: Booking;
  confirmationNumber?: string;
  error?: string;
}

interface ValidationError {
  field: string;                    // Field name with error
  message: string;                  // Error message
  type: ValidationType;             // Error category
}

type ValidationType = 'required' | 'format' | 'range' | 'availability' | 'business-rule';

interface UIContextType {
  // Navigation state
  currentPage: PageType;
  navigationHistory: PageType[];
  
  // UI state
  modals: {
    isRoomDetailOpen: boolean;
    isPackageDetailOpen: boolean;
    isGalleryOpen: boolean;
    isMenuOpen: boolean;
  };
  
  // UI preferences
  preferences: {
    theme: ThemeType;
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: FontSize;
  };
  
  // UI actions
  actions: {
    navigate: (page: PageType) => void;
    openModal: (modal: ModalType) => void;
    closeModal: (modal: ModalType) => void;
    updatePreferences: (prefs: Partial<UIPreferences>) => void;
    showNotification: (notification: Notification) => void;
  };
}

type PageType = 'home' | 'rooms' | 'packages' | 'amenities' | 'booking';
type ModalType = 'room-detail' | 'package-detail' | 'gallery' | 'menu';
type ThemeType = 'light' | 'dark' | 'auto';
type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface Notification {
  id: string;                       // Notification identifier
  type: NotificationType;           // Notification category
  title: string;                    // Notification title
  message: string;                  // Notification content
  duration?: number;                // Auto-dismiss time (ms)
  actions?: NotificationAction[];   // Available actions
}

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationAction {
  label: string;                    // Action button text
  action: () => void;               // Action to perform
  style: ActionStyle;               // Button styling
}

type ActionStyle = 'primary' | 'secondary' | 'danger';
```

### Local Storage Schema

```typescript
// Data persistence in localStorage
interface LocalStorageSchema {
  // Booking persistence
  'hotel-booking-draft': Booking | null;
  'hotel-booking-history': BookingSummary[];
  
  // User preferences
  'hotel-ui-preferences': UIPreferences;
  'hotel-accessibility-settings': AccessibilitySettings;
  
  // Search and filter state
  'hotel-search-filters': SearchFilters;
  'hotel-recent-searches': SearchHistory[];
  
  // Analytics and optimization
  'hotel-performance-metrics': PerformanceMetrics;
  'hotel-user-session': SessionData;
}

interface BookingSummary {
  id: string;                       // Booking ID
  confirmationNumber: string;       // Confirmation code
  guestName: string;                // Primary guest name
  checkInDate: Date;                // Arrival date
  checkOutDate: Date;               // Departure date
  roomType: RoomType;               // Room category
  totalCost: number;                // Final amount paid
  status: BookingStatus;            // Booking state
}

interface UIPreferences {
  theme: ThemeType;                 // Color scheme preference
  language: LanguageCode;           // Preferred language
  currency: CurrencyCode;           // Preferred currency
  dateFormat: DateFormat;           // Date display format
  timeFormat: TimeFormat;           // Time display format
}

type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
type TimeFormat = '12-hour' | '24-hour';

interface AccessibilitySettings {
  reducedMotion: boolean;           // Disable animations
  highContrast: boolean;            // High contrast mode
  screenReader: boolean;            // Screen reader optimizations
  keyboardNavigation: boolean;      // Keyboard-only navigation
  fontSize: FontSize;               // Text size preference
  focusIndicator: FocusStyle;       // Focus indicator style
}

type FocusStyle = 'default' | 'high-contrast' | 'thick-border';

interface SearchFilters {
  checkInDate?: Date;               // Default check-in
  checkOutDate?: Date;              // Default check-out
  occupancy: RoomCapacity;          // Default occupancy
  roomTypes: RoomType[];            // Preferred room types
  priceRange: PriceRange;           // Price filter range
  amenities: string[];              // Required amenities
  packageTypes: PackageType[];      // Preferred packages
}

interface PriceRange {
  minimum: number;                  // Minimum price
  maximum: number;                  // Maximum price
  currency: CurrencyCode;           // Price currency
}

interface SearchHistory {
  readonly id: string;              // Search identifier
  timestamp: Date;                  // Search time
  filters: SearchFilters;           // Search criteria
  resultsCount: number;             // Number of results
  selectedRoomId?: string;          // Room selected from search
}

interface PerformanceMetrics {
  pageLoadTimes: Record<PageType, number[]>; // Load time measurements
  componentRenderTimes: Record<string, number>; // Component performance
  userInteractionLatency: InteractionMetric[]; // Interaction responsiveness
  errorCounts: Record<string, number>; // Error frequency
  featureUsage: Record<string, number>; // Feature adoption
}

interface InteractionMetric {
  action: UserAction;               // User action type
  timestamp: Date;                  // When action occurred
  latency: number;                  // Response time (ms)
  success: boolean;                 // Action completed successfully
}

type UserAction = 'navigation' | 'form-submission' | 'search' | 'booking-step' | 'modal-open';

interface SessionData {
  sessionId: string;                // Session identifier
  startTime: Date;                  // Session start
  lastActivity: Date;               // Last user action
  pageViews: PageView[];            // Page navigation history
  userAgent: string;                // Browser information
  screenResolution: string;         // Display resolution
  referralSource?: string;          // How user arrived
}

interface PageView {
  page: PageType;                   // Page visited
  timestamp: Date;                  // Visit time
  duration?: number;                // Time spent on page (ms)
  exitAction?: ExitAction;          // How user left page
}

type ExitAction = 'navigation' | 'back-button' | 'external-link' | 'close-tab' | 'timeout';
```

## Data Validation and Business Rules

### Validation Functions

```typescript
// Entity validation functions
interface ValidationFunctions {
  validateGuest: (guest: Partial<Guest>) => ValidationResult;
  validateBooking: (booking: Partial<Booking>) => ValidationResult;
  validateRoom: (room: Partial<Room>) => ValidationResult;
  validatePackage: (pkg: Partial<Package>) => ValidationResult;
  validateAmenity: (amenity: Partial<Amenity>) => ValidationResult;
}

interface ValidationResult {
  isValid: boolean;                 // Overall validation result
  errors: ValidationError[];        // Specific validation errors
  warnings: ValidationWarning[];    // Non-blocking warnings
}

interface ValidationWarning {
  field: string;                    // Field with warning
  message: string;                  // Warning message
  suggestion?: string;              // Suggested improvement
}

// Business rule validation
interface BusinessRules {
  // Booking rules
  isRoomAvailable: (roomId: string, checkIn: Date, checkOut: Date) => boolean;
  isPackageCompatible: (packageId: string, roomType: RoomType, dates: DateRange) => boolean;
  calculateMinimumStay: (roomId: string, checkIn: Date) => number;
  validateOccupancy: (occupancy: RoomCapacity, roomCapacity: RoomCapacity) => boolean;
  
  // Pricing rules
  calculateRoomCost: (roomId: string, dates: DateRange) => number;
  calculatePackageCost: (packageId: string, dates: DateRange, occupancy: RoomCapacity) => number;
  calculateTaxes: (subtotal: number, location: Address) => number;
  applyDiscounts: (pricing: BookingPricing, discounts: ApplicableDiscount[]) => BookingPricing;
  
  // Policy rules
  canCancelBooking: (booking: Booking, cancellationDate: Date) => CancellationResult;
  canModifyBooking: (booking: Booking, modification: BookingModification) => ModificationResult;
  calculateRefundAmount: (booking: Booking, cancellationDate: Date) => number;
}

interface ApplicableDiscount {
  type: DiscountType;               // Discount category
  amount: number;                   // Discount value
  isPercentage: boolean;            // Percentage vs fixed amount
  applicableTo: DiscountTarget;     // What discount applies to
}

type DiscountTarget = 'room-cost' | 'package-cost' | 'total-cost' | 'taxes' | 'fees';

interface CancellationResult {
  canCancel: boolean;               // Cancellation allowed
  fee: number;                      // Cancellation fee
  refundAmount: number;             // Amount to be refunded
  deadline: Date;                   // Last cancellation date
  policy: string;                   // Applicable policy text
}

interface BookingModification {
  newCheckIn?: Date;                // New arrival date
  newCheckOut?: Date;               // New departure date
  newRoomId?: string;               // Different room
  newOccupancy?: RoomCapacity;      // Different guest count
  addPackages?: string[];           // Additional packages
  removePackages?: string[];        // Packages to remove
}

interface ModificationResult {
  canModify: boolean;               // Modification allowed
  fee: number;                      // Modification fee
  costDifference: number;           // Additional cost (+ or -)
  newPricing: BookingPricing;       // Updated pricing
  restrictions: string[];           // Modification limitations
}
```

## Summary

This comprehensive data model provides:

✅ **Type Safety**: All entities fully typed with TypeScript interfaces  
✅ **State Management**: Context patterns for booking flow and UI state  
✅ **Data Persistence**: localStorage schema for offline functionality  
✅ **Validation**: Business rules and validation functions  
✅ **Accessibility**: Built-in accessibility considerations  
✅ **Performance**: Optimized for frontend rendering and updates  
✅ **Constitutional Compliance**: Minimal dependencies, component-first design  

**Ready for Phase 1 Contract Generation**: ✅  
**Supports User Requirements**: ✅ Vite + React + CSS architecture