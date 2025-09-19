# GitHub Copilot Instructions: Hotel Website Development

## Project Overview
**Project**: Hotel Website with Booking System  
**Tech Stack**: Vite + React 18 + TypeScript + CSS Modules  
**Architecture**: Frontend SPA with mock data, progressive enhancement ready for backend integration  
**Constitutional Requirements**: Minimal dependencies, performance-first, accessibility-compliant

## Code Style and Patterns

### TypeScript Usage
- **Strict Mode**: Always use TypeScript strict mode with explicit types
- **Interface Definitions**: Prefer interfaces over types for object shapes
- **Generic Constraints**: Use generic constraints for reusable components
- **Utility Types**: Leverage TypeScript utility types (Partial, Pick, Omit)

```typescript
// Preferred pattern for component props
interface RoomCardProps {
  room: Room;
  onSelect?: (roomId: string) => void;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

// Use generic constraints for flexible components
interface ListProps<T extends { id: string }> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor?: (item: T) => string;
}
```

### React Component Patterns
- **Functional Components**: Use functional components with hooks exclusively
- **Custom Hooks**: Extract complex logic into custom hooks for reusability
- **Context Usage**: Use React Context sparingly, prefer prop drilling for simple cases
- **Component Composition**: Favor composition over inheritance patterns

```typescript
// Preferred component structure
export function RoomCard({ room, onSelect, variant = 'default', className }: RoomCardProps) {
  const handleSelect = useCallback(() => {
    onSelect?.(room.id);
  }, [room.id, onSelect]);

  return (
    <article 
      className={`${styles.roomCard} ${styles[variant]} ${className}`}
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
    >
      <RoomImage src={room.images[0]?.url} alt={room.name} />
      <RoomDetails room={room} />
      <RoomPricing pricing={room.pricing} />
    </article>
  );
}

// Custom hook pattern
export function useRoomFilters(initialFilters: RoomFilters = {}) {
  const [filters, setFilters] = useState<RoomFilters>(initialFilters);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  const applyFilters = useCallback((rooms: Room[]) => {
    const filtered = rooms.filter(room => matchesFilters(room, filters));
    setFilteredRooms(filtered);
  }, [filters]);

  return { filters, setFilters, filteredRooms, applyFilters };
}
```

### CSS and Styling
- **CSS Modules**: Use CSS modules for component-scoped styles
- **BEM Methodology**: Follow BEM naming convention within CSS modules
- **CSS Custom Properties**: Use CSS variables for theming and consistency
- **Mobile-First**: Always write mobile-first responsive styles

```css
/* Component CSS module structure */
.roomCard {
  display: flex;
  flex-direction: column;
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
}

.roomCard:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.roomCard--featured {
  border: 2px solid var(--color-primary);
}

.roomCard--compact {
  flex-direction: row;
}

/* Mobile-first responsive design */
@media (min-width: 768px) {
  .roomCard {
    flex-direction: row;
    max-width: 600px;
  }
}

@media (min-width: 1024px) {
  .roomCard {
    max-width: 800px;
  }
}
```

### State Management
- **Local State**: Use useState for component-local state
- **Complex State**: Use useReducer for complex state with multiple actions
- **Global State**: Use React Context only for truly global state (booking, user preferences)
- **Persistence**: Use localStorage with error handling for client-side persistence

```typescript
// Preferred reducer pattern
type BookingAction = 
  | { type: 'UPDATE_GUEST'; payload: Partial<Guest> }
  | { type: 'SELECT_ROOM'; payload: string }
  | { type: 'ADD_PACKAGE'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'UPDATE_GUEST':
      return {
        ...state,
        booking: state.booking ? {
          ...state.booking,
          guest: { ...state.booking.guest, ...action.payload }
        } : null,
        hasUnsavedChanges: true,
      };
    
    case 'SELECT_ROOM':
      return {
        ...state,
        selectedRoomId: action.payload,
        hasUnsavedChanges: true,
      };
    
    default:
      return state;
  }
}
```

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Semantic HTML**: Use proper HTML5 semantic elements
- **ARIA Labels**: Add ARIA labels for complex interactions
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Focus Management**: Implement proper focus management for modals and forms

