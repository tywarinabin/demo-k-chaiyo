# Visitor Tracking Backend Architecture

## Overview

Secure, temporary backend service to track website visitors, analyze traffic sources, and handle form submissions for the K-Chaiyo landing page. Designed for public access with admin authentication for analytics.

> **Related Documentation:** See [ADMIN-PANEL.md](./ADMIN-PANEL.md) for frontend admin panel features and usage guide.

**Key Goals:**
- Track visitor sources (organic, Facebook, referral links)
- Store form submissions securely
- Prevent duplicate entries via IP tracking
- Provide analytics dashboard for traffic analysis
- Handle high traffic with rate limiting
- Maintain audit trail

---

## Database Schema

### 1. visitors
Tracks every unique visit to the website.

```sql
CREATE TABLE visitors (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address          VARCHAR(45) NOT NULL,           -- IPv4/IPv6
  ip_hash             VARCHAR(64) NOT NULL,            -- SHA256 hashed IP for privacy
  user_agent          TEXT,
  visited_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source              VARCHAR(100),                    -- 'organic', 'facebook', 'google', etc.
  referral_code       VARCHAR(255),                    -- query param value
  utm_source          VARCHAR(100),
  utm_medium          VARCHAR(100),
  utm_campaign        VARCHAR(100),
  utm_content         VARCHAR(100),
  utm_term            VARCHAR(100),
  landing_page        VARCHAR(500),                    -- full URL visited
  country_code        CHAR(2),                         -- from IP geolocation
  session_id          VARCHAR(100),                    -- browser session tracking
  is_bot              BOOLEAN DEFAULT FALSE,           -- bot detection flag
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_ip_hash (ip_hash),
  INDEX idx_source (source),
  INDEX idx_visited_at (visited_at),
  INDEX idx_session (session_id)
);
```

### 2. form_submissions
Stores all form data submitted by visitors.

```sql
CREATE TABLE form_submissions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id          UUID REFERENCES visitors(id),   -- link to visitor record
  ip_hash             VARCHAR(64) NOT NULL,
  full_name           VARCHAR(255) NOT NULL,
  email               VARCHAR(255) NOT NULL,
  phone_number        VARCHAR(20),
  message             TEXT,
  needs_category      VARCHAR(100),                    -- what they need (K chaiyo response)
  consent_given       BOOLEAN DEFAULT FALSE,           -- GDPR/privacy consent
  submitted_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status              VARCHAR(20) DEFAULT 'pending',   -- 'pending', 'reviewed', 'contacted', 'spam'
  reviewed_by         VARCHAR(100),                    -- admin who reviewed
  reviewed_at         TIMESTAMP,
  notes               TEXT,                            -- admin notes
  
  INDEX idx_visitor (visitor_id),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at)
);
```

### 3. duplicate_checks
Prevents duplicate form submissions within a time window.

```sql
CREATE TABLE duplicate_checks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash             VARCHAR(64) NOT NULL,
  email_hash          VARCHAR(64) NOT NULL,            -- SHA256 hashed email
  fingerprint         VARCHAR(255),                    -- browser fingerprint
  last_submission_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submission_count    INTEGER DEFAULT 1,
  is_blocked          BOOLEAN DEFAULT FALSE,           -- if marked as spam
  
  UNIQUE (ip_hash, email_hash),
  INDEX idx_last_submission (last_submission_at),
  INDEX idx_blocked (is_blocked)
);
```

### 4. traffic_analytics
Pre-aggregated analytics for fast dashboard queries.

```sql
CREATE TABLE traffic_analytics (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date                DATE NOT NULL,
  hour                INTEGER,                         -- 0-23 for hourly breakdown
  source              VARCHAR(100),
  total_visits        INTEGER DEFAULT 0,
  unique_visitors     INTEGER DEFAULT 0,
  form_submissions    INTEGER DEFAULT 0,
  bounce_rate         DECIMAL(5,2),
  avg_session_time    INTEGER,                         -- seconds
  country_code        CHAR(2),
  
  UNIQUE (date, hour, source, country_code),
  INDEX idx_date (date),
  INDEX idx_source_date (source, date)
);
```

### 5. audit_logs
Complete audit trail for compliance and debugging.

