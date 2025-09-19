# API Contracts: Hotel Website

**Date**: September 18, 2025  
**Feature**: Hotel Website with Booking System  
**Phase**: 1 - Contract Definitions and Mock Implementation

## Contract Overview

These contracts define the service layer interfaces for the hotel website frontend. Initially implemented with mock data and localStorage persistence, these contracts provide a foundation for future backend integration while maintaining consistent interfaces throughout the application.

## Service Layer Architecture

```typescript
// Main service interfaces
interface HotelServices {
  roomService: RoomServiceInterface;
  packageService: PackageServiceInterface;
  amenityService: AmenityServiceInterface;
  bookingService: BookingServiceInterface;
  availabilityService: AvailabilityServiceInterface;
  pricingService: PricingServiceInterface;
}

// Service response wrapper
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  metadata?: ResponseMetadata;
}

interface ServiceError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
}

type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAVAILABLE'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR';

interface ResponseMetadata {
  requestId: string;
  timestamp: Date;
  executionTime: number;
  source: DataSource;
}

type DataSource = 'mock' | 'localStorage' | 'api' | 'cache';
```

## Room Service Contracts

```typescript
interface RoomServiceInterface {
  // Room retrieval operations
  getAllRooms(filters?: RoomFilters): Promise<ServiceResponse<Room[]>>;
  getRoomById(roomId: string): Promise<ServiceResponse<Room>>;
  getRoomsByType(roomType: RoomType): Promise<ServiceResponse<Room[]>>;
  searchRooms(searchCriteria: RoomSearchCriteria): Promise<ServiceResponse<RoomSearchResult>>;
  
  // Room availability operations
  checkRoomAvailability(roomId: string, dates: DateRange): Promise<ServiceResponse<AvailabilityStatus>>;
  getRoomAvailabilityCalendar(roomId: string, months: number): Promise<ServiceResponse<AvailabilityCalendar>>;
  
  // Room comparison and recommendations
  compareRooms(roomIds: string[]): Promise<ServiceResponse<RoomComparison>>;
  getRecommendedRooms(preferences: GuestPreferences): Promise<ServiceResponse<Room[]>>;
}

interface RoomFilters {
  roomTypes?: RoomType[];
  priceRange?: PriceRange;
  capacity?: RoomCapacity;
  amenities?: string[];
  viewTypes?: ViewType[];
  isAccessible?: boolean;
  smokingAllowed?: boolean;
}

interface RoomSearchCriteria {
  checkIn: Date;
  checkOut: Date;
  occupancy: RoomCapacity;
  filters?: RoomFilters;
  sortBy?: RoomSortOption;
  sortOrder?: SortOrder;
}

type RoomSortOption = 'price' | 'capacity' | 'rating' | 'popularity' | 'name';
type SortOrder = 'asc' | 'desc';

interface RoomSearchResult {
  rooms: Room[];
  totalCount: number;
  appliedFilters: RoomFilters;
  searchCriteria: RoomSearchCriteria;
  suggestions?: SearchSuggestion[];
}

interface SearchSuggestion {
  type: SuggestionType;
  message: string;
  action?: SuggestionAction;
}

type SuggestionType = 'alternative-dates' | 'different-room-type' | 'adjust-occupancy' | 'nearby-hotels';

interface SuggestionAction {
  label: string;
  actionType: ActionType;
  actionData: Record<string, any>;
}

type ActionType = 'apply-filter' | 'modify-search' | 'external-link';

interface AvailabilityStatus {
  isAvailable: boolean;
  roomId: string;
  dates: DateRange;
  pricing?: DynamicPricing;
  restrictions?: AvailabilityRestriction[];
  alternatives?: AvailabilityAlternative[];
}

interface DynamicPricing {
  baseRate: number;
  dynamicRate: number;
  totalCost: number;
  breakdown: PricingBreakdown;
  currency: string;
}

interface AvailabilityRestriction {
  type: RestrictionType;
  description: string;
  impact: RestrictionImpact;
}

type RestrictionType = 'minimum-stay' | 'maximum-stay' | 'advance-booking' | 'seasonal-closure';
type RestrictionImpact = 'blocking' | 'warning' | 'fee-applicable';

interface AvailabilityAlternative {
  type: AlternativeType;
  suggestion: string;
  roomId?: string;
  dates?: DateRange;
  estimatedPrice?: number;
}

type AlternativeType = 'similar-room' | 'alternative-dates' | 'longer-stay' | 'shorter-stay';

interface AvailabilityCalendar {
  roomId: string;
  calendar: CalendarMonth[];
  priceRange: PriceRange;
  availabilityStats: AvailabilityStats;
}

interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}

interface CalendarDay {
  date: Date;
  isAvailable: boolean;
  price?: number;
  minimumStay?: number;
  hasRestrictions: boolean;
  isHighDemand: boolean;
}

interface AvailabilityStats {
  totalDaysShown: number;
  availableDays: number;
  averagePrice: number;
  highDemandDays: number;
  blackoutDays: number;
}

interface RoomComparison {
  rooms: Room[];
  comparisonMatrix: ComparisonFeature[];
  recommendations: ComparisonRecommendation[];
}

interface ComparisonFeature {
  category: FeatureCategory;
  feature: string;
  roomValues: Record<string, string | number | boolean>;
  importance: ImportanceLevel;
}

type ImportanceLevel = 'high' | 'medium' | 'low';

interface ComparisonRecommendation {
  roomId: string;
  reason: RecommendationReason;
  description: string;
  score: number;
}

type RecommendationReason = 'best-value' | 'most-features' | 'guest-preference' | 'popular-choice';
```