```typescript
// Accessibility-compliant component example
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={styles.modalContent}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={styles.closeButton}
          >
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Form Accessibility
- **Labels**: Associate all form inputs with labels
- **Validation**: Provide clear, accessible error messages
- **Required Fields**: Mark required fields clearly
- **Instructions**: Provide clear form instructions

```typescript
// Accessible form input component
export function FormField({ 
  label, 
  name, 
  type = 'text', 
  required = false, 
  error, 
  description,
  ...inputProps 
}: FormFieldProps) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className={styles.formField}>
      <label 
        htmlFor={fieldId} 
        className={`${styles.label} ${required ? styles.required : ''}`}
      >
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      
      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
      
      <input
        id={fieldId}
        name={name}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={[description && descriptionId, error && errorId].filter(Boolean).join(' ')}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...inputProps}
      />
      
      {error && (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
```

## Performance Optimization

### Bundle Optimization
- **Code Splitting**: Implement route-based code splitting with React.lazy
- **Tree Shaking**: Import only needed functions from libraries
- **Dynamic Imports**: Use dynamic imports for large components or utilities
- **Image Optimization**: Use responsive images with proper formats

```typescript
// Route-based code splitting
const Home = lazy(() => import('@/pages/Home'));
const Rooms = lazy(() => import('@/pages/Rooms'));
const Booking = lazy(() => import('@/pages/Booking'));

// Proper Suspense usage
function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Optimized image component
export function ResponsiveImage({ 
  src, 
  alt, 
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className 
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      {!isLoaded && <ImagePlaceholder />}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`${styles.image} ${isLoaded ? styles.loaded : styles.loading}`}
      />
      {error && <ImageErrorFallback />}
    </div>
  );
}
```

### React Performance
- **Memoization**: Use React.memo, useMemo, useCallback appropriately
- **Virtual Scrolling**: Implement for large lists (room listings, search results)
- **Debouncing**: Debounce search inputs and API calls
- **State Updates**: Batch state updates when possible

```typescript
// Memoized component for expensive renders
export const RoomList = memo(function RoomList({ 
  rooms, 
  onRoomSelect, 
  filters 
}: RoomListProps) {
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => matchesFilters(room, filters));
  }, [rooms, filters]);

  const handleRoomSelect = useCallback((roomId: string) => {
    onRoomSelect(roomId);
  }, [onRoomSelect]);

  return (
    <div className={styles.roomList} role="list">
      {filteredRooms.map(room => (
        <RoomCard
          key={room.id}
          room={room}
          onSelect={handleRoomSelect}
        />
      ))}
    </div>
  );
});

// Debounced search hook
export function useDebounceSearch(searchTerm: string, delay: number = 300) {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return debouncedTerm;
}
```

## Error Handling

### Error Boundaries
- **Component-Level**: Implement error boundaries for major sections
- **Fallback UI**: Provide meaningful fallback components
- **Error Reporting**: Log errors for debugging and monitoring
- **Recovery**: Allow users to recover from errors when possible

```typescript
// Error boundary implementation
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Integration with error tracking service would go here
    if (process.env.NODE_ENV === 'production') {
      // Sentry, LogRocket, etc.
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Error fallback component
function DefaultErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className={styles.errorFallback} role="alert">
      <h2>Something went wrong</h2>
      <p>We're sorry, but something unexpected happened.</p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className={styles.errorDetails}>
          <summary>Error details (development only)</summary>
          <pre>{error.message}</pre>
        </details>
      )}
      <button 
        type="button" 
        onClick={() => window.location.reload()}
        className={styles.retryButton}
      >
        Retry
      </button>
    </div>
  );
}
```

### API Error Handling
- **Service Layer**: Handle errors consistently in service layer
- **User Messages**: Provide user-friendly error messages
- **Retry Logic**: Implement retry logic for transient failures
- **Offline Handling**: Handle offline scenarios gracefully

```typescript
// Service error handling pattern
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<ServiceResponse<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    
    const serviceError: ServiceError = {
      code: getErrorCode(error),
      message: getUserFriendlyMessage(error),
      details: process.env.NODE_ENV === 'development' ? { originalError: error } : undefined,
      timestamp: new Date(),
      requestId: generateRequestId(),
    };

    return { success: false, error: serviceError };
  }
}