```sql
CREATE TABLE audit_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type          VARCHAR(50) NOT NULL,            -- 'visit', 'form_submit', 'admin_login', 'data_export'
  entity_type         VARCHAR(50),                     -- 'visitor', 'submission', 'user'
  entity_id           UUID,
  ip_address          VARCHAR(45),
  user_agent          TEXT,
  payload             JSONB,                           -- flexible event data
  severity            VARCHAR(20) DEFAULT 'info',      -- 'info', 'warning', 'error', 'critical'
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at),
  INDEX idx_entity (entity_type, entity_id)
);
```

### 6. admin_users
Admin authentication for analytics dashboard.

```sql
CREATE TABLE admin_users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username            VARCHAR(100) UNIQUE NOT NULL,
  email               VARCHAR(255) UNIQUE NOT NULL,
  password_hash       VARCHAR(255) NOT NULL,           -- bcrypt hashed
  role                VARCHAR(20) DEFAULT 'viewer',    -- 'viewer', 'admin', 'super_admin'
  is_active           BOOLEAN DEFAULT TRUE,
  last_login_at       TIMESTAMP,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by          UUID REFERENCES admin_users(id),
  
  INDEX idx_username (username),
  INDEX idx_email (email)
);
```

### 7. api_rate_limits
Track and enforce rate limiting per IP.

```sql
CREATE TABLE api_rate_limits (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash             VARCHAR(64) NOT NULL,
  endpoint            VARCHAR(100) NOT NULL,
  request_count       INTEGER DEFAULT 1,
  window_start        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_blocked          BOOLEAN DEFAULT FALSE,
  blocked_until       TIMESTAMP,
  
  UNIQUE (ip_hash, endpoint, window_start),
  INDEX idx_window (window_start),
  INDEX idx_blocked (is_blocked)
);
```

---

## Security Architecture

### 1. Public Endpoints (No Auth Required)
- Rate limited: 10 requests/minute per IP
- CORS configured for kchaiyo.com domain only
- Request size limits (max 5KB payload)
- Bot detection via user-agent + behavioral analysis

**Protection Layers:**
```
Internet → Cloudflare/WAF → Rate Limiter → Input Validator → API
```

### 2. Admin Endpoints (Auth Required)
- JWT-based authentication
- Role-based access control (RBAC)
- Token expiry: 2 hours
- Refresh token: 7 days
- IP whitelisting option for super_admin

**Auth Flow:**
```
Admin Login → Validate Credentials → Issue JWT + Refresh Token → Store in HttpOnly Cookie
```

### 3. Data Protection
- **PII Encryption**: Email, phone stored with AES-256
- **IP Hashing**: SHA-256 with salt (never store raw IPs)
- **Password Hashing**: bcrypt with cost factor 12
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Prevention**: Sanitize all inputs, escape outputs
- **HTTPS Only**: TLS 1.3, redirect HTTP to HTTPS

### 4. Rate Limiting Strategy
| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /api/visit | 20 | 1 minute |
| POST /api/submit-form | 3 | 5 minutes |
| POST /api/admin/login | 5 | 15 minutes |
| GET /api/admin/analytics | 100 | 1 minute |

---

## API Endpoints

### Public API

#### POST /api/v1/track-visit
Track a visitor without auth.

**Request:**
```json
{
  "sessionId": "abc123-session",
  "source": "facebook",
  "referralCode": "fkjlsfjlkd",
  "utmParams": {
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "spring_launch"
  },
  "landingPage": "/",
  "fingerprint": "browser-fingerprint-hash"
}
```

**Response:**
```json
{
  "success": true,
  "visitorId": "uuid",
  "message": "Visit tracked"
}
```

**Edge Cases:**
- Duplicate session within 30 seconds → Return existing visitorId
- Bot detected → Track with is_bot=true, don't count in analytics
- Invalid source → Default to 'unknown'
- Missing fields → Use defaults, never fail request

---

#### POST /api/v1/submit-form
Submit contact form with duplicate prevention.

**Request:**
```json
{
  "visitorId": "uuid",
  "fullName": "Nabin Tiwari",
  "email": "nabin@example.com",
  "phoneNumber": "+977-9800000000",
  "message": "I need web development services",
  "needsCategory": "web-development",
  "consentGiven": true,
  "fingerprint": "browser-fingerprint-hash"
}
```

