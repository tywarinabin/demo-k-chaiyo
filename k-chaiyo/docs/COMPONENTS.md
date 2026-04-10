# Component Reference

## Navbar (`app-navbar`)

**Purpose:** Fixed top navigation with scroll-aware styling.

| Feature | Detail |
|---|---|
| Scroll effect | Transparent → frosted glass white on scroll (backdrop-filter blur) |
| Mobile menu | Hamburger toggle, slide-in drawer from right |
| Nav links | Products, Features, How It Works, Countdown (anchor links) |
| CTA | "Join Waitlist" button — triggers ModalService.open() |
| Badge | "Coming Soon" purple pill next to logo |

**Key logic:** `@HostListener('window:scroll')` sets `isScrolled` flag at 50px threshold.

---

## Hero (`app-hero`)

**Purpose:** Full-viewport hero section — first thing visitors see.

| Feature | Detail |
|---|---|
| Layout | Two-column: text (left) + illustration (right) |
| Headline | "K Chaiyo? Aaaudai Cha!" (K Chaiyo? is Coming!) |
| Mini countdown | 4 boxes: Days / Hours / Minutes / Seconds |
| Buttons | "Join the Waitlist" (modal) + "See What's Coming" (scroll to #products) |
| Stats row | Waitlist count, districts, launch year |
| Illustration | 3 floating Font Awesome icons in white circles with CSS animations |

**Key logic:** `setInterval` countdown to `2027-04-10T00:00:00`, cleaned up in `ngOnDestroy`.

---

## Products (`app-products`)

**Purpose:** Sneak peek of product categories that will be available.

| Feature | Detail |
|---|---|
| Grid | 6 cards — 3 columns desktop, 2 tablet, 1 mobile |
| Categories | Electronics, Fashion, Home, Beauty, Books, Sports |
| Badge | "Coming Soon" pill on each card |
| Icons | Font Awesome icons in purple-light circles |

**Data:** `categories` array in component class.

---

## Features (`app-features`)

**Purpose:** Highlight platform capabilities (future tense).

| Feature | Detail |
|---|---|
| Grid | 4 cards — 4 columns desktop, 2 tablet, 1 mobile |
| Items | Trending Items, Doorstep Delivery, Easy Ordering, Secure Payments |
| Badge | "Coming Soon" on each card |

**Data:** `features` array in component class.

---

## Timeline (`app-timeline`)

**Purpose:** "How It Works" — 4-step process explanation.

| Feature | Detail |
|---|---|
| Layout | Vertical timeline with center line, alternating left/right cards |
| Steps | Browse → Cart → Order → Delivered |
| Mobile | Line shifts to left edge, all cards stack right |

**Data:** `steps` array with number, icon, title, description.

---

## Countdown (`app-countdown`)

**Purpose:** Large countdown timer to launch date with email signup.

| Feature | Detail |
|---|---|
| Background | Purple gradient with decorative translucent circles |
| Timer | 4 frosted-glass boxes: Days / Hours / Minutes / Seconds |
| Launch date | April 10, 2027 |
| Email signup | Input + "Notify Me" button, success state on submit |

**Key logic:** Same `setInterval` pattern as Hero countdown. Uses `FormsModule` for `[(ngModel)]`.

---

## Testimonials (`app-testimonials`)

**Purpose:** Social proof from early supporters / beta testers.

| Feature | Detail |
|---|---|
| Grid | 3 columns desktop, 2 tablet, 1 mobile |
| Reviews | 6 testimonials from different Nepali cities |
| Elements | Avatar (initials), name, location, star rating, quote |

**Data:** `testimonials` array. `getStars(count)` returns array for star rendering.

---

## Stats (`app-stats`)

**Purpose:** Pre-launch impact numbers.

| Feature | Detail |
|---|---|
| Grid | 4 columns, responsive |
| Metrics | 5,000+ Waitlist, 75+ Districts, 100+ Products, 1 Big Dream |
| Background | Light purple (#F5F3FF) |

---

## CTA (`app-cta`)

**Purpose:** Final call-to-action before footer.

| Feature | Detail |
|---|---|
| Background | Purple gradient (same as countdown) |
| Buttons | "Join Waitlist" (opens modal) + "Follow Us" |

---

## Footer (`app-footer`)

**Purpose:** Site footer with links, contact info, social icons.

| Feature | Detail |
|---|---|
| Layout | 4-column grid: Brand, Quick Links, Support, Contact |
| Social | Facebook, Instagram, Twitter, YouTube (Font Awesome brand icons) |
| Bottom bar | Copyright + "Made with love in Nepal" + "Launching April 2027" |

---

## Contact Modal (`app-contact-modal`)

**Purpose:** Waitlist signup form (overlay modal).

| Feature | Detail |
|---|---|
| Trigger | ModalService.open() — from navbar, hero, CTA |
| Form fields | Name (required), Email (required + validation), Phone, Message |
| Validation | Client-side: empty check + email regex |
| Success state | "Dhanyabad! You're on the list!" |
| Close | X button, backdrop click, or post-submit close button |
| Animation | Fade in overlay + slide up content |

**Key logic:** Injects `ModalService`, subscribes to `isOpen$` via `async` pipe.
