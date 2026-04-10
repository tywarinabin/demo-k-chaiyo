# Styling Guide

## CSS Custom Properties

All design tokens are defined in `src/styles.scss` under `:root`:

```scss
:root {
  --primary: #7C3AED;        // Purple — buttons, accents, icons
  --primary-hover: #6D28D9;  // Darker purple — hover states
  --primary-light: #EDE9FE;  // Light purple — badges, backgrounds
  --primary-dark: #5B21B6;   // Deep purple — gradients
  --text-dark: #1F2937;      // Primary text color
  --text-muted: #6B7280;     // Secondary text, descriptions
  --text-light: #9CA3AF;     // Tertiary text, placeholders
  --bg-white: #FFFFFF;       // Page background
  --bg-light: #F9FAFB;       // Alternate section background
  --bg-dark: #1F2937;        // Footer background
  --border: #E5E7EB;         // Card borders, dividers
  --shadow: ...;             // Standard card shadow
  --shadow-lg: ...;          // Purple-tinted large shadow (hover states)
  --radius: 12px;            // Standard border radius
  --transition: all 0.3s ease;
}
```

## Global Utility Classes

### `.container`
Max-width 1200px centered wrapper with 24px horizontal padding.

### `.btn-primary`
Purple filled button — white text, hover lifts with shadow.

### `.btn-outline`
Purple bordered button — transparent bg, fills purple on hover.

### `.section-header`
Centered section header with `.section-tag` (purple pill badge), `h2`, and `p`.

## Typography

| Element | Font | Weight | Usage |
|---|---|---|---|
| Headings (h1-h6) | Poppins | 700 | Section titles, headlines |
| Body text | Inter | 400 | Paragraphs, descriptions |
| Buttons | Poppins | 600 | CTA text |
| Badges/tags | Inter | 600 | Small labels |

## Icons

**Library:** Font Awesome 6 Free
**Loaded via:** `angular.json` → styles array → `node_modules/@fortawesome/fontawesome-free/css/all.min.css`

**Usage:**
```html
<!-- Solid icons -->
<i class="fas fa-rocket"></i>
<i class="fas fa-bell"></i>

<!-- Brand icons (social media) -->
<i class="fab fa-instagram"></i>
<i class="fab fa-facebook-f"></i>
```

## Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| `max-width: 1024px` | Tablet landscape |
| `max-width: 992px` | Tablet / small desktop |
| `max-width: 768px` | Tablet portrait / large mobile |
| `max-width: 640px` | Mobile |
| `max-width: 480px` | Small mobile |

## Common Patterns

### Card Hover
```scss
.card {
  transition: var(--transition);
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(124, 58, 237, 0.15);
  }
}
```

### Purple Gradient (CTA / Countdown sections)
```scss
background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
```

### Frosted Glass (Navbar on scroll)
```scss
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
```

### Icon Circle
```scss
.icon-circle {
  width: 60px;
  height: 60px;
  background: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  i { font-size: 1.5rem; color: var(--primary); }
}
```