**Response:**
```json
{
  "success": true,
  "submissionId": "uuid",
  "message": "Form submitted successfully"
}
```

**Edge Cases:**
- Duplicate IP+Email within 24 hours → HTTP 429: "Already submitted"
- Missing consent → HTTP 400: "Consent required"
- Invalid email format → HTTP 400: "Invalid email"
- Rate limit exceeded → HTTP 429: "Too many requests"
- Honeypot field filled (spam) → Accept but mark as spam silently

**Duplicate Detection Logic:**
```
1. Hash IP + Email
2. Check duplicate_checks table
3. If exists AND (now - last_submission_at < 24 hours)
   → Increment submission_count
   → If submission_count > 3 → Block IP (set is_blocked=true)
   → Return 429
4. Else → Allow submission
```

---

### Admin API (Protected)

#### POST /api/v1/admin/login
Admin authentication.

**Request:**
```json
{
  "username": "admin",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "uuid",
    "username": "admin",
    "role": "admin"
  }
}
```

---

#### GET /api/v1/admin/analytics/dashboard
Get aggregated analytics.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Params:**
```
?startDate=2026-04-01&endDate=2026-04-12&source=facebook
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVisits": 15420,
    "uniqueVisitors": 8934,
    "formSubmissions": 234,
    "conversionRate": 2.62,
    "topSources": [
      {"source": "facebook", "visits": 6500, "conversions": 120},
      {"source": "organic", "visits": 5200, "conversions": 80},
      {"source": "google", "visits": 3720, "conversions": 34}
    ],
    "topCountries": [
      {"country": "NP", "visits": 12000},
      {"country": "IN", "visits": 2100},
      {"country": "US", "visits": 1320}
    ],
    "hourlyTrend": [...],
    "dailyTrend": [...]
  }
}
```

---

#### GET /api/v1/admin/submissions
List form submissions with filters.

**Query Params:**
```
?status=pending&page=1&limit=50&sortBy=submitted_at&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "fullName": "Nabin Tiwari",
        "email": "nabin@example.com",
        "message": "...",
        "needsCategory": "web-development",
        "source": "facebook",
        "submittedAt": "2026-04-12T10:30:00Z",
        "status": "pending"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 234,
      "totalPages": 5
    }
  }
}
```

---

#### PATCH /api/v1/admin/submissions/:id
Update submission status.

**Request:**
```json
{
  "status": "contacted",
  "notes": "Called customer, scheduled meeting for next week"
}
```

---

#### GET /api/v1/admin/audit-logs
View audit trail.

**Query Params:**
```
?eventType=form_submit&startDate=2026-04-01&page=1&limit=100
```

---

## Edge Cases & Handling

### 1. Duplicate Submissions
**Problem:** User clicks submit multiple times or uses different browsers/devices.

**Solution:**
- **Primary Key:** IP Hash + Email Hash (24-hour window)
- **Secondary Check:** Browser fingerprint (JavaScript-based)
- **Tertiary Check:** Phone number hash (if provided)

**Logic:**
```
IF (ip_hash + email_hash exists in last 24h)
  → Return 429 with message: "You already submitted. We'll contact you soon."
ELSE IF (email_hash exists in last 24h from different IP)
  → Allow but flag for manual review (might be legitimate)
ELSE
  → Accept submission
```

