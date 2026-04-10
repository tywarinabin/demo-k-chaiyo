# Architecture

## Overview

K Chaiyo? follows Angular 19's **standalone component** architecture — no NgModules. Each section of the landing page is an independent, self-contained component with its own template, styles, and logic.

## Project Structure

```
src/
├── index.html                    # HTML entry point (loads Google Fonts)
├── main.ts                       # Bootstrap entry point
├── styles.scss                   # Global styles, CSS variables, utility classes
├── app/
│   ├── app.component.ts          # Root component — imports all section components
│   ├── app.component.html        # Layout template — stacks sections vertically
│   ├── app.component.scss        # Root-level styles (empty)
│   ├── app.config.ts             # Application config (zone change detection, router)
│   ├── app.routes.ts             # Routes (empty — single-page app)
│   ├── components/
│   │   ├── navbar/               # Fixed navigation bar with scroll effects
│   │   ├── hero/                 # Hero section with countdown + waitlist CTA
│   │   ├── products/             # Product category preview grid (6 categories)
│   │   ├── features/             # Feature cards (4 features)
│   │   ├── timeline/             # "How It Works" 4-step timeline
│   │   ├── countdown/            # Full countdown timer with email signup
│   │   ├── testimonials/         # Customer/early supporter reviews
│   │   ├── stats/                # Pre-launch metrics (4 stats)
│   │   ├── cta/                  # Call-to-action section
│   │   ├── footer/               # Site footer with links and contact
│   │   ├── contact-modal/        # Waitlist signup modal (overlay)
│   │   └── newsletter/           # Newsletter banner (currently unused)
│   └── services/
│       └── modal.service.ts      # Shared service for modal open/close state
└── public/
    └── favicon.ico
```

## Section Order (top to bottom)

```
Navbar (fixed, always visible)
  ↓
Hero (full viewport, countdown + waitlist CTA)
  ↓
Products Preview (6 category cards with "Coming Soon" badges)
  ↓
Features (4 feature cards — what the platform will offer)
  ↓
Timeline (4-step "How It Works" vertical timeline)
  ↓
Countdown (large countdown timer + email signup)
  ↓
Testimonials (early supporter reviews)
  ↓
Stats (pre-launch metrics)
  ↓
CTA (waitlist call-to-action)
  ↓
Footer (links, contact, social)
  ↓
Contact Modal (overlay — triggered from navbar, hero, CTA buttons)
```

## Component Pattern

Each component follows the same structure:

```
component-name/
├── component-name.component.ts     # Class, data, logic
├── component-name.component.html   # Template
└── component-name.component.scss   # Scoped styles
```

**Data is hardcoded** in component classes (arrays of objects for features, products, timeline steps, testimonials, stats). No services are used for data fetching.

## Shared Service

### ModalService (`src/app/services/modal.service.ts`)

Controls the contact/waitlist modal's open/close state using RxJS `BehaviorSubject`.

```
ModalService
├── isOpen$: Observable<boolean>   # Subscribe to get modal state
├── open(): void                   # Opens modal, disables body scroll
└── close(): void                  # Closes modal, restores body scroll
```

**Used by:** NavbarComponent, HeroComponent, CtaComponent (to open), ContactModalComponent (to listen + close).

## Styling Architecture

- **Global styles** (`src/styles.scss`): CSS custom properties, resets, utility classes (`.container`, `.btn-primary`, `.btn-outline`, `.section-header`)
- **Component styles**: Scoped SCSS per component, referencing global CSS variables via `var(--primary)` etc.
- **Icons**: Font Awesome 6 Free — loaded globally via `angular.json` styles array
- **Fonts**: Google Fonts (Poppins + Inter) — loaded via `<link>` in `index.html`
- **Responsive**: Every component has 2-3 media query breakpoints (typically 992px, 768px, 480/640px)

## Dependency Rule

```
AppComponent → imports all section components
Section components → may inject ModalService
ModalService → standalone, no dependencies
```

There are no circular dependencies. Components do not communicate with each other directly — the only shared state is the modal open/close via ModalService.