## Package Service Contracts

```typescript
interface PackageServiceInterface {
  // Package retrieval operations
  getAllPackages(filters?: PackageFilters): Promise<ServiceResponse<Package[]>>;
  getPackageById(packageId: string): Promise<ServiceResponse<Package>>;
  getPackagesByType(packageType: PackageType): Promise<ServiceResponse<Package[]>>;
  getFeaturedPackages(limit?: number): Promise<ServiceResponse<Package[]>>;
  
  // Package compatibility and recommendations
  getCompatiblePackages(roomType: RoomType, dates: DateRange): Promise<ServiceResponse<Package[]>>;
  getRecommendedPackages(bookingContext: BookingContext): Promise<ServiceResponse<PackageRecommendation[]>>;
  
  // Package pricing and availability
  checkPackageAvailability(packageId: string, dates: DateRange): Promise<ServiceResponse<PackageAvailabilityStatus>>;
  calculatePackagePrice(packageId: string, context: PricingContext): Promise<ServiceResponse<PackagePricing>>;
}

interface PackageFilters {
  types?: PackageType[];
  priceRange?: PriceRange;
  isPerPerson?: boolean;
  minimumStay?: number;
  availableOn?: Date;
  includes?: InclusionType[];
}

interface BookingContext {
  roomType: RoomType;
  dates: DateRange;
  occupancy: RoomCapacity;
  guestPreferences?: GuestPreferences;
  totalBookingValue?: number;
}

interface PackageRecommendation {
  package: Package;
  relevanceScore: number;
  matchingReasons: RecommendationReason[];
  estimatedSavings?: number;
  popularityRank: number;
}

interface PackageAvailabilityStatus {
  isAvailable: boolean;
  packageId: string;
  dates: DateRange;
  occupancyImpact: OccupancyImpact;
  restrictions: PackageRestriction[];
  requiresAdvanceBooking: boolean;
  cancellationPolicy: string;
}

interface OccupancyImpact {
  affectsCapacity: boolean;
  capacityChange?: number;
  requiresSeparateRoom: boolean;
  additionalGuestFees?: number;
}

interface PackageRestriction {
  type: PackageRestrictionType;
  description: string;
  workaround?: string;
}

type PackageRestrictionType = 
  | 'age-requirement'
  | 'room-type-incompatible' 
  | 'minimum-stay'
  | 'seasonal-unavailable'
  | 'advance-booking-required'
  | 'group-size-limit';

interface PricingContext {
  dates: DateRange;
  occupancy: RoomCapacity;
  roomType: RoomType;
  isRepeatGuest?: boolean;
  groupSize?: number;
  bookingValue?: number;
}
```

## Amenity Service Contracts

