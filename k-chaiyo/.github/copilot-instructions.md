# AI Assistant & Development Coding Standards

**Project**: k-chaiyo Angular Application  
**Framework**: Angular 17+  
**Styling**: SCSS + Tailwind CSS  
**TypeScript**: Strict Mode  

---

## AI Assistant Instructions

When generating or suggesting code for this project, adhere to these principles. Do not use multiple examples or sample patterns. Apply rules directly to each context.

### General Code Principles

1. **Single Responsibility**: Each component, service, or function has exactly one reason to change.
2. **Type Safety**: No `any` types. Use explicit types or `unknown` with narrowing.
3. **Meaningful Naming**: Descriptive names without abbreviations (except universally understood: `id`, `url`, `css`).
4. **Complexity Limit**: Functions max 15 lines or 3 nesting levels; exceed these = refactor immediately.
5. **No Dead Code**: Remove unused imports, comments, console.logs, and TODOs without context.

### Code Quality Checklist

- [ ] All external inputs are validated (type, length, format, range)
- [ ] TypeScript strict mode compliance: no implicit `any`, no unsafe access
- [ ] Change detection set to OnPush for presentational components
- [ ] No hardcoded values; use constants or environment variables
- [ ] Observable patterns used instead of promises for async operations
- [ ] Error handling is consistent and informative
- [ ] Dependencies injected via constructor, never instantiated with `new`

---

## Frontend Architecture

### Layer Organization

```
Domain Layer (Models/Interfaces): Type definitions, constants, enums
Application Layer (Services): Business logic, state management, API orchestration
Presentation Layer (Components): UI rendering, user interaction, form handling
Shared Layer (Utilities): Reusable pipes, directives, helper functions
```

**Dependency Rule**: Components depend on services, services depend on models. Never inverse this.

### Component Requirements

- Every component must have `ChangeDetectionStrategy.OnPush`
- Presenter components accept `@Input()` and emit `@Output()` events only
- Container components handle state, data fetching, and business logic
- Template expressions must be simple; complex logic belongs in the component class
- Use `*ngFor` with `trackBy` for all lists

### Service Requirements

- Return `Observable<T>` types; never wrap in promises
- Use RxJS operators for composition: `map`, `switchMap`, `catchError`, `tap`
- Provide at service root level: `@Injectable({ providedIn: 'root' })`
- Handle errors with descriptive exception types
- Document service contracts with JSDoc comments

### TypeScript Compliance

- Enforce strict configuration: `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`
- Use union types for variants: `type Status = 'pending' | 'success' | 'error'`
- Use generics for type-safe reusability in services and utilities
- Apply optional chaining and nullish coalescing: `obj?.prop ?? defaultValue`
- Never suppress TypeScript errors; fix warnings or refactor

---

## Responsive Design Standards

### Principles

- **Mobile-First**: Design for 320px; enhance progressively for larger screens
- **Fluid Layouts**: Use relative units (`em`, `rem`, `%`, `fr`) exclusively; no fixed pixel widths except for precise controls
- **Semantic Flexibility**: Layouts adapt content to viewport; content never requires horizontal scroll

### Breakpoints (em-based)

| Device | Min Width | CSS Query |
|--------|-----------|-----------|
| Mobile | — | Default (no query) |
| Tablet | 40em | `@media (min-width: 40em)` |
| Desktop | 64em | `@media (min-width: 64em)` |
| Large | 80em | `@media (min-width: 80em)` |

### CSS Architecture

- **Scoped Styles**: Component SCSS files contain only that component's rules
- **Layout Methods**: Flexbox for linear layouts, CSS Grid for 2D layouts
- **Images**: Always set `max-width: 100%` and `height: auto`; use responsive attributes (`width`, `height`)
- **Typography**: Base font-size in `rem`; responsive scaling via viewport units or media queries
- **CSS Variables**: Define theme colors, spacing units, transitions in `:root`

---

## Tailwind CSS Guidelines

**Principle**: Utility-first approach with minimal custom CSS.

