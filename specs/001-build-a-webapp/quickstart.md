# Hotel Website Quickstart Guide

**Date**: September 18, 2025  
**Feature**: Hotel Website with Booking System  
**Phase**: 1 - Development Setup and Testing Guide

## Prerequisites

### System Requirements
- **Node.js**: v18.0+ (LTS recommended)
- **npm**: v9.0+ or **yarn**: v1.22+
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions listed below

### Required VS Code Extensions
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "bradlc.vscode-css-modules"
  ]
}
```

### Browser Requirements
- **Chrome**: v100+ (development)
- **Firefox**: v95+ (testing)
- **Safari**: v15+ (testing)
- **Edge**: v100+ (testing)

## Project Setup

### 1. Initialize Vite React Project
```bash
# Create new Vite project with React + TypeScript
npm create vite@latest hotel-website -- --template react-ts
cd hotel-website

# Install dependencies
npm install

# Install additional required packages
npm install react-router-dom @types/react-router-dom

# Install development dependencies
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Configure TypeScript
Create or update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/pages/*": ["src/pages/*"],
      "@/services/*": ["src/services/*"],
      "@/types/*": ["src/types/*"],
      "@/styles/*": ["src/styles/*"],
      "@/utils/*": ["src/utils/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/context/*": ["src/context/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Configure Vite
Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/context': path.resolve(__dirname, './src/context')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom']
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  }
})
```

### 4. Setup ESLint and Prettier
Create `.eslintrc.json`:
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "jsx-a11y/anchor-is-valid": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 5. Create Project Directory Structure
```bash
mkdir -p src/{components,pages,services,hooks,context,styles,types,utils,test}
mkdir -p src/components/{Navigation,RoomCard,BookingForm,common}
mkdir -p src/pages/{Home,Rooms,Packages,Amenities,Booking}
mkdir -p src/services/{api,mock}
mkdir -p public/images/{rooms,packages,amenities,common}
```

## Core Implementation

### 1. Setup Global Styles
Create `src/styles/globals.css`:
```css
/* CSS Reset and Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/* CSS Custom Properties */
:root {
  /* Colors */
  --color-primary: #2c5282;
  --color-primary-light: #3182ce;
  --color-primary-dark: #2a4a6b;
  --color-secondary: #ed8936;
  --color-secondary-light: #f6ad55;
  --color-secondary-dark: #c05621;
  
  /* Neutrals */
  --color-white: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  
  /* Typography Scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Font Families */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  
  /* Layout */
  --border-radius-sm: 0.25rem;
  --border-radius: 0.5rem;
  --border-radius-lg: 0.75rem;
  --border-radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
  
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Base Typography */
body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-gray-800);
  background-color: var(--color-white);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-gray-900);
}

h1 { font-size: var(--font-size-4xl); }
h2 { font-size: var(--font-size-3xl); }
h3 { font-size: var(--font-size-2xl); }
h4 { font-size: var(--font-size-xl); }
h5 { font-size: var(--font-size-lg); }
h6 { font-size: var(--font-size-base); }

/* Focus Management */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #000080;
    --color-secondary: #ff6600;
    --shadow: 0 2px 4px 0 rgb(0 0 0 / 0.3);
    --shadow-md: 0 6px 8px -1px rgb(0 0 0 / 0.3);
  }
}

