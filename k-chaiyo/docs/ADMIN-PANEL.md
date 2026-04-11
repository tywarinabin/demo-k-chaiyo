# Admin Panel Documentation

## Overview

Secure admin panel for managing visitor tracking and form submissions for the K-Chaiyo landing page. Built with Angular 19 standalone components, providing real-time analytics and submission management.

**Access URL:** `/admin/login`

---

## Features

### 1. Authentication System
- JWT-based secure login
- Auto token refresh (2-hour expiry)
- Role-based access (Viewer, Admin, Super Admin)
- Session persistence across page reloads

**Login Flow:**
```
User enters credentials → Backend validates → JWT token issued → Stored in localStorage → Auto-refresh before expiry
```

### 2. Dashboard Analytics
Real-time metrics and visualizations:

**Key Metrics:**
- Total visits with trend indicator
- Unique visitors count
- Form submissions total
- Conversion rate percentage

**Visual Analytics:**
- Daily traffic trend chart (7-day bar chart)
- Top traffic sources with conversion rates
- Geographic distribution (top countries)
- Quick action buttons for navigation

**Filters:**
- Date range: Today | Last 7 Days | Last 30 Days
- Auto-refresh capability

### 3. Visitor Tracking
Complete visitor activity log with advanced filtering.

**Displayed Data:**
- Visit timestamp
- Traffic source (Facebook, Google, Organic, etc.)
- Referral code (if applicable)
- Country code
- Landing page URL
- Bot detection status

**Filters:**
- Source filter (all sources or specific)
- Bot filter (All | Real Users Only | Bots Only)
- Pagination (10, 20, 50, 100 per page)

**Actions:**
- Export to CSV with applied filters
- Pagination navigation

### 4. Form Submissions Management
View and manage customer inquiries with status tracking.

**Displayed Data:**
- Submission timestamp
- Customer name and email
- Category of need
- Current status
- Action buttons

**Status Workflow:**
```
Pending → Reviewed → Contacted
                  ↘ Spam
```

**Detail View Modal:**
- Full customer contact information
- Complete message text
- Admin notes (if any)
- Status update buttons
- One-click email/phone contact links

**Status Actions:**
- Mark as Reviewed
- Mark as Contacted
- Mark as Spam
- Reset to Pending

**Filters:**
- Status filter (All | Pending | Reviewed | Contacted | Spam)
- Pagination

---

## User Interface

### Layout Structure

**Sidebar Navigation:**
- Dashboard (home icon)
- Visitors (users icon)
- Submissions (document icon with pending badge)
- Collapsible for more space

**Header:**
- Page title
- User profile dropdown
  - Username and role badge
  - Email address
  - Logout button

**Responsive Design:**
- Desktop: Full sidebar + content
- Mobile: Hamburger menu, collapsible sidebar, touch-friendly

### Color Scheme
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Neutral: Gray shades

---

## API Integration

### Authentication Endpoints

**POST /api/v1/admin/login**
```json
Request:
{
  "username": "admin",
  "password": "password"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": { ... }
}
```

**POST /api/v1/admin/refresh**
Refreshes expired JWT token using refresh token.

### Analytics Endpoints

**GET /api/v1/admin/analytics/dashboard**
Query Params: `startDate`, `endDate`, `source`

Returns: Dashboard metrics, trends, top sources, top countries.

### Visitor Endpoints

**GET /api/v1/admin/visitors**
Query Params: `page`, `limit`, `source`, `isBot`, `startDate`, `endDate`

Returns: Paginated visitor list.

**GET /api/v1/admin/visitors/export**
Downloads CSV with filtered visitor data.

### Submission Endpoints

**GET /api/v1/admin/submissions**
Query Params: `page`, `limit`, `status`, `startDate`, `endDate`

Returns: Paginated submission list.

**PATCH /api/v1/admin/submissions/:id**
```json
{
  "status": "contacted",
  "notes": "Called customer, scheduled meeting"
}
```

**GET /api/v1/admin/submissions/export**
Downloads CSV with filtered submissions.

---

## Security Features

1. **Authentication Required**
   - All admin routes protected by auth guard
   - Auto-redirect to login if not authenticated
   - Return URL preserved for post-login redirect

2. **Token Management**
   - Tokens stored in localStorage
   - Auto-refresh 5 minutes before expiry
   - Secure HTTPS-only transmission

3. **Input Validation**
   - Client-side form validation
   - Server-side validation enforced
   - XSS/SQL injection prevention

4. **Role-Based Access**
   - Viewer: Read-only access
   - Admin: Full CRUD access
   - Super Admin: User management + full access

---

## Usage Guide

### For Admins

**Daily Tasks:**
1. Check dashboard for new submissions (badge indicator)
2. Review pending submissions
3. Update status as you contact customers
4. Monitor traffic sources for campaign performance

**Weekly Tasks:**
1. Export submission data for CRM
2. Analyze traffic trends
3. Identify and block spam sources

### For Developers

**Project Structure:**
```
src/app/admin/
├── components/
│   ├── login/              # Login page
│   ├── dashboard/          # Analytics dashboard
│   ├── visitors/           # Visitor tracking list
│   ├── submissions/        # Submission management
│   └── layout/             # Admin layout with sidebar
├── services/
│   ├── auth.service.ts     # Authentication & JWT
│   ├── visitor.service.ts  # Visitor API calls
│   ├── submission.service.ts # Submission API calls
│   └── analytics.service.ts  # Analytics API calls
├── guards/
│   └── auth.guard.ts       # Route protection
└── models/
    └── admin.models.ts     # TypeScript interfaces
```

**Adding New Features:**
1. Create service method in relevant service file
2. Add component in `components/` folder
3. Update routes in `app.routes.ts`
4. Add navigation link in layout sidebar

---

## Troubleshooting

**Login Issues:**
- Clear localStorage and retry
- Check network tab for API errors
- Verify backend is running

**Token Expired:**
- System auto-refreshes tokens
- Manual logout and re-login if issues persist

**Data Not Loading:**
- Check browser console for errors
- Verify API endpoints are correct
- Mock data loads if backend unavailable (dev mode)

**Export Not Working:**
- Check browser download settings
- Ensure backend export endpoint is implemented

---

## Future Enhancements

Planned features for next releases:

1. **Advanced Analytics**
   - Funnel visualization
   - Conversion path tracking
   - Heatmap integration

2. **Notifications**
   - Email alerts for new submissions
   - Push notifications for admin users
   - Daily/weekly report emails

3. **Bulk Actions**
   - Multi-select submissions
   - Bulk status updates
   - Batch export

4. **Search & Filters**
   - Full-text search in submissions
   - Advanced filter combinations
   - Saved filter presets

5. **User Management**
   - Create/edit admin users
   - Audit log viewer
   - Activity tracking

---

## Development Notes

**Tech Stack:**
- Angular 19 (Standalone Components)
- TypeScript 5.x
- RxJS for reactive programming
- SCSS for styling

**Key Patterns:**
- Service injection with `inject()`
- Reactive forms for validation
- Observable streams for async data
- Guard functions for route protection

**Performance:**
- Lazy loading for admin routes
- Virtual scrolling for large lists (future)
- Request caching in services
- Optimized change detection

**Testing:**
- Mock data fallback for development
- Error boundary handling
- Loading states for UX

---

## Support

For issues or feature requests:
- Check browser console for errors
- Review API response in network tab
- Contact development team with error details

**Admin Support:**
- Username/password reset: Contact super admin
- Access issues: Check role permissions
- Data questions: Review backend documentation