### 2. Bot Traffic
**Detection:**
- User-agent blacklist (common scrapers)
- Request patterns (too fast, no mouse movement)
- Honeypot field (hidden input that humans don't fill)
- reCAPTCHA v3 score < 0.5

**Action:**
- Track visit but set `is_bot=true`
- Don't count in analytics
- Block form submission

### 3. Malicious Traffic (DDoS)
**Mitigation:**
- Cloudflare WAF with DDoS protection
- Rate limiting at multiple layers (IP, session, fingerprint)
- Auto-block IPs with >100 requests/minute
- CAPTCHA challenge after 3 failed form attempts

### 4. Source Tracking Edge Cases
**Scenarios:**

| URL | Parsed Source | Referral Code |
|-----|--------------|---------------|
| `kchaiyo.com` | organic | null |
| `kchaiyo.com?source=facebook&referral=abc123` | facebook | abc123 |
| `kchaiyo.com?utm_source=google&utm_medium=cpc` | google | null |
| `kchaiyo.com?source=invalid123` | unknown | invalid123 |
| Direct from Facebook app | facebook | null (detected from referrer header) |

**Logic:**
```javascript
function parseSource(req) {
  // Priority 1: Query param
  if (req.query.source) return sanitize(req.query.source);
  
  // Priority 2: UTM source
  if (req.query.utm_source) return sanitize(req.query.utm_source);
  
  // Priority 3: Referrer header
  const referrer = req.headers.referer || req.headers.referrer;
  if (referrer) {
    if (referrer.includes('facebook.com')) return 'facebook';
    if (referrer.includes('google.com')) return 'google';
    return 'referral';
  }
  
  // Default
  return 'organic';
}
```

### 5. IP Address Privacy
**GDPR Compliance:**
- Never store raw IP addresses
- Always hash with SHA-256 + salt
- Store salt in environment variable
- Retain hashed IPs for 90 days max
- Provide data deletion API for GDPR requests

### 6. Missing or Invalid Data
**Validation Rules:**
- Email: RFC 5322 compliant regex
- Phone: E.164 format or Nepali format (+977-XXX...)
- Full Name: 2-100 characters, letters + spaces only
- Message: Max 5000 characters, sanitize HTML

**Handling:**
```
Invalid field → Return 400 with specific error
Missing optional field → Use null/empty string
Missing required field → Return 400
```

### 7. Database Connection Failures
**Resilience:**
- Connection pooling with retry logic (3 attempts)
- Circuit breaker pattern after 5 consecutive failures
- Fallback: Log to file + queue for later processing
- Health check endpoint: `GET /health`

---

## Technology Stack Recommendations

### Backend Framework
**Option 1: Node.js + Express + TypeScript** (Recommended for quick setup)
- Fast development
- Good for I/O heavy operations
- Libraries: express, pg (PostgreSQL), bcrypt, jsonwebtoken, helmet, express-rate-limit

**Option 2: Python + FastAPI** (Recommended for analytics)
- Excellent for data processing
- Auto-generated API docs (Swagger)
- Libraries: fastapi, sqlalchemy, psycopg2, python-jose, bcrypt

**Option 3: Go + Fiber** (Recommended for high traffic)
- Best performance
- Low memory footprint
- Built-in concurrency

### Database
**PostgreSQL 15+** (Required)
- JSONB for flexible payload storage
- Excellent indexing
- UUID generation
- Geospatial extensions (PostGIS) for IP geolocation

### Caching Layer
**Redis** (Recommended)
- Rate limiting counters
- Session storage
- Analytics cache (1-hour TTL)

### Reverse Proxy / Load Balancer
**Nginx** or **Cloudflare**
- SSL termination
- Rate limiting
- DDoS protection
- Static asset caching

### Monitoring & Logging
**Sentry** (Error tracking)
**Grafana + Prometheus** (Metrics)
**ELK Stack** (Logs) or **Loki**

### IP Geolocation
**MaxMind GeoLite2** (Free) or **ipapi.co** (API)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLOUDFLARE CDN                       │
│  (DDoS Protection, WAF, SSL, Rate Limiting Layer 1)     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   NGINX (Reverse Proxy)                  │
│     (Load Balancer, Rate Limiting Layer 2, Caching)     │
└──────────────────────┬──────────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
    ┌───────────────┐     ┌───────────────┐
    │   API Server  │     │   API Server  │
    │   (Node.js)   │     │   (Node.js)   │
    │  + Redis Cache│     │  + Redis Cache│
    └───────┬───────┘     └───────┬───────┘
            │                     │
            └──────────┬──────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │  PostgreSQL 15 (Primary) │
        │  + Read Replica (Optional)│
        └──────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │  Scheduled Jobs (Cron)   │
        │  - Aggregate analytics    │
        │  - Clean old audit logs   │
        │  - Backup database        │
        └──────────────────────────┘
```

### Infrastructure Options

**Option 1: Cloud VM (DigitalOcean, Linode)**
- Single $12/month droplet for MVP
- Manual scaling
- PostgreSQL + Redis + API on same server

**Option 2: Serverless (Vercel/Netlify + Supabase)**
- Frontend: Vercel (free)
- Backend API: Vercel Functions (free tier)
- Database: Supabase (PostgreSQL, free tier)
- No server management

**Option 3: Container (Docker + Kubernetes)**
- Best for scaling beyond 10k visits/day
- Auto-scaling
- Higher complexity

---

## Implementation Checklist

### Phase 1: Core Tracking (Week 1)
- [ ] Set up PostgreSQL database with schema
- [ ] Implement `POST /api/v1/track-visit` endpoint
- [ ] IP hashing and geolocation
- [ ] Source/referral parsing logic
- [ ] Basic rate limiting

### Phase 2: Form Handling (Week 1)
- [ ] Implement `POST /api/v1/submit-form` endpoint
- [ ] Duplicate detection logic
- [ ] Email/phone validation
- [ ] Honeypot spam prevention
- [ ] Audit logging

### Phase 3: Admin Dashboard (Week 2)
- [ ] Admin user authentication (JWT)
- [ ] `POST /api/v1/admin/login` endpoint
- [ ] `GET /api/v1/admin/analytics/dashboard` endpoint
- [ ] `GET /api/v1/admin/submissions` endpoint
- [ ] `PATCH /api/v1/admin/submissions/:id` endpoint

### Phase 4: Analytics & Optimization (Week 2)
- [ ] Scheduled job for traffic_analytics aggregation
- [ ] Dashboard queries optimization (indexed)
- [ ] Redis caching for hot data
- [ ] Export submissions to CSV

### Phase 5: Security Hardening (Week 3)
- [ ] Penetration testing (OWASP Top 10)
- [ ] Rate limiting stress test
- [ ] Bot detection refinement
- [ ] GDPR compliance audit
- [ ] Backup and disaster recovery plan

---

## Analytics Dashboard Features

### Key Metrics
1. **Real-time:** Current visitors, requests/second
2. **Overview:** Total visits, unique visitors, form submissions, conversion rate
3. **Sources:** Traffic breakdown by source with conversion rates
4. **Geography:** Top countries and cities
5. **Trends:** Daily/hourly charts for last 30 days
6. **Referrals:** Top referral codes and their performance

### Reports
- Daily traffic report (email digest)
- Weekly conversion summary
- Anomaly detection (sudden traffic spike)
- Top performing campaigns

---

## Sample Implementation (Node.js)

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const visitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => hashIP(req.ip), // Use hashed IP
});

const formLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => hashIP(req.ip),
});

// utils/ipHash.js
const crypto = require('crypto');

function hashIP(ip) {
  const salt = process.env.IP_HASH_SALT;
  return crypto
    .createHash('sha256')
    .update(ip + salt)
    .digest('hex');
}

// routes/public.js
router.post('/track-visit', visitLimiter, async (req, res) => {
  try {
    const {
      sessionId,
      source,
      referralCode,
      utmParams,
      landingPage,
      fingerprint
    } = req.body;

    const ipHash = hashIP(req.ip);
    const userAgent = req.headers['user-agent'];
    const isBot = detectBot(userAgent);
    
    // Geolocation lookup
    const geo = await geolocate(req.ip);
    
    const visitor = await db.query(`
      INSERT INTO visitors (
        ip_hash, user_agent, source, referral_code,
        utm_source, utm_medium, utm_campaign,
        landing_page, country_code, session_id, is_bot
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      ipHash,
      userAgent,
      source || 'organic',
      referralCode,
      utmParams?.utm_source,
      utmParams?.utm_medium,
      utmParams?.utm_campaign,
      landingPage,
      geo.countryCode,
      sessionId,
      isBot
    ]);

    // Audit log
    await logEvent('visit', 'visitor', visitor.rows[0].id, req.ip);

    res.json({
      success: true,
      visitorId: visitor.rows[0].id
    });
  } catch (error) {
    console.error('Track visit error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/submit-form', formLimiter, async (req, res) => {
  try {
    const {
      visitorId,
      fullName,
      email,
      phoneNumber,
      message,
      needsCategory,
      consentGiven,
      fingerprint
    } = req.body;

    // Validation
    if (!consentGiven) {
      return res.status(400).json({
        success: false,
        error: 'Consent is required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const ipHash = hashIP(req.ip);
    const emailHash = hashEmail(email);

    // Duplicate check
    const duplicate = await db.query(`
      SELECT * FROM duplicate_checks
      WHERE ip_hash = $1 AND email_hash = $2
      AND last_submission_at > NOW() - INTERVAL '24 hours'
    `, [ipHash, emailHash]);

    if (duplicate.rows.length > 0) {
      // Update count
      await db.query(`
        UPDATE duplicate_checks
        SET submission_count = submission_count + 1,
            last_submission_at = NOW()
        WHERE ip_hash = $1 AND email_hash = $2
      `, [ipHash, emailHash]);

      if (duplicate.rows[0].submission_count >= 3) {
        // Block if too many attempts
        await db.query(`
          UPDATE duplicate_checks
          SET is_blocked = true
          WHERE ip_hash = $1 AND email_hash = $2
        `, [ipHash, emailHash]);
      }

      return res.status(429).json({
        success: false,
        error: 'You have already submitted. We will contact you soon.'
      });
    }

    // Insert submission
    const submission = await db.query(`
      INSERT INTO form_submissions (
        visitor_id, ip_hash, full_name, email, phone_number,
        message, needs_category, consent_given
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      visitorId,
      ipHash,
      fullName,
      email,
      phoneNumber,
      message,
      needsCategory,
      consentGiven
    ]);

    // Create duplicate check record
    await db.query(`
      INSERT INTO duplicate_checks (ip_hash, email_hash, last_submission_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (ip_hash, email_hash)
      DO UPDATE SET last_submission_at = NOW(), submission_count = 1
    `, [ipHash, emailHash]);

    // Audit log
    await logEvent('form_submit', 'submission', submission.rows[0].id, req.ip);

    res.json({
      success: true,
      submissionId: submission.rows[0].id,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Submit form error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
```

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| DigitalOcean Droplet | 2GB RAM, 1 vCPU | $12 |
| PostgreSQL (managed) | Alternative to above | $15 |
| Cloudflare | Free tier | $0 |
| Domain | kchaiyo.com | $12/year |
| Redis Cloud | 30MB free | $0 |
| Monitoring (Sentry) | Free tier | $0 |
| **Total (DIY hosting)** | | **$12-15/mo** |
| **Total (managed)** | Vercel + Supabase | **$0-25/mo** |

---

## Migration Plan (When Moving to Production)

1. **Data Export:** CSV export of all visitors and submissions
2. **Schema Migration:** Use Flyway or Liquibase for versioning
3. **Backup Strategy:** Daily automated backups to S3
4. **Scaling Triggers:**
   - >5000 visits/day → Add read replica
   - >10000 visits/day → Move to managed PostgreSQL
   - >50000 visits/day → Migrate to microservices

---

## Compliance & Legal

### GDPR Checklist
- [ ] Consent checkbox on form (explicit)
- [ ] Privacy policy link
- [ ] Data retention policy (90 days for logs)
- [ ] Right to be forgotten (DELETE endpoint)
- [ ] Data portability (export user data)
- [ ] Cookie notice (if using cookies)

### Data Retention
- Visitor logs: 90 days
- Form submissions: 2 years (or until processed)
- Audit logs: 1 year
- Admin logs: Indefinite

---

## Support & Maintenance

### Automated Tasks (Cron Jobs)
```
# Daily at 1 AM - Aggregate analytics
0 1 * * * node scripts/aggregate-analytics.js

# Daily at 2 AM - Clean old audit logs
0 2 * * * node scripts/cleanup-logs.js

# Daily at 3 AM - Backup database
0 3 * * * pg_dump kchaiyo_db > backups/backup-$(date +%Y%m%d).sql

# Weekly on Sunday - Generate report
0 9 * * 0 node scripts/weekly-report.js
```

### Health Checks
- Database connection: Every 30 seconds
- API response time: Every 1 minute
- Disk space: Every 5 minutes
- Alert if >80% disk usage or response time >2s

---

## Next Steps

1. **Review & Approve:** Stakeholder approval of architecture
2. **Technology Selection:** Choose Node.js vs Python vs Go
3. **Environment Setup:** Dev, staging, production
4. **Development Sprints:** Follow implementation checklist
5. **Testing:** Unit, integration, security testing
6. **Deployment:** Gradual rollout with monitoring
7. **Documentation:** API docs (Swagger/OpenAPI)
8. **Training:** Admin dashboard user guide

---

## Contact & Questions

For any clarifications on this architecture, refer to the implementation team or security officer before proceeding with development.