```typescript
interface AmenityServiceInterface {
  // Amenity retrieval operations
  getAllAmenities(filters?: AmenityFilters): Promise<ServiceResponse<Amenity[]>>;
  getAmenityById(amenityId: string): Promise<ServiceResponse<Amenity>>;
  getAmenitiesByCategory(category: AmenityCategory): Promise<ServiceResponse<Amenity[]>>;
  getFeaturedAmenities(): Promise<ServiceResponse<Amenity[]>>;
  
  // Amenity availability and booking
  checkAmenityAvailability(amenityId: string, dateTime: Date): Promise<ServiceResponse<AmenityAvailabilityStatus>>;
  getAmenitySchedule(amenityId: string, dateRange: DateRange): Promise<ServiceResponse<AmenitySchedule>>;
  
  // Amenity recommendations and search
  getNearbyAmenities(location: AmenityLocation, radius?: number): Promise<ServiceResponse<Amenity[]>>;
  searchAmenities(query: string, filters?: AmenityFilters): Promise<ServiceResponse<AmenitySearchResult>>;
}

interface AmenityFilters {
  categories?: AmenityCategory[];
  isComplimentary?: boolean;
  isCurrentlyOpen?: boolean;
  requiresReservation?: boolean;
  isAccessible?: boolean;
  hasAgeRestrictions?: boolean;
}

interface AmenityAvailabilityStatus {
  isCurrentlyAvailable: boolean;
  amenityId: string;
  currentCapacity?: CapacityInfo;
  nextAvailableTime?: Date;
  operatingHours: TodayOperatingHours;
  specialEvents: AmenityEvent[];
  maintenanceSchedule: MaintenanceWindow[];
}

interface CapacityInfo {
  maximum: number;
  current: number;
  waitTime?: number;
  reservationAvailable: boolean;
}

interface TodayOperatingHours {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breaks: TimeBreak[];
  specialNotes?: string;
}

interface AmenityEvent {
  name: string;
  startTime: Date;
  endTime: Date;
  impactLevel: EventImpact;
  description?: string;
  alternativeAccess?: string;
}

interface MaintenanceWindow {
  startTime: Date;
  endTime: Date;
  type: MaintenanceType;
  impactDescription: string;
  alternatives?: string[];
}

interface AmenitySchedule {
  amenityId: string;
  dateRange: DateRange;
  dailySchedules: DailyAmenitySchedule[];
  recurringEvents: RecurringAmenityEvent[];
  holidaySchedules: HolidaySchedule[];
}

interface DailyAmenitySchedule {
  date: Date;
  hours: DayHours;
  specialEvents: AmenityEvent[];
  capacity: DailyCapacity;
  reservationSlots?: TimeSlot[];
}

interface DailyCapacity {
  maximum: number;
  projected: number[];  // Hourly projections
  reservedSlots: ReservedSlot[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  availableCapacity: number;
  price?: number;
}

interface ReservedSlot {
  startTime: string;
  endTime: string;
  reservedCapacity: number;
  eventType: string;
}

interface RecurringAmenityEvent {
  name: string;
  description: string;
  frequency: EventFrequency;
  duration: number; // minutes
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  isGuestExclusive: boolean;
}

type EventFrequency = 'daily' | 'weekly' | 'monthly' | 'seasonal';

interface HolidaySchedule {
  holidayName: string;
  date: Date;
  specialHours?: DayHours;
  specialEvents?: AmenityEvent[];
  isClosed: boolean;
}

interface AmenitySearchResult {
  amenities: Amenity[];
  totalCount: number;
  categories: CategoryCount[];
  suggestions: SearchSuggestion[];
  filters: AmenityFilters;
}

interface CategoryCount {
  category: AmenityCategory;
  count: number;
  subcategories?: SubcategoryCount[];
}

interface SubcategoryCount {
  name: string;
  count: number;
}
```

## Booking Service Contracts

