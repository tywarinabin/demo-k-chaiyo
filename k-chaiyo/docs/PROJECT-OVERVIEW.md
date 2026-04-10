# K Chaiyo? — Project Overview

## About

**K Chaiyo?** (Nepali: "What do you need?") is a pre-launch landing page for Nepal's upcoming online delivery platform. The site is designed to build brand awareness, collect waitlist signups, and showcase what the platform will offer when it launches in **April 2027**.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 19.2.0 | Frontend framework |
| TypeScript | 5.7.2 | Language |
| SCSS | - | Styling (CSS preprocessor) |
| Font Awesome | 7.x | Icon library (loaded via angular.json) |
| RxJS | 7.8.0 | Reactive state (used in ModalService) |
| Zone.js | 0.15.0 | Angular change detection |

## Project Type

This is a **single-page application (SPA)** with no routing — all content is displayed on one vertically-scrolling landing page. There is no backend; all data is hardcoded in component classes.

## Design System

- **Primary Color:** `#7C3AED` (Purple)
- **Primary Hover:** `#6D28D9`
- **Primary Light:** `#EDE9FE`
- **Text Dark:** `#1F2937`
- **Text Muted:** `#6B7280`
- **Background:** `#FFFFFF` (White)
- **Font (Headings):** Poppins (Google Fonts)
- **Font (Body):** Inter (Google Fonts)
- **Border Radius:** 12px
- **Transitions:** 0.3s ease

All design tokens are defined as CSS custom properties in `src/styles.scss` under `:root`.

## Pre-Launch Focus

The entire site is framed as a "coming soon" experience:
- Countdown timer to April 10, 2027
- Waitlist signup modal (triggered from multiple CTAs)
- "Coming Soon" badges on product and feature cards
- Future-tense copy throughout
- Early supporter testimonials
- Pre-launch metrics (waitlist signups, districts targeted, etc.)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
ng serve --open

# Build for production
ng build

# Run tests
ng test
```

The dev server runs at `http://localhost:4200`.