/* Print Styles */
@media print {
  * {
    background: transparent !important;
    color: black !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  
  a, a:visited {
    text-decoration: underline;
  }
  
  img {
    max-width: 100% !important;
  }
  
  @page {
    margin: 0.5cm;
  }
}
```

### 2. Setup TypeScript Types
Create `src/types/index.ts`:
```typescript
// Re-export all types from data model
export * from './room';
export * from './booking';
export * from './package';
export * from './amenity';
export * from './guest';
export * from './api';
export * from './ui';

// Common utility types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  metadata?: ResponseMetadata;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: Date;
  executionTime: number;
  source: 'mock' | 'localStorage' | 'api' | 'cache';
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

### 3. Create Context Providers
Create `src/context/BookingContext.tsx`:
```typescript
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Booking, BookingStatus } from '@/types';

interface BookingContextType {
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  actions: {
    createBooking: () => void;
    updateGuest: (guestInfo: Partial<Guest>) => void;
    selectRoom: (roomId: string) => void;
    updateDates: (checkIn: Date, checkOut: Date) => void;
    addPackage: (packageId: string) => void;
    removePackage: (packageId: string) => void;
    saveBookingDraft: () => void;
    loadBookingDraft: () => void;
    clearBooking: () => void;
    submitBooking: () => Promise<void>;
  };
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

type BookingAction = 
  | { type: 'CREATE_BOOKING' }
  | { type: 'UPDATE_GUEST'; payload: Partial<Guest> }
  | { type: 'SELECT_ROOM'; payload: string }
  | { type: 'UPDATE_DATES'; payload: { checkIn: Date; checkOut: Date } }
  | { type: 'ADD_PACKAGE'; payload: string }
  | { type: 'REMOVE_PACKAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SAVE_DRAFT' }
  | { type: 'LOAD_DRAFT'; payload: Booking }
  | { type: 'CLEAR_BOOKING' }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean };

interface BookingState {
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

const initialState: BookingState = {
  currentBooking: null,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'CREATE_BOOKING':
      return {
        ...state,
        currentBooking: createEmptyBooking(),
        hasUnsavedChanges: false,
        error: null,
      };
    
    case 'UPDATE_GUEST':
      if (!state.currentBooking) return state;
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          guest: { ...state.currentBooking.guest, ...action.payload },
        },
        hasUnsavedChanges: true,
      };
    
    // Add other cases...
    
    default:
      return state;
  }
}

function createEmptyBooking(): Booking {
  return {
    id: crypto.randomUUID(),
    confirmationNumber: '',
    status: 'draft' as BookingStatus,
    guest: {} as Guest,
    room: {} as BookingRoom,
    stay: {} as StayDetails,
    occupancy: { adults: 2, children: 0, total: 2 },
    packages: [],
    pricing: {} as BookingPricing,
    payment: { status: 'pending' as PaymentStatus },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'website',
    },
  };
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  
  // Auto-save functionality
  useEffect(() => {
    if (state.hasUnsavedChanges && state.currentBooking) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(state.currentBooking!);
        dispatch({ type: 'SET_UNSAVED_CHANGES', payload: false });
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.hasUnsavedChanges, state.currentBooking]);
  
  const actions = {
    createBooking: () => dispatch({ type: 'CREATE_BOOKING' }),
    
    updateGuest: (guestInfo: Partial<Guest>) => 
      dispatch({ type: 'UPDATE_GUEST', payload: guestInfo }),
    
    selectRoom: (roomId: string) => 
      dispatch({ type: 'SELECT_ROOM', payload: roomId }),
    
    updateDates: (checkIn: Date, checkOut: Date) => 
      dispatch({ type: 'UPDATE_DATES', payload: { checkIn, checkOut } }),
    
    addPackage: (packageId: string) => 
      dispatch({ type: 'ADD_PACKAGE', payload: packageId }),
    
    removePackage: (packageId: string) => 
      dispatch({ type: 'REMOVE_PACKAGE', payload: packageId }),
    
    saveBookingDraft: () => {
      if (state.currentBooking) {
        saveToLocalStorage(state.currentBooking);
        dispatch({ type: 'SAVE_DRAFT' });
      }
    },
    
    loadBookingDraft: () => {
      const savedBooking = loadFromLocalStorage();
      if (savedBooking) {
        dispatch({ type: 'LOAD_DRAFT', payload: savedBooking });
      }
    },
    
    clearBooking: () => {
      localStorage.removeItem('hotel-booking-draft');
      dispatch({ type: 'CLEAR_BOOKING' });
    },
    
    submitBooking: async () => {
      if (!state.currentBooking) return;
      
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Submit booking logic here
        await submitBookingToService(state.currentBooking);
        localStorage.removeItem('hotel-booking-draft');
        dispatch({ type: 'CLEAR_BOOKING' });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
  };
  
  const contextValue: BookingContextType = {
    ...state,
    actions,
  };
  
  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

function saveToLocalStorage(booking: Booking): void {
  try {
    localStorage.setItem('hotel-booking-draft', JSON.stringify(booking));
  } catch (error) {
    console.warn('Failed to save booking to localStorage:', error);
  }
}

function loadFromLocalStorage(): Booking | null {
  try {
    const saved = localStorage.getItem('hotel-booking-draft');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load booking from localStorage:', error);
    return null;
  }
}

async function submitBookingToService(booking: Booking): Promise<void> {
  // This will be implemented with the booking service
  throw new Error('Booking submission not implemented yet');
}
```

### 4. Create Basic App Structure
Create `src/App.tsx`:
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from '@/context/BookingContext';
import { Navigation } from '@/components/Navigation';
import { Home } from '@/pages/Home';
import { Rooms } from '@/pages/Rooms';
import { Packages } from '@/pages/Packages';
import { Amenities } from '@/pages/Amenities';
import { Booking } from '@/pages/Booking';
import '@/styles/globals.css';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main role="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/booking" element={<Booking />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
```

## Development Workflow

### 1. Start Development Server
```bash
# Start the development server
npm run dev

# The application will be available at:
# http://localhost:3000
```

### 2. Run Tests
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### 3. Build for Production
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run build:analyze
```

### 4. Performance Testing
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse audit
lhci autorun

# Test Core Web Vitals
npm run test:performance
```

## Testing Strategy

### 1. Unit Tests Example
Create `src/components/Navigation/Navigation.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './Navigation';

function renderWithRouter(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
}

describe('Navigation', () => {
  it('renders all navigation links', () => {
    renderWithRouter(<Navigation />);
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rooms/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /packages/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /amenities/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /booking/i })).toBeInTheDocument();
  });
  
  it('has proper accessibility attributes', () => {
    renderWithRouter(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });
  
  it('highlights the current page', () => {
    // Test current page highlighting
    renderWithRouter(<Navigation />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });
});
```

### 2. Integration Tests Example
Create `src/test/integration/booking-flow.test.tsx`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { BookingProvider } from '@/context/BookingContext';
import { Booking } from '@/pages/Booking';

function renderBookingPage() {
  return render(
    <BrowserRouter>
      <BookingProvider>
        <Booking />
      </BookingProvider>
    </BrowserRouter>
  );
}

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });
  
  it('completes full booking flow', async () => {
    const user = userEvent.setup();
    
    renderBookingPage();
    
    // Step 1: Select dates
    const checkInInput = screen.getByLabelText(/check.in/i);
    const checkOutInput = screen.getByLabelText(/check.out/i);
    
    await user.type(checkInInput, '2025-12-01');
    await user.type(checkOutInput, '2025-12-03');
    
    // Step 2: Select room
    const roomSelectButton = screen.getByRole('button', { name: /select room/i });
    await user.click(roomSelectButton);
    
    // Step 3: Add guest information
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john.doe@example.com');
    
    // Step 4: Submit booking
    const submitButton = screen.getByRole('button', { name: /complete booking/i });
    await user.click(submitButton);
    
    // Verify booking completion
    await waitFor(() => {
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
    });
  });
  
  it('saves booking draft to localStorage', async () => {
    const user = userEvent.setup();
    
    renderBookingPage();
    
    // Enter some booking information
    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.type(firstNameInput, 'Jane');
    
    // Wait for auto-save
    await waitFor(() => {
      const savedDraft = localStorage.getItem('hotel-booking-draft');
      expect(savedDraft).toBeTruthy();
      
      const parsedDraft = JSON.parse(savedDraft!);
      expect(parsedDraft.guest.firstName).toBe('Jane');
    });
  });
});
```

### 3. Accessibility Tests Example
Create `src/test/accessibility/a11y.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('supports keyboard navigation', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Test keyboard navigation
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('tabIndex');
    });
  });
});
```

## Deployment Preparation

### 1. Environment Configuration
Create `.env.example`:
```env
# Development Configuration
VITE_APP_TITLE="Hotel Website"
VITE_API_BASE_URL="http://localhost:3001/api"
VITE_ENABLE_MOCK_DATA=true
VITE_GOOGLE_ANALYTICS_ID=""
VITE_PAYMENT_PROVIDER="stripe"
VITE_STRIPE_PUBLISHABLE_KEY=""

# Performance Monitoring
VITE_SENTRY_DSN=""
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Feature Flags
VITE_ENABLE_BOOKING=true
VITE_ENABLE_PACKAGES=true
VITE_ENABLE_AMENITIES=true
```

### 2. Build Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:analyze": "vite build && npx vite-bundle-analyzer dist/stats.html",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit",
    "test:e2e": "playwright test",
    "test:lighthouse": "lhci autorun"
  }
}
```

### 3. Performance Budget
Create `performance-budget.json`:
```json
{
  "budget": {
    "javascript": 250,
    "css": 100,
    "images": 500,
    "fonts": 100,
    "other": 50
  },
  "thresholds": {
    "performance": 90,
    "accessibility": 100,
    "best-practices": 90,
    "seo": 90
  }
}
```

## Next Steps

### Immediate Tasks (First Sprint)
1. **Setup Project Structure**: Initialize Vite project with TypeScript and React
2. **Create Basic Navigation**: Horizontal navigation component with routing
3. **Implement Home Page**: Landing page with hero section and overview
4. **Setup Context Providers**: Booking context and UI state management
5. **Create Mock Data Services**: Initial room, package, and amenity data

### Short-term Goals (2-3 Sprints)
1. **Implement Core Pages**: Rooms, Packages, Amenities listing pages
2. **Build Booking Flow**: Multi-step booking form with validation
3. **Add Responsive Design**: Mobile-first CSS implementation
4. **Setup Testing Suite**: Unit, integration, and accessibility tests
5. **Performance Optimization**: Code splitting and asset optimization

### Long-term Objectives (Future Releases)
1. **Backend Integration**: Replace mock services with real API calls
2. **Payment Processing**: Integrate payment gateway for bookings
3. **Advanced Features**: Room comparison, package recommendations
4. **Analytics Integration**: User behavior tracking and conversion optimization
5. **Progressive Web App**: Service worker and offline functionality

## Troubleshooting

### Common Issues

**Issue**: TypeScript path aliases not working  
**Solution**: Ensure `tsconfig.json` paths match `vite.config.ts` alias configuration

**Issue**: CSS modules not generating types  
**Solution**: Install and configure `vite-plugin-css-modules`

**Issue**: Tests failing due to missing DOM APIs  
**Solution**: Verify `jsdom` is configured in Vite test environment

**Issue**: Build fails with memory issues  
**Solution**: Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096"`

### Performance Debugging

**Bundle Analysis**:
```bash
npm run build:analyze
```

**Lighthouse Testing**:
```bash
npx lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html
```

**Core Web Vitals Monitoring**:
```typescript
// Add to main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Success Criteria

This quickstart guide is successful when:

✅ **Project Setup**: Vite + React + TypeScript project initializes without errors  
✅ **Development Server**: `npm run dev` starts and shows basic navigation  
✅ **Build Process**: `npm run build` creates optimized production bundle under 250KB  
✅ **Tests Pass**: All unit and integration tests execute successfully  
✅ **Accessibility**: No a11y violations detected in automated testing  
✅ **Performance**: Lighthouse scores above constitutional requirements (>90 Performance)  
✅ **Type Safety**: No TypeScript errors in strict mode  
✅ **Code Quality**: ESLint and Prettier pass without issues

**Ready for Feature Implementation**: ✅ All foundational systems operational  
**Constitutional Compliance**: ✅ All requirements met for static webapp development