```typescript
interface BookingServiceInterface {
  // Booking creation and management
  createBookingDraft(initialData?: Partial<Booking>): Promise<ServiceResponse<Booking>>;
  updateBookingDraft(bookingId: string, updates: Partial<Booking>): Promise<ServiceResponse<Booking>>;
  getBookingDraft(bookingId: string): Promise<ServiceResponse<Booking>>;
  deleteBookingDraft(bookingId: string): Promise<ServiceResponse<void>>;
  
  // Booking submission and confirmation
  submitBooking(booking: Booking): Promise<ServiceResponse<BookingConfirmation>>;
  validateBooking(booking: Booking): Promise<ServiceResponse<BookingValidation>>;
  
  // Booking retrieval and history
  getBookingByConfirmation(confirmationNumber: string): Promise<ServiceResponse<Booking>>;
  getBookingHistory(guestId?: string): Promise<ServiceResponse<BookingSummary[]>>;
  
  // Booking modifications
  modifyBooking(bookingId: string, modifications: BookingModification): Promise<ServiceResponse<ModificationResult>>;
  cancelBooking(bookingId: string, reason?: string): Promise<ServiceResponse<CancellationResult>>;
}

interface BookingConfirmation {
  booking: Booking;
  confirmationNumber: string;
  paymentStatus: PaymentStatus;
  emailSent: boolean;
  checkInInstructions: CheckInInstructions;
  policies: ApplicablePolicies;
  supportContact: ContactInformation;
}

interface CheckInInstructions {
  earliestCheckIn: Date;
  latestCheckIn: Date;
  checkInLocation: string;
  requiredDocuments: RequiredDocument[];
  specialInstructions?: string[];
  contactForEarlyCheckIn?: ContactInformation;
}

interface RequiredDocument {
  type: DocumentType;
  description: string;
  isRequired: boolean;
  alternatives?: string[];
}

type DocumentType = 'government-id' | 'credit-card' | 'passport' | 'drivers-license' | 'booking-confirmation';

interface ApplicablePolicies {
  cancellationPolicy: PolicyDetails;
  modificationPolicy: PolicyDetails;
  noShowPolicy: PolicyDetails;
  checkInPolicy: PolicyDetails;
  checkOutPolicy: PolicyDetails;
}

interface PolicyDetails {
  title: string;
  description: string;
  keyPoints: string[];
  deadlines?: PolicyDeadline[];
  fees?: PolicyFee[];
}

interface PolicyDeadline {
  description: string;
  hoursBeforeCheckIn: number;
  feePercentage?: number;
  feeAmount?: number;
}

interface PolicyFee {
  type: string;
  amount: number;
  isPercentage: boolean;
  applicableWhen: string;
}

interface BookingValidation {
  isValid: boolean;
  errors: BookingValidationError[];
  warnings: BookingValidationWarning[];
  estimatedPrice: BookingPricing;
  availabilityConfirmed: boolean;
  requiresApproval: boolean;
}

interface BookingValidationError {
  field: string;
  code: ValidationErrorCode;
  message: string;
  severity: ErrorSeverity;
  suggestions?: string[];
}

type ValidationErrorCode = 
  | 'REQUIRED_FIELD'
  | 'INVALID_FORMAT'
  | 'ROOM_UNAVAILABLE'
  | 'PACKAGE_INCOMPATIBLE'
  | 'OCCUPANCY_EXCEEDED'
  | 'MINIMUM_STAY_NOT_MET'
  | 'ADVANCE_BOOKING_REQUIRED'
  | 'PAYMENT_INVALID';

type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

interface BookingValidationWarning {
  field?: string;
  message: string;
  type: WarningType;
  recommendation?: string;
}

type WarningType = 
  | 'PRICE_INCREASE'
  | 'LIMITED_AVAILABILITY'
  | 'POLICY_CHANGE'
  | 'SEASONAL_RESTRICTION'
  | 'ALTERNATIVE_AVAILABLE';
```

## Availability Service Contracts

