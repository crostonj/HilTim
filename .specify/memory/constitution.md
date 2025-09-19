# Static WebApp Constitution

## Core Principles

### I. Minimal Dependencies (NON-NEGOTIABLE)
Static webapps must use the absolute minimum number of external dependencies. Every dependency must be explicitly justified by a specific need that cannot be met with native web technologies. Prefer vanilla solutions over libraries when possible.
- Runtime dependencies limited to essential frameworks only (React, Vue, etc.)
- Build dependencies must serve specific, measurable purposes
- No dependencies for functionality available in modern browsers
- Regular dependency audits and removal of unused packages

### II. Component-First Architecture
Every UI element starts as a reusable, self-contained component with clear responsibilities and interfaces.
- Components must be independently testable and documented
- Clear separation between presentational and container components  
- Props interface must be explicitly typed (TypeScript preferred)
- No shared mutable state between components except through defined patterns

### III. Static-First Design
Applications must be designed to work as static sites first, with dynamic features as progressive enhancements.
- Core functionality must work without JavaScript enabled
- Progressive enhancement for interactivity
- Static generation preferred over client-side rendering for content
- Graceful degradation for advanced features

### IV. Performance Budget (NON-NEGOTIABLE)
All static webapps must meet performance targets measured on typical user devices and connections.
- Initial page load: <3 seconds on 3G connection
- Bundle size: <250KB gzipped JavaScript, <100KB CSS
- Lighthouse Performance score: >90
- Core Web Vitals: All metrics in "Good" range

### V. Accessibility Compliance
Applications must be usable by everyone, including users with disabilities.
- WCAG 2.1 AA compliance mandatory
- Semantic HTML structure required
- Keyboard navigation support for all interactive elements
- Screen reader compatibility tested
- Color contrast ratios meet accessibility standards

## Technology Constraints

### Approved Technologies
- **Build Tools**: Vite, Webpack, Parcel (choose one based on project needs)
- **Frameworks**: React, Vue, Svelte, or vanilla JavaScript only
- **Styling**: CSS3, CSS Modules, or PostCSS (no CSS-in-JS libraries)
- **Testing**: Vitest, Jest, Playwright, or framework-native testing tools
- **TypeScript**: Encouraged for type safety and developer experience

### Forbidden Technologies
- Heavy UI libraries (Material-UI, Ant Design) - use minimal component libraries only
- CSS-in-JS runtime libraries (styled-components, emotion) - build-time solutions acceptable
- Large utility libraries (Lodash, moment.js) - use native alternatives or tree-shakeable imports
- jQuery and similar DOM manipulation libraries
- Client-side only routing that breaks browser navigation

### Performance Requirements
- Bundle analysis required for all builds
- Code splitting implemented for routes and large components
- Image optimization and responsive images mandatory
- Critical CSS inlined, non-critical CSS deferred
- Lazy loading for below-the-fold content

## Development Workflow

### Code Quality Gates
- TypeScript strict mode enabled (if using TypeScript)
- ESLint with accessibility rules configured
- Prettier for consistent formatting
- Pre-commit hooks for linting and formatting
- All components must have unit tests

### Testing Requirements
- Unit tests for all business logic and utility functions
- Component tests for user interactions
- Integration tests for critical user flows
- Visual regression testing for UI components (recommended)
- Accessibility testing included in test suites

### Build and Deployment
- Automated builds on commit/pull request
- Static asset optimization (images, fonts, icons)
- Bundle size monitoring and alerts for size increases
- Performance testing in CI/CD pipeline
- Progressive Web App features (service worker, manifest) recommended

## Quality Assurance

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge) - last 2 versions minimum
- Progressive enhancement for older browsers
- Mobile-first responsive design mandatory
- Cross-browser testing required before deployment

### Security Requirements
- Content Security Policy (CSP) headers configured
- No inline scripts or styles (except critical CSS)
- HTTPS enforced in production
- Dependency vulnerability scanning
- Sanitization of user inputs and dynamic content

### Monitoring and Analytics
- Core Web Vitals monitoring in production
- Error tracking and reporting
- Performance monitoring and alerting
- User analytics (with privacy compliance)
- Lighthouse CI integration for continuous performance monitoring

## Governance

This constitution supersedes all other development practices. All code reviews and architectural decisions must verify compliance with these principles. Any deviations must be documented with explicit justification and approved through the standard review process.

Complexity that violates these principles must demonstrate clear business value that cannot be achieved through simpler means. Technical debt introduced must have a defined remediation plan.

**Version**: 1.0.0 | **Ratified**: September 18, 2025 | **Last Amended**: September 18, 2025