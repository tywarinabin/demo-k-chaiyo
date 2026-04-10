# Development Guide

## Prerequisites

- Node.js 18+ (tested with v22.18.0)
- npm 9+ (tested with v11.6.2)

## Commands

| Command | Description |
|---|---|
| `npm install` | Install all dependencies |
| `ng serve` | Start dev server at localhost:4200 |
| `ng serve --open` | Start dev server and open browser |
| `ng build` | Production build to `dist/k-chaiyo/` |
| `ng build --configuration development` | Dev build with source maps |
| `ng test` | Run unit tests (Karma + Jasmine) |
| `ng generate component components/<name>` | Generate new component |
| `ng generate service services/<name>` | Generate new service |

## Adding a New Section

1. Generate the component:
   ```bash
   ng generate component components/new-section --skip-tests
   ```

2. Add data and logic in the `.ts` file. Follow the pattern of existing components — define arrays of objects for content.

3. Build the template in `.html` using the `section-header` pattern:
   ```html
   <section id="new-section" class="new-section">
     <div class="container">
       <div class="section-header">
         <span class="section-tag"><i class="fas fa-icon"></i> Tag Text</span>
         <h2>Section Title</h2>
         <p>Section description.</p>
       </div>
       <!-- Content here -->
     </div>
   </section>
   ```

4. Style in `.scss` using CSS variables from `:root`.

5. Import in `app.component.ts` and add the tag to `app.component.html` in the desired position.

## Adding Icons

Use Font Awesome 6 Free classes. Browse available icons at https://fontawesome.com/search?o=r&m=free

```html
<i class="fas fa-icon-name"></i>   <!-- Solid -->
<i class="far fa-icon-name"></i>   <!-- Regular -->
<i class="fab fa-icon-name"></i>   <!-- Brands -->
```

## Modifying the Countdown Date

The launch date is defined in two places:
- `src/app/components/hero/hero.component.ts` — `launchDate` property
- `src/app/components/countdown/countdown.component.ts` — `launchDate` property

Update both to change the target date.

## Modifying the Modal

The contact modal is controlled by `ModalService` (`src/app/services/modal.service.ts`). To trigger it from a new component:

```typescript
import { inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

// In your component class:
modalService = inject(ModalService);

openWaitlist() {
  this.modalService.open();
}
```

Then in the template:
```html
<button (click)="openWaitlist()">Join Waitlist</button>
```

## Build Configuration

Production budgets (in `angular.json`):
- Initial bundle: warning at 500kB, error at 1MB
- Component styles: warning at 8kB, error at 12kB

## File Naming Convention

- Components: `kebab-case.component.ts/html/scss`
- Services: `kebab-case.service.ts`
- All component files live under `src/app/components/<component-name>/`
- Services live under `src/app/services/`