```typescript
interface AvailabilityServiceInterface {
  // Real-time availability checking
  checkRealTimeAvailability(criteria: AvailabilityQuery): Promise<ServiceResponse<AvailabilityResult>>;
  getRoomAvailabilityMatrix(dateRange: DateRange): Promise<ServiceResponse<AvailabilityMatrix>>;
  
  // Inventory and capacity management
  getRoomInventory(date?: Date): Promise<ServiceResponse<RoomInventory>>;
  getOccupancyForecast(dateRange: DateRange): Promise<ServiceResponse<OccupancyForecast>>;
  
  // Availability optimization
  suggestAlternativeDates(originalDates: DateRange, flexibility: DateFlexibility): Promise<ServiceResponse<DateSuggestion[]>>;
  findBestAvailability(preferences: AvailabilityPreferences): Promise<ServiceResponse<AvailabilityRecommendation[]>>;
}

interface AvailabilityQuery {
  checkIn: Date;
  checkOut: Date;
  occupancy: RoomCapacity;
  roomTypes?: RoomType[];
  packages?: string[];
  flexibleDates?: DateFlexibility;
}

interface DateFlexibility {
  checkInFlex: number;     // Days before/after check-in
  checkOutFlex: number;    // Days before/after check-out
  stayLengthFlex: number;  // Nights shorter/longer
  preferredDirection?: FlexDirection;
}

type FlexDirection = 'earlier' | 'later' | 'shorter' | 'longer' | 'any';

interface AvailabilityResult {
  query: AvailabilityQuery;
  availableRooms: AvailableRoomOption[];
  unavailableRooms: UnavailableRoomInfo[];
  alternativeSuggestions: AvailabilityAlternative[];
  totalResults: number;
}

interface AvailableRoomOption {
  room: Room;
  pricing: DynamicPricing;
  availabilityLevel: AvailabilityLevel;
  restrictions?: AvailabilityRestriction[];
  recommendationScore: number;
  lastUpdated: Date;
}

type AvailabilityLevel = 'high' | 'medium' | 'low' | 'last-room';

interface UnavailableRoomInfo {
  room: Room;
  unavailabilityReason: UnavailabilityReason;
  nextAvailableDate?: Date;
  conflictingDates: Date[];
}

type UnavailabilityReason = 
  | 'fully-booked'
  | 'maintenance'
  | 'seasonal-closure'
  | 'minimum-stay-not-met'
  | 'advance-booking-required'
  | 'room-type-unavailable';

interface AvailabilityMatrix {
  dateRange: DateRange;
  roomAvailability: RoomAvailabilityRow[];
  occupancyLevels: DailyOccupancy[];
  demandIndicators: DemandIndicator[];
}

interface RoomAvailabilityRow {
  roomId: string;
  roomType: RoomType;
  dailyAvailability: DailyAvailabilityStatus[];
  averageRate: number;
  totalAvailableDays: number;
}

interface DailyAvailabilityStatus {
  date: Date;
  isAvailable: boolean;
  rate?: number;
  availabilityLevel: AvailabilityLevel;
  restrictions?: string[];
}

interface DailyOccupancy {
  date: Date;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  demandLevel: DemandLevel;
}

type DemandLevel = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';

interface DemandIndicator {
  date: Date;
  demandLevel: DemandLevel;
  factors: DemandFactor[];
  priceImpact: PriceImpact;
}

interface DemandFactor {
  type: DemandFactorType;
  description: string;
  impact: ImpactLevel;
}

type DemandFactorType = 
  | 'holiday'
  | 'local-event'
  | 'weather'
  | 'convention'
  | 'seasonal-pattern'
  | 'special-promotion';

interface PriceImpact {
  multiplier: number;
  description: string;
  appliesTo: RoomType[];
}

interface RoomInventory {
  date: Date;
  roomTypeInventory: RoomTypeInventory[];
  totalCapacity: InventoryCapacity;
  maintenanceSchedule: MaintenanceEvent[];
}

interface RoomTypeInventory {
  roomType: RoomType;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  outOfOrderRooms: number;
}

interface InventoryCapacity {
  totalRooms: number;
  sellableRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
}

interface OccupancyForecast {
  dateRange: DateRange;
  forecastData: DailyForecast[];
  trends: ForecastTrend[];
  confidence: ForecastConfidence;
}

interface DailyForecast {
  date: Date;
  predictedOccupancy: number;
  confidenceLevel: number;
  demandDrivers: DemandFactor[];
  recommendedPricing: PricingRecommendation;
}

interface ForecastTrend {
  type: TrendType;
  direction: TrendDirection;
  strength: TrendStrength;
  description: string;
  timeframe: string;
}

type TrendType = 'occupancy' | 'demand' | 'pricing' | 'booking-velocity';
type TrendDirection = 'increasing' | 'decreasing' | 'stable';
type TrendStrength = 'weak' | 'moderate' | 'strong';

interface ForecastConfidence {
  overall: number;
  factors: ConfidenceFactor[];
  dataQuality: DataQualityIndicator[];
}

interface ConfidenceFactor {
  factor: string;
  impact: number;
  description: string;
}

interface DataQualityIndicator {
  metric: string;
  quality: QualityLevel;
  description: string;
}

type QualityLevel = 'excellent' | 'good' | 'fair' | 'poor';

interface DateSuggestion {
  suggestedCheckIn: Date;
  suggestedCheckOut: Date;
  nights: number;
  availableRooms: number;
  averagePrice: number;
  savingsVsOriginal?: number;
  flexibilityUsed: FlexibilityUsed;
}

interface FlexibilityUsed {
  checkInDaysChanged: number;
  checkOutDaysChanged: number;
  stayLengthChanged: number;
  direction: FlexDirection;
}

interface AvailabilityPreferences {
  priorityFactors: PriorityFactor[];
  budgetRange?: PriceRange;
  dateFlexibility: DateFlexibility;
  roomTypePreferences: RoomTypePreference[];
  amenityRequirements: string[];
}

interface PriorityFactor {
  factor: PreferenceFactor;
  importance: ImportanceLevel;
  weight: number;
}

type PreferenceFactor = 'price' | 'availability' | 'room-type' | 'dates' | 'amenities' | 'location';

interface RoomTypePreference {
  roomType: RoomType;
  preference: PreferenceLevel;
}

type PreferenceLevel = 'required' | 'preferred' | 'acceptable' | 'avoid';

interface AvailabilityRecommendation {
  recommendation: AvailabilityResult;
  score: number;
  matchingFactors: MatchingFactor[];
  tradeoffs: Tradeoff[];
}

interface MatchingFactor {
  factor: PreferenceFactor;
  matchLevel: MatchLevel;
  description: string;
}

type MatchLevel = 'perfect' | 'good' | 'acceptable' | 'poor';

interface Tradeoff {
  aspect: PreferenceFactor;
  compromise: string;
  benefit: string;
  impact: ImpactLevel;
}
```