- Use Tailwind classes for all styling; custom CSS only for complex state or animations
- Responsive utilities follow Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Create component classes only in `@layer components` for multi-utility patterns
- Never create single-utility wrapper classes (e.g., don't wrap `text-lg` in a `.text-large` class)
- Configure custom theme values in `tailwind.config.js` for consistency

---

## Accessibility Requirements (WCAG 2.1 Level AA)

1. **Semantic HTML**: Use `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>` appropriately
2. **Form Labels**: Every input has associated `<label>` with `for` attribute
3. **Alt Text**: Every image has concise, descriptive alt text
4. **Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
5. **Keyboard Navigation**: All interactive elements reachable via Tab key; logical focus order
6. **ARIA Sparingly**: Use semantic HTML first; apply `aria-*` attributes only when semantic tags are insufficient
7. **Focus Indicators**: All focusable elements have visible `:focus-visible` styling
8. **Heading Hierarchy**: Proper h1 → h2 → h3 structure; no skipped levels

---

## Performance Standards

### Build Optimization

- Tree-shake unused code; remove dead imports
- Lazy load feature modules with `loadChildren`
- Use changeDetection OnPush across all components
- No inline styles; use external stylesheets or Tailwind utilities

### Runtime Performance

- Implement `trackBy` for `*ngFor` loops
- Use `async` pipe or `takeUntil` for subscription cleanup
- Batch related API calls with `forkJoin` or `combineLatest`
- Optimize images: compress, use modern formats (WebP), set `loading="lazy"` for below-fold

### Bundle & Network

- No N+1 queries; prefetch related data
- Implement HTTP caching headers on backend responses
- Minimize initial bundle; defer non-critical features
- Paginate list endpoints; never return unbounded collections

---

## File Organization

```
src/app/
├── components/                    # Presentational components
│   └── [component-name]/
│       ├── [name].component.ts    # Logic, typed, OnPush
│       ├── [name].component.html  # Semantic HTML only
│       ├── [name].component.scss  # Scoped styles
│       └── [name].spec.ts         # Unit tests
├── pages/                         # Route-level container components
│   └── [page-name]/
│       ├── [name].component.ts
│       ├── [name].component.html
│       └── [name].component.scss
├── services/                      # Business logic, API integration
│   ├── [service-name].service.ts
│   └── [service-name].spec.ts
├── shared/                        # Reusable across app
│   ├── models/                    # Interfaces, types, models
│   ├── constants/                 # App-wide constants
│   ├── utils/                     # Pure utility functions
│   ├── pipes/                     # Custom Angular pipes
│   └── directives/                # Custom Angular directives
└── admin/                         # Feature module (same structure)
```

---

## Error Handling & Validation

- **Validation**: Check all external inputs at API boundary
- **Error Types**: Use domain-specific exception classes (e.g., `UserNotFoundException`)
- **User Feedback**: Display user-friendly messages; never expose stack traces
- **Logging**: Log with context (request ID, user ID); never log secrets or PII
- **Graceful Degradation**: Services degrade gracefully; UI handles loading, error, success states

---

## Testing Principles (When Required)

- **Arrange-Act-Assert**: Organize tests in this pattern
- **Unit Tests**: Domain and application layers
- **Integration Tests**: Infrastructure and API layers
- **Mock Boundaries**: Mock external dependencies at layer boundaries
- **Edge Cases**: Test failure paths, not just happy paths

---

## Git & Commit Standards

- **Commit Messages**: Imperative mood, present tense ("Add feature" not "Added feature")
- **Atomic Commits**: One logical change per commit
- **No Secrets**: Never commit `.env`, credentials, keys, or API tokens

---

## Documentation Requirements

**New Feature Rule**: When adding a feature, create `docs/[feature-name].md` with:
- Overview (2-3 sentences)
- API endpoints or component interfaces
- Key design decisions
- Minimal usage example

---

## Security Practices

- Use parameterized queries; never concatenate user input
- Sanitize data before rendering or storing
- Validate all inputs; whitelist known-good patterns
- Use HTTPS everywhere
- Apply principle of least privilege to database users and API keys
- Hash passwords with bcrypt or argon2; never store plaintext

---

## When to Refactor

Refactor immediately when:
- Function exceeds 15 lines
- Nesting depth exceeds 3 levels
- Component has more than 2 responsibilities
- Service class exceeds 300 lines
- Cyclomatic complexity rises above threshold
- Same code appears in 3+ locations

---

## Forbidden Patterns

| Pattern | Why | Alternative |
|---------|-----|-------------|
| `any` type | Breaks type safety | Use explicit types or `unknown` |
| Commented code | Creates maintenance burden | Delete it; git history preserves it |
| Inline event handlers | Reduces testability | Extract to component method |
| Direct DOM access | Breaks encapsulation | Use Angular references |
| Unsubscribed Observables | Memory leaks | Use `async` pipe or `takeUntil` |
| Direct HTTP responses | Tightly couples to API | Wrap in service layer |
| Magic strings | Reduces maintainability | Use constants |
| Console.logs in production | Clogs logs | Use structured logging |
| Nested ternaries | Reduces readability | Use if/else or switch |

---

## Style Guide Compliance

- **TypeScript**: Follow official [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Angular**: Follow [Angular Style Guide](https://angular.io/guide/styleguide)
- **CSS**: Follow [MDN: CSS Best Practices](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **HTML**: Follow [W3C HTML Standard](https://html.spec.whatwg.org/)
- **Accessibility**: Follow [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Pre-Commit Validation

Before pushing code:

1. Lint passes: `ng lint`
2. Tests pass: `ng test` (if applicable)
3. Build succeeds: `ng build`
4. No TypeScript errors: `tsc --noEmit`
5. Code follows standards in this file
6. Commit message is clear and atomic
7. No secrets or hardcoded values

---

**Last Updated**: May 7, 2026  
**Review Cycle**: Quarterly