function getUserFriendlyMessage(error: any): string {
  if (error.name === 'NetworkError') {
    return 'Unable to connect to our servers. Please check your internet connection and try again.';
  }
  
  if (error.status === 404) {
    return 'The requested information could not be found.';
  }
  
  if (error.status >= 500) {
    return 'Our servers are experiencing issues. Please try again in a few moments.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}
```

## Testing Patterns

### Unit Testing
- **Testing Library**: Use React Testing Library with user-centric queries
- **Test Structure**: Follow Arrange-Act-Assert pattern
- **Mocking**: Mock external dependencies and services
- **Coverage**: Aim for 80%+ code coverage on business logic

```typescript
// Component testing pattern
describe('RoomCard', () => {
  const mockRoom: Room = {
    id: 'room-1',
    name: 'Deluxe Ocean View',
    type: 'deluxe',
    // ... other room properties
  };

  it('displays room information correctly', () => {
    render(<RoomCard room={mockRoom} />);
    
    expect(screen.getByText('Deluxe Ocean View')).toBeInTheDocument();
    expect(screen.getByText(/deluxe/i)).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const mockOnSelect = vi.fn();
    const user = userEvent.setup();
    
    render(<RoomCard room={mockRoom} onSelect={mockOnSelect} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockRoom.id);
  });

  it('supports keyboard navigation', async () => {
    const mockOnSelect = vi.fn();
    const user = userEvent.setup();
    
    render(<RoomCard room={mockRoom} onSelect={mockOnSelect} />);
    
    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockRoom.id);
  });
});

// Hook testing pattern
describe('useRoomFilters', () => {
  it('filters rooms by type', () => {
    const { result } = renderHook(() => useRoomFilters());
    const mockRooms: Room[] = [/* mock data */];
    
    act(() => {
      result.current.setFilters({ roomTypes: ['deluxe'] });
      result.current.applyFilters(mockRooms);
    });
    
    expect(result.current.filteredRooms).toHaveLength(1);
    expect(result.current.filteredRooms[0].type).toBe('deluxe');
  });
});
```

## File Organization

### Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Input, Modal)
│   ├── Navigation/      # Navigation-specific components
│   ├── RoomCard/       # Room display components
│   └── BookingForm/    # Booking-related components
├── pages/              # Page-level components
│   ├── Home/
│   ├── Rooms/
│   ├── Packages/
│   ├── Amenities/
│   └── Booking/
├── services/           # API and business logic
│   ├── api/           # API service implementations
│   ├── mock/          # Mock data and services
│   └── types/         # Service-related types
├── hooks/             # Custom React hooks
├── context/           # React Context providers
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── styles/            # Global styles and CSS modules
└── test/              # Test utilities and setup
```

### Import Organization
```typescript
// Import order preference
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Room, RoomFilters } from '@/types';
import { useRoomService } from '@/services';
import { useRoomFilters } from '@/hooks';
import { ErrorBoundary } from '@/components/common';
import { RoomCard } from '@/components/RoomCard';

import styles from './Rooms.module.css';
```

## Common Patterns to Avoid

### Anti-Patterns
- **Prop Drilling**: Don't pass props through many levels - use context or composition
- **Massive Components**: Keep components focused and under 200 lines
- **Direct DOM Manipulation**: Avoid direct DOM access - use refs sparingly
- **Inline Styles**: Don't use inline styles - use CSS modules or CSS variables
- **Any Types**: Avoid `any` type - use proper TypeScript types

### Performance Anti-Patterns
- **Unnecessary Re-renders**: Don't create objects/functions in render
- **Missing Dependencies**: Always include all dependencies in useEffect arrays
- **Premature Optimization**: Don't optimize until you have performance problems
- **Large Bundle Size**: Don't import entire libraries for single functions

## Code Quality Standards

### ESLint Rules (Key Focus Areas)
- `@typescript-eslint/no-explicit-any`: Avoid any types
- `react-hooks/exhaustive-deps`: Include all hook dependencies
- `jsx-a11y/*`: Accessibility compliance rules
- `@typescript-eslint/no-unused-vars`: Remove unused variables

### Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] Accessibility attributes present
- [ ] Performance considerations addressed
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] CSS follows mobile-first approach
- [ ] Bundle size impact considered

## Project-Specific Context

### Hotel Domain Knowledge
- **Room Types**: standard, deluxe, suite, penthouse, family
- **Booking Flow**: dates → rooms → packages → guest info → payment → confirmation
- **Package Categories**: romance, family, business, wellness, dining, adventure, seasonal
- **Amenity Categories**: recreation, dining, business, wellness, convenience, entertainment, family

### Business Rules
- Minimum stay requirements may apply to certain room types
- Package compatibility depends on room type and dates
- Pricing is dynamic based on demand and seasonality
- Guest capacity must not exceed room capacity limits
- Booking modifications have time restrictions and fees

### Data Persistence Strategy
- **Local Storage**: Booking drafts, user preferences, search filters
- **Session Storage**: Temporary UI state, current search results
- **Future API**: All persistent data will move to backend database

This comprehensive guide ensures consistent, high-quality code that meets constitutional requirements and provides excellent user experience for the hotel website project.