## Pricing Service Contracts

```typescript
interface PricingServiceInterface {
  // Dynamic pricing calculations
  calculateRoomPrice(roomId: string, context: PricingContext): Promise<ServiceResponse<DynamicPricing>>;
  calculatePackagePrice(packageId: string, context: PricingContext): Promise<ServiceResponse<PackagePricing>>;
  calculateTotalBookingPrice(booking: Partial<Booking>): Promise<ServiceResponse<BookingPricing>>;
  
  // Pricing analysis and optimization
  getPriceHistory(roomId: string, dateRange: DateRange): Promise<ServiceResponse<PriceHistory>>;
  getCompetitivePricing(roomType: RoomType, date: Date): Promise<ServiceResponse<MarketPricing>>;
  getOptimalPricing(criteria: PricingCriteria): Promise<ServiceResponse<PricingRecommendation>>;
  
  // Discounts and promotions
  getApplicableDiscounts(context: DiscountContext): Promise<ServiceResponse<AvailableDiscount[]>>;
  applyPromoCode(code: string, booking: Partial<Booking>): Promise<ServiceResponse<PromoCodeResult>>;
  validateCorporateRate(corporateId: string, roomId: string): Promise<ServiceResponse<CorporateRateInfo>>;
}

interface PriceHistory {
  roomId: string;
  dateRange: DateRange;
  pricePoints: HistoricalPricePoint[];
  trends: PriceTrend[];
  seasonalPatterns: SeasonalPattern[];
}

interface HistoricalPricePoint {
  date: Date;
  baseRate: number;
  finalRate: number;
  occupancyRate: number;
  demandLevel: DemandLevel;
  specialEvents?: string[];
}

interface PriceTrend {
  period: string;
  averageIncrease: number;
  volatility: number;
  predictability: number;
  drivingFactors: string[];
}

interface SeasonalPattern {
  season: string;
  startDate: Date;
  endDate: Date;
  averagePremium: number;
  consistency: number;
  description: string;
}

interface MarketPricing {
  roomType: RoomType;
  date: Date;
  marketData: CompetitorPricing[];
  positionAnalysis: MarketPosition;
  pricingOpportunity: PricingOpportunity;
}

interface CompetitorPricing {
  competitorName: string;
  roomType: string;
  price: number;
  amenitiesIncluded: string[];
  cancellationPolicy: string;
  marketSegment: MarketSegment;
}

type MarketSegment = 'luxury' | 'upscale' | 'midscale' | 'economy' | 'budget';

interface MarketPosition {
  percentile: number;
  position: PositionType;
  priceGap: number;
  valueProposition: string[];
  competitiveAdvantages: string[];
}

type PositionType = 'premium' | 'competitive' | 'value' | 'discount';

interface PricingOpportunity {
  recommendedAdjustment: number;
  justification: string;
  expectedImpact: ImpactForecast;
  riskLevel: RiskLevel;
}

interface ImpactForecast {
  occupancyChange: number;
  revenueChange: number;
  marketShareChange: number;
  confidence: number;
}

type RiskLevel = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';

interface PricingCriteria {
  roomTypes: RoomType[];
  dateRange: DateRange;
  targetOccupancy?: number;
  targetRevenue?: number;
  competitivePosition?: PositionType;
  marketConditions?: MarketCondition[];
}

interface MarketCondition {
  type: ConditionType;
  severity: ConditionSeverity;
  duration: string;
  description: string;
}

type ConditionType = 
  | 'economic-downturn'
  | 'high-demand-period'
  | 'competitor-expansion'
  | 'seasonal-shift'
  | 'event-impact';

type ConditionSeverity = 'minor' | 'moderate' | 'significant' | 'severe';

interface PricingRecommendation {
  roomTypePricing: RoomTypePricing[];
  overallStrategy: PricingStrategy;
  expectedOutcomes: PricingOutcome[];
  implementationPlan: ImplementationStep[];
}

interface RoomTypePricing {
  roomType: RoomType;
  currentPrice: number;
  recommendedPrice: number;
  adjustment: number;
  justification: string;
  confidence: number;
}

interface PricingStrategy {
  name: string;
  description: string;
  keyPrinciples: string[];
  timeHorizon: string;
  reviewFrequency: string;
}

interface PricingOutcome {
  metric: string;
  currentValue: number;
  projectedValue: number;
  improvement: number;
  timeframe: string;
}

interface ImplementationStep {
  step: number;
  action: string;
  timeline: string;
  owner: string;
  prerequisites?: string[];
}

interface DiscountContext {
  booking: Partial<Booking>;
  guestHistory?: BookingSummary[];
  membershipLevel?: MembershipLevel;
  corporateAgreement?: string;
  seasonalPromotions?: boolean;
}

type MembershipLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

interface AvailableDiscount {
  discountId: string;
  name: string;
  description: string;
  type: DiscountType;
  amount: number;
  isPercentage: boolean;
  applicableTo: DiscountTarget;
  eligibilityRules: EligibilityRule[];
  restrictions: DiscountRestriction[];
  validUntil?: Date;
  stackable: boolean;
}

interface EligibilityRule {
  rule: string;
  description: string;
  isMet: boolean;
  requirement?: string;
}

interface DiscountRestriction {
  type: RestrictionType;
  description: string;
  impactsBooking: boolean;
}

interface PromoCodeResult {
  isValid: boolean;
  discount?: AvailableDiscount;
  appliedAmount?: number;
  newPricing?: BookingPricing;
  error?: string;
  restrictions?: string[];
}

interface CorporateRateInfo {
  isValid: boolean;
  corporateName?: string;
  discountPercentage?: number;
  specialAmenities?: string[];
  bookingRequirements?: string[];
  contactInfo?: ContactInformation;
}
```

## Mock Data Implementation

```typescript
// Mock service implementation structure
class MockRoomService implements RoomServiceInterface {
  private static readonly MOCK_DELAY = 100; // Simulate network delay
  private mockData: Room[] = MOCK_ROOMS_DATA;
  
  async getAllRooms(filters?: RoomFilters): Promise<ServiceResponse<Room[]>> {
    await this.simulateDelay();
    
    try {
      let filteredRooms = this.mockData;
      
      if (filters) {
        filteredRooms = this.applyFilters(filteredRooms, filters);
      }
      
      return {
        success: true,
        data: filteredRooms,
        metadata: {
          requestId: this.generateRequestId(),
          timestamp: new Date(),
          executionTime: MockRoomService.MOCK_DELAY,
          source: 'mock'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => 
      setTimeout(resolve, MockRoomService.MOCK_DELAY)
    );
  }
  
  private applyFilters(rooms: Room[], filters: RoomFilters): Room[] {
    // Filter implementation logic
    return rooms.filter(room => {
      if (filters.roomTypes && !filters.roomTypes.includes(room.type)) {
        return false;
      }
      
      if (filters.priceRange) {
        const roomPrice = room.pricing.baseRate;
        if (roomPrice < filters.priceRange.minimum || 
            roomPrice > filters.priceRange.maximum) {
          return false;
        }
      }
      
      if (filters.capacity) {
        if (room.capacity.total < filters.capacity.total) {
          return false;
        }
      }
      
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          room.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  private generateRequestId(): string {
    return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private handleError(error: any): ServiceResponse<any> {
    return {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred',
        details: { originalError: error },
        timestamp: new Date()
      }
    };
  }
  
  // Implement other interface methods...
}

// Similar mock implementations for other services
class MockPackageService implements PackageServiceInterface { /* ... */ }
class MockAmenityService implements AmenityServiceInterface { /* ... */ }
class MockBookingService implements BookingServiceInterface { /* ... */ }
class MockAvailabilityService implements AvailabilityServiceInterface { /* ... */ }
class MockPricingService implements PricingServiceInterface { /* ... */ }
```

## Service Integration Layer

```typescript
// Service factory for switching between mock and real implementations
class ServiceFactory {
  private static instance: ServiceFactory;
  private configuration: ServiceConfiguration;
  
  private constructor() {
    this.configuration = this.loadConfiguration();
  }
  
  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }
  
  getHotelServices(): HotelServices {
    return {
      roomService: this.getRoomService(),
      packageService: this.getPackageService(),
      amenityService: this.getAmenityService(),
      bookingService: this.getBookingService(),
      availabilityService: this.getAvailabilityService(),
      pricingService: this.getPricingService()
    };
  }
  
  private getRoomService(): RoomServiceInterface {
    switch (this.configuration.roomService.type) {
      case 'mock':
        return new MockRoomService();
      case 'api':
        return new ApiRoomService(this.configuration.roomService.config);
      default:
        return new MockRoomService();
    }
  }
  
  // Similar factory methods for other services...
  
  private loadConfiguration(): ServiceConfiguration {
    // Load from environment variables or config file
    return {
      roomService: { type: 'mock', config: {} },
      packageService: { type: 'mock', config: {} },
      amenityService: { type: 'mock', config: {} },
      bookingService: { type: 'mock', config: {} },
      availabilityService: { type: 'mock', config: {} },
      pricingService: { type: 'mock', config: {} }
    };
  }
}

interface ServiceConfiguration {
  roomService: ServiceConfig;
  packageService: ServiceConfig;
  amenityService: ServiceConfig;
  bookingService: ServiceConfig;
  availabilityService: ServiceConfig;
  pricingService: ServiceConfig;
}

interface ServiceConfig {
  type: 'mock' | 'api' | 'hybrid';
  config: Record<string, any>;
}
```

## Contract Test Framework

```typescript
// Contract testing for service implementations
abstract class ServiceContractTest<T> {
  protected service: T;
  
  constructor(service: T) {
    this.service = service;
  }
  
  abstract runContractTests(): Promise<ContractTestResult[]>;
  
  protected async testResponseFormat<U>(
    operation: string,
    serviceCall: () => Promise<ServiceResponse<U>>,
    expectedDataShape: (data: U) => boolean
  ): Promise<ContractTestResult> {
    try {
      const response = await serviceCall();
      
      // Test response structure
      const hasRequiredFields = 
        typeof response.success === 'boolean' &&
        (response.data !== undefined || response.error !== undefined);
      
      if (!hasRequiredFields) {
        return {
          operation,
          passed: false,
          error: 'Response missing required fields (success, data/error)'
        };
      }
      
      // Test data shape if successful
      if (response.success && response.data) {
        const dataShapeValid = expectedDataShape(response.data);
        if (!dataShapeValid) {
          return {
            operation,
            passed: false,
            error: 'Response data does not match expected shape'
          };
        }
      }
      
      return {
        operation,
        passed: true,
        executionTime: response.metadata?.executionTime
      };
      
    } catch (error) {
      return {
        operation,
        passed: false,
        error: `Exception thrown: ${error.message}`
      };
    }
  }
}

interface ContractTestResult {
  operation: string;
  passed: boolean;
  error?: string;
  executionTime?: number;
}

// Example contract test for Room Service
class RoomServiceContractTest extends ServiceContractTest<RoomServiceInterface> {
  async runContractTests(): Promise<ContractTestResult[]> {
    const results: ContractTestResult[] = [];
    
    // Test getAllRooms contract
    results.push(await this.testResponseFormat(
      'getAllRooms',
      () => this.service.getAllRooms(),
      (data: Room[]) => Array.isArray(data) && 
        (data.length === 0 || this.isValidRoom(data[0]))
    ));
    
    // Test getRoomById contract
    results.push(await this.testResponseFormat(
      'getRoomById',
      () => this.service.getRoomById('test-room-id'),
      (data: Room) => this.isValidRoom(data)
    ));
    
    // Add more contract tests...
    
    return results;
  }
  
  private isValidRoom(room: Room): boolean {
    return typeof room.id === 'string' &&
           typeof room.name === 'string' &&
           typeof room.type === 'string' &&
           typeof room.capacity === 'object' &&
           Array.isArray(room.amenities) &&
           typeof room.pricing === 'object';
  }
}
```

## Summary

This comprehensive contract system provides:

✅ **Type-Safe Interfaces**: All service methods fully typed with TypeScript  
✅ **Mock Implementation Ready**: Complete mock service structure for development  
✅ **Future API Integration**: Clean abstraction for backend integration  
✅ **Error Handling**: Consistent error response patterns  
✅ **Testing Framework**: Contract tests ensure implementation compliance  
✅ **Performance Monitoring**: Built-in execution time tracking  
✅ **Constitutional Compliance**: Minimal dependencies, component-focused design

**Ready for Implementation**: ✅ All contracts defined and testable  
**Supports User Requirements**: ✅ Vite + React + CSS architecture with mock data