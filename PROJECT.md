# SkillConnect — Project Reference Document

> **Living document.** Update this file every time a new feature is built, a bug is fixed, an environment variable is added, or the business model changes.
>
> Last updated: 2026-05-16

---

## Table of Contents

1. [Mission & Problem Statement](#1-mission--problem-statement)
2. [Business Model](#2-business-model)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Data Models](#5-data-models)
6. [Job Lifecycle (Status Machine)](#6-job-lifecycle-status-machine)
7. [Payment Flow](#7-payment-flow)
8. [Worker Lifecycle](#8-worker-lifecycle)
9. [Pages & Routes](#9-pages--routes)
10. [API Routes](#10-api-routes)
11. [Admin Panel](#11-admin-panel)
12. [Database (Supabase)](#12-database-supabase)
13. [Environment Variables](#13-environment-variables)
14. [External Services & Accounts](#14-external-services--accounts)
15. [Running Locally](#15-running-locally)
16. [Deployment](#16-deployment)
17. [Feature Status](#17-feature-status)
18. [Known Issues & Next Steps](#18-known-issues--next-steps)

---

## 1. Mission & Problem Statement

**SkillConnect** is a locality-first digital labour marketplace operating in **Sweetwaters, Pietermaritzburg**, South Africa.

### The Problem
- South Africa has **46.1% youth unemployment** among ages 15–34
- **79% of informal businesses** have no digital presence — skilled workers are invisible to potential clients even within their own communities
- The gap is not supply — it is **visibility, trust, and connection**

### The Solution
A mobile-first platform that connects informal skilled workers (plumbers, electricians, carpenters, etc.) with local clients, using locality-first matching so that money stays within the community.

### Core Values
- Workers from the **same ward** are always prioritised over workers from further away
- **Portfolio-based verification** — no formal certificate required, just photos of past work
- **Transparent pricing** — clients see quotes before committing
- **Trust through reviews** — real ratings from real neighbours

---

## 2. Business Model

| Item | Detail |
|---|---|
| Worker registration | Free |
| Client posting a job | Free |
| Commission | **6–12%** charged on job completion only |
| Payment method | Client pays platform via PayFast; platform pays worker via EFT minus commission |
| Current pilot area | Sweetwaters, Pietermaritzburg |
| Expansion plan | Msunduzi Municipality → KwaZulu-Natal |

### Commission Rates
- 6% — negotiated/partner rates
- 8% — standard reduced
- 10% — standard (default)
- 12% — premium/urgent jobs

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16.2.6** (App Router) |
| Language | **TypeScript 5** |
| UI | **React 19**, **Tailwind CSS 4**, **Lucide React** icons |
| Database | **Supabase** (PostgreSQL + Storage) |
| Auth (admin) | Custom HMAC-based session cookie (`sc_admin`) |
| Payments | **PayFast** (ITN webhook, sandbox + live) |
| Deployment | **Vercel** (auto-deploy from GitHub main branch) |
| Font | Geist (via `next/font/google`) |

---

## 4. Project Structure

```
SkillConnect/
├── app/                          # Next.js App Router pages & API routes
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout (SA flag stripe, Navbar, Footer)
│   ├── globals.css               # Global Tailwind styles
│   ├── admin/                    # Admin dashboard
│   │   ├── page.tsx              # Full admin panel (tabs: jobs, commission, workers, approvals, partners, disputes)
│   │   └── login/page.tsx        # Admin login page
│   ├── api/                      # API route handlers
│   │   ├── admin/login/          # POST — admin login
│   │   ├── admin/logout/         # POST — admin logout
│   │   ├── impact/               # GET — live platform stats
│   │   ├── job-by-token/[token]/ # GET — fetch job by worker or client token
│   │   ├── jobs/                 # GET (list) / POST (create)
│   │   │   └── [id]/
│   │   │       ├── accept-quote/         # POST — client accepts worker's quote
│   │   │       ├── commission/           # POST — admin marks commission as paid
│   │   │       ├── complete/             # POST — admin marks job complete (sets value + commission)
│   │   │       ├── confirm-completion/   # POST — client confirms job done
│   │   │       ├── dispute/              # POST — client raises a dispute
│   │   │       ├── initiate-payment/     # POST — builds PayFast payment data, marks job payment_pending
│   │   │       ├── mark-worker-paid/     # POST — admin confirms worker EFT was sent
│   │   │       ├── quote/                # POST — worker submits a quote
│   │   │       ├── request-completion/   # POST — worker requests completion with photos
│   │   │       ├── resolve/              # POST — admin resolves a dispute
│   │   │       └── tokens/               # POST — generates worker + client accountability tokens
│   │   ├── partner/              # POST — partner enquiry submission
│   │   ├── payfast/notify/       # POST — PayFast ITN webhook (payment confirmation)
│   │   ├── reviews/              # POST — submit a review
│   │   └── workers/              # GET (list) / POST (register)
│   │       └── [id]/
│   │           ├── availability/ # POST — toggle worker availability
│   │           ├── status/       # POST — admin approve/reject worker
│   │           └── route.ts      # GET (single worker) / DELETE
│   ├── find-worker/page.tsx      # Client job request form
│   ├── how-we-verify/page.tsx    # Verification process explained
│   ├── impact/page.tsx           # Live platform impact stats
│   ├── job/
│   │   ├── client/[token]/       # Client job portal (view status, accept quote, trigger payment, dispute)
│   │   ├── worker/[token]/       # Worker job portal (submit quote, upload completion photos)
│   │   └── payment/
│   │       ├── success/          # PayFast return page on successful payment
│   │       └── cancel/           # PayFast return page on cancelled payment
│   ├── partner/page.tsx          # Partner enquiry form
│   ├── pitch/page.tsx            # Investor/stakeholder pitch deck page
│   ├── privacy/page.tsx          # Privacy policy
│   ├── register/page.tsx         # Worker registration form
│   ├── review/[jobId]/page.tsx   # Client submits a star rating for completed job
│   └── workers/
│       ├── page.tsx              # Browse/search workers directory
│       └── [id]/page.tsx         # Individual worker public profile
├── components/
│   ├── Footer.tsx                # Site footer
│   ├── LocationBadge.tsx         # "Sweetwaters, PMB" location pill
│   ├── Logo.tsx                  # SVG logo mark + wordmark (hex badge + interlocking rings)
│   ├── Navbar.tsx                # Sticky top navigation
│   ├── PrintButton.tsx           # Print trigger button
│   └── WorkerCard.tsx            # Reusable worker profile card
├── lib/
│   ├── adminAuth.ts              # HMAC session token generation + validation
│   ├── payfast.ts                # PayFast signature generation, payment data builder, ITN verification
│   ├── store.ts                  # All Supabase DB operations (workers, jobs, reviews)
│   ├── supabase.ts               # Supabase client initialisation
│   └── types.ts                  # TypeScript interfaces: Worker, JobRequest, Review, TimelineEvent
├── public/                       # Static assets (default Next.js SVGs)
├── supabase-accountability-migration.sql   # Migration: tokens, timeline, completion photos, dispute fields
├── supabase-payment-migration.sql          # Migration: banking details on workers, payment fields on jobs
├── PROJECT.md                    # ← This document
├── STAKEHOLDER_BRIEF.md          # Full platform vision and partnership strategy
├── next.config.ts                # Next.js config (10mb server action body limit)
├── package.json
└── tsconfig.json
```

---

## 5. Data Models

### Worker
```typescript
{
  id: string
  name: string
  phone: string
  trade: "Plumber" | "Electrician" | "Carpenter" | "Painter" | "Tiler" | "Builder" | "Welder" | "General Handyman"
  ward: string                         // e.g. "Ward 4"
  area: string                         // e.g. "Sweetwaters"
  yearsExperience: number
  bio: string
  photoUrl: string                     // selfie — used as profile picture
  idDocumentUrl: string                // copy of SA ID document
  workPhotos: string[]                 // portfolio photos
  tiktokUrl?: string
  rating: number                       // average from reviews (0–5)
  reviewCount: number
  tier: "New" | "Verified" | "Top Rated"
  jobsCompleted: number
  available: boolean                   // toggled by admin
  registeredAt: string                 // ISO date
  status: "pending" | "approved" | "rejected"
  // Banking (for EFT payout after job completion)
  bankName?: string
  accountNumber?: string
  accountType?: "current" | "savings"
  branchCode?: string
}
```

**Tier logic:**
- `New` — fewer than 3 reviews
- `Verified` — 3+ reviews
- `Top Rated` — 10+ reviews AND average rating ≥ 4.5

### JobRequest
```typescript
{
  id: string
  clientName: string
  clientPhone: string
  trade: Trade
  ward: string
  area: string
  description: string
  status: JobStatus                    // see Status Machine section
  matchedWorkerId?: string
  createdAt: string
  completedAt?: string
  jobValue?: number                    // final rand value entered by admin
  commissionRate: number               // default 10%
  commissionAmount?: number            // jobValue * commissionRate / 100
  commissionStatus: "none" | "awaiting" | "paid"
  photoUrl?: string                    // optional client photo of the problem
  quotedAmount?: number                // worker's quoted price
  scopeNotes?: string                  // worker's scope description
  completionNotes?: string             // worker's completion summary
  completionPhotos?: string[]          // before/after photos from worker
  disputeReason?: string
  disputeResolution?: string
  workerToken?: string                 // UUID — gives worker access to their portal
  clientToken?: string                 // UUID — gives client access to their portal
  timeline?: TimelineEvent[]           // append-only audit log
  paymentStatus?: "none" | "pending" | "received" | "settled"
  paymentId?: string                   // PayFast pf_payment_id
}
```

### Review
```typescript
{
  id: string
  jobId: string
  workerId: string
  rating: number     // 1–5
  comment: string
  reviewerName: string
  createdAt: string
}
```

### TimelineEvent
```typescript
{
  at: string         // ISO timestamp
  event: string      // e.g. "quote_submitted", "payment_received"
  by: "client" | "worker" | "admin" | "system"
  note?: string
}
```

---

## 6. Job Lifecycle (Status Machine)

```
pending
  └─► matched          (worker found by locality-first algorithm)
        └─► quoted         (worker submits price + scope notes)
              └─► accepted    (client accepts the quote)
                    └─► completion_requested   (worker uploads photos + notes)
                          ├─► payment_pending    (client initiates PayFast payment)
                          │     └─► completed      (PayFast ITN confirms payment received)
                          │           commissionStatus: awaiting → paid (after admin EFT to worker)
                          │           paymentStatus:   received  → settled
                          └─► disputed             (client disputes completion)
                                └─► completed | cancelled   (admin resolves)
```

**Timeline events logged at each transition:**
`links_generated` → `quote_submitted` → `quote_accepted` → `completion_requested` → `payment_initiated` → `payment_received` → `worker_paid` | `dispute_raised` → `dispute_resolved`

---

## 7. Payment Flow

### Client pays the platform (PayFast)

1. Job reaches `completion_requested` status
2. Client clicks "Pay Now" in their portal (`/job/client/[token]`)
3. Frontend calls `POST /api/jobs/[id]/initiate-payment`
4. Server builds PayFast payment data (merchant ID, amount, signature, return/cancel URLs with `clientToken`)
5. Job status updated to `payment_pending`
6. Frontend auto-submits an HTML form to `https://sandbox.payfast.co.za/eng/process` (or live URL in production)
7. Client completes payment on PayFast's hosted page
8. PayFast sends ITN (Instant Transaction Notification) to `POST /api/payfast/notify`
9. Webhook verifies:
   - Source IP is a known PayFast IP (production only)
   - MD5 signature matches
   - `payment_status === "COMPLETE"`
   - Amount received matches `quotedAmount` within R0.01
10. Job updated: `status: "completed"`, `payment_status: "received"`, `commission_status: "awaiting"`
11. Client redirected to `/job/payment/success?clientToken=...`

### Platform pays the worker (manual EFT)

1. Admin opens Commission tab in `/admin`
2. Jobs with `payment_status: "received"` show a **"Pay Worker"** button
3. Admin modal displays:
   - Client paid amount
   - Commission deducted
   - **Worker payout amount** (quotedAmount − commissionAmount)
   - Worker's **bank name, account number, account type, branch code**
   - WhatsApp link to notify worker of incoming payment
4. Admin manually performs EFT via their bank app
5. Admin ticks "I have transferred R___ to [worker]'s bank account"
6. Clicking "Confirm Payment" calls `POST /api/jobs/[id]/mark-worker-paid`
7. Job updated: `payment_status: "settled"`, `commission_status: "paid"`

> **Note:** Automated worker payouts via PayFast Payouts API are planned once the merchant account is fully approved and the Payouts feature is enabled.

### PayFast Credentials

| Environment | Merchant ID | Merchant Key | Notes |
|---|---|---|---|
| Sandbox (testing) | `10000100` | `46f0cd694581a` | Hardcoded fallback in `lib/payfast.ts` |
| Production (live) | Set in env vars | Set in env vars | Requires approved PayFast merchant account |

Sandbox is active when `NODE_ENV !== "production"` OR `PAYFAST_SANDBOX=true`.

---

## 8. Worker Lifecycle

```
Register (/register)
  └─► status: "pending"   (stored in Supabase, visible in Admin → Approvals tab)
        ├─► "approved"     (admin clicks Approve → worker visible in directory)
        └─► "rejected"     (admin clicks Reject → worker not visible)
```

**Worker registration collects:**
- Name, phone, trade, ward, area
- Years of experience, bio
- Selfie photo (profile picture)
- SA ID document photo
- Work portfolio photos (up to 5)
- TikTok URL (optional)
- Bank account details (for EFT payout)

**Worker tiers** are auto-calculated on every new review submission.

---

## 9. Pages & Routes

| URL | Purpose | Access |
|---|---|---|
| `/` | Homepage — hero, stats, trades grid, how it works, testimonials, CTA | Public |
| `/workers` | Browse all approved workers, filter by trade | Public |
| `/workers/[id]` | Individual worker public profile | Public |
| `/find-worker` | Client job request form | Public |
| `/register` | Worker registration form | Public |
| `/how-we-verify` | Explains verification process | Public |
| `/impact` | Live stats: total workers, jobs, ratings, commission earned | Public |
| `/partner` | Partner enquiry form (municipal, NGO, corporate CSI) | Public |
| `/pitch` | Investor/stakeholder pitch deck | Public |
| `/privacy` | Privacy policy | Public |
| `/job/client/[token]` | Client job portal — status tracking, quote acceptance, payment, dispute | Token-gated |
| `/job/worker/[token]` | Worker job portal — submit quote, upload completion evidence | Token-gated |
| `/job/payment/success` | Post-payment success screen (after PayFast redirect) | Public (token in URL) |
| `/job/payment/cancel` | Post-payment cancel screen | Public (token in URL) |
| `/review/[jobId]` | Client submits star rating for completed job | Public (linked via WhatsApp) |
| `/admin` | Full admin dashboard | Admin session cookie |
| `/admin/login` | Admin login | Public |

---

## 10. API Routes

### Workers
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/workers` | None | List all approved workers (`?all=1` includes pending/rejected — admin only) |
| POST | `/api/workers` | None | Register new worker (status: pending) |
| GET | `/api/workers/[id]` | None | Get single worker |
| DELETE | `/api/workers/[id]` | Admin | Delete worker |
| POST | `/api/workers/[id]/status` | Admin | Approve or reject worker |
| POST | `/api/workers/[id]/availability` | Admin | Toggle worker availability |

### Jobs
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs` | Admin | List all jobs |
| POST | `/api/jobs` | None | Create new job (runs locality-first worker matching) |
| POST | `/api/jobs/[id]/tokens` | Admin | Generate worker + client accountability tokens |
| POST | `/api/jobs/[id]/quote` | Token | Worker submits quote + scope notes |
| POST | `/api/jobs/[id]/accept-quote` | Token | Client accepts the quote |
| POST | `/api/jobs/[id]/request-completion` | Token | Worker submits completion notes + photos |
| POST | `/api/jobs/[id]/confirm-completion` | Token | Client confirms job is done |
| POST | `/api/jobs/[id]/initiate-payment` | Token | Builds PayFast form data, marks payment_pending |
| POST | `/api/jobs/[id]/dispute` | Token | Client raises a dispute |
| POST | `/api/jobs/[id]/resolve` | Admin | Admin resolves dispute (complete or cancel) |
| POST | `/api/jobs/[id]/complete` | Admin | Admin manually marks job complete with value + commission rate |
| POST | `/api/jobs/[id]/commission` | Admin | Mark commission as paid (legacy/manual flow) |
| POST | `/api/jobs/[id]/mark-worker-paid` | Admin | Mark worker EFT as sent (settles the job) |

### Other
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/job-by-token/[token]` | None | Fetch job by worker or client token |
| POST | `/api/payfast/notify` | PayFast IPs | PayFast ITN webhook — confirms payment |
| GET | `/api/impact` | None | Returns live stats (workers, jobs, avg rating) |
| POST | `/api/partner` | None | Submits partner enquiry |
| POST | `/api/reviews` | None | Submits a review for a completed job |
| POST | `/api/admin/login` | None | Admin login (sets `sc_admin` cookie) |
| POST | `/api/admin/logout` | None | Clears admin cookie |

---

## 11. Admin Panel

Located at `/admin` (requires `sc_admin` session cookie).

### Tabs

| Tab | Description |
|---|---|
| **Jobs** | All jobs with status badges. Actions: generate accountability links, notify worker/client via WhatsApp, mark complete, request review. |
| **Commission** | Completed jobs showing job value, commission earned, worker payout amount, worker bank details. "Pay Worker" button triggers the EFT confirmation modal. |
| **Workers** | All approved workers. Toggle availability, view full profile modal (ID doc, photos, bio), delete worker. |
| **Approvals** | Pending worker registrations. Approve or reject with one click. Badge shows count. |
| **Partners** | Incoming partner enquiries submitted via `/partner`. |
| **Disputes** | Disputed jobs. Resolve with a note and outcome (complete or cancel). Badge shows count. |

### Admin Authentication
- Username/password stored in environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- Session is a deterministic HMAC-SHA256 token stored in the `sc_admin` cookie
- Default credentials (dev only): `admin` / `SkillConnect2025!` — **change in production**

---

## 12. Database (Supabase)

### Tables

#### `workers`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| name | text | |
| phone | text | |
| trade | text | One of 8 trade values |
| ward | text | e.g. "Ward 4" |
| area | text | e.g. "Sweetwaters" |
| years_experience | int | |
| bio | text | |
| photo_url | text | Supabase Storage URL |
| id_document_url | text | Supabase Storage URL |
| work_photos | text[] | Array of Storage URLs |
| tiktok_url | text | Optional |
| rating | numeric | Recalculated on each review |
| review_count | int | |
| tier | text | "New" / "Verified" / "Top Rated" |
| jobs_completed | int | Incremented on each job completion |
| available | bool | |
| registered_at | date | |
| status | text | "pending" / "approved" / "rejected" |
| bank_name | text | Added by payment migration |
| account_number | text | Added by payment migration |
| account_type | text | "current" / "savings" |
| branch_code | text | SA bank branch code |

#### `jobs`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| client_name | text | |
| client_phone | text | |
| trade | text | |
| ward | text | |
| area | text | |
| description | text | |
| status | text | See status machine |
| matched_worker_id | uuid | FK → workers.id |
| created_at | timestamptz | |
| completed_at | date | |
| job_value | numeric | Final value, set by admin |
| commission_rate | numeric | Default 10 |
| commission_amount | numeric | Calculated: job_value * commission_rate / 100 |
| commission_status | text | "none" / "awaiting" / "paid" |
| photo_url | text | Optional client photo |
| quoted_amount | numeric | Worker's quoted price |
| scope_notes | text | Worker's scope description |
| completion_notes | text | Worker's completion summary |
| completion_photos | text[] | Before/after photos |
| dispute_reason | text | |
| dispute_resolution | text | |
| worker_token | text | UUID, unique |
| client_token | text | UUID, unique |
| timeline | jsonb | Array of TimelineEvent objects |
| payment_status | text | "none" / "pending" / "received" / "settled" |
| payment_id | text | PayFast pf_payment_id |

#### `reviews`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| job_id | uuid | FK → jobs.id |
| worker_id | uuid | FK → workers.id |
| rating | int | 1–5 |
| comment | text | |
| reviewer_name | text | |
| created_at | timestamptz | |

### Storage Buckets
| Bucket | Public | Usage |
|---|---|---|
| `job-photos` | Yes | Worker completion photos (before/after), uploaded from worker portal |

### Migrations
Run these in the Supabase SQL Editor in order:
1. `supabase-accountability-migration.sql` — adds tokens, timeline, completion fields, dispute fields, job-photos bucket
2. `supabase-payment-migration.sql` — adds banking details to workers, payment_status + payment_id to jobs

---

## 13. Environment Variables

Set these in Vercel (Production + Preview) and in a local `.env.local` file.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_BASE_URL` | Yes (prod) | Full site URL e.g. `https://skill-connect-black.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Same as above (used for live stats fetch on homepage) |
| `ADMIN_USERNAME` | Yes | Admin panel username |
| `ADMIN_PASSWORD` | Yes | Admin panel password |
| `ADMIN_SESSION_SECRET` | Yes (prod) | Random secret for HMAC session token |
| `PAYFAST_MERCHANT_ID` | Yes (prod) | PayFast merchant ID (get from PayFast dashboard) |
| `PAYFAST_MERCHANT_KEY` | Yes (prod) | PayFast merchant key |
| `PAYFAST_PASSPHRASE` | Recommended | PayFast passphrase for extra security |
| `PAYFAST_SANDBOX` | Optional | Set to `"true"` to force sandbox mode in production |

> **Sandbox fallback:** If `PAYFAST_MERCHANT_ID` is not set, the code falls back to sandbox credentials `10000100` / `46f0cd694581a`. Never rely on this in production.

---

## 14. External Services & Accounts

| Service | Purpose | Status |
|---|---|---|
| **GitHub** | Source code hosting — [github.com/Sabelo-K/SkillConnect](https://github.com/Sabelo-K/SkillConnect) | Active |
| **Vercel** | Hosting + auto-deploy from GitHub main branch | Active — [skill-connect-black.vercel.app](https://skill-connect-black.vercel.app) |
| **Supabase** | PostgreSQL database + file storage | Active |
| **PayFast** | Payment gateway (client → platform) | Pending — merchant account application submitted 2026-05-16 |
| **Google Business Profile** | Business listing for SkillConnect — Sweetwaters, SA | Created 2026-05-16, pending Google verification (up to 5 days) |
| **Gmail** | Platform email account | Created 2026-05-16 |
| **WhatsApp** | Primary communication channel for workers and clients | Active — +27 67 946 7770 |

---

## 15. Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/Sabelo-K/SkillConnect.git
cd SkillConnect

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env.local file with the variables listed in Section 13

# 4. Run the development server
npm run dev

# 5. Open http://localhost:3000
```

**Admin panel:** Go to `/admin/login` and use the credentials from your `.env.local`.

---

## 16. Deployment

- **Platform:** Vercel
- **Auto-deploy:** Every push to the `main` branch on GitHub triggers a Vercel build and deploy automatically
- **Live URL:** [https://skill-connect-black.vercel.app](https://skill-connect-black.vercel.app)
- **Build command:** `next build` (default)
- **Node version:** 20.x (Vercel default)

To deploy manually: push to GitHub — Vercel handles the rest.

---

## 17. Feature Status

### Completed ✅

| Feature | Description |
|---|---|
| Homepage | Hero, live stats, trade grid, how it works, testimonials, CTA |
| Worker directory | Browse, filter by trade, individual profiles |
| Worker registration | Full form with photo upload, ID doc, work portfolio, banking details |
| Worker approval | Admin reviews pending registrations and approves/rejects |
| Job request | Client submits trade + location + description |
| Locality-first matching | Same ward first, falls back to same area |
| Accountability portal (worker) | Token-gated: submit quote, upload completion photos |
| Accountability portal (client) | Token-gated: accept quote, trigger payment, confirm completion, dispute |
| PayFast payment integration | Signature generation, hosted payment form, ITN webhook |
| Payment success/cancel pages | Redirect back to client portal via clientToken |
| Worker payout flow | Admin sees bank details + payout amount, manually sends EFT, confirms in app |
| Commission tracking | Admin commission tab with outstanding/collected totals |
| Dispute resolution | Client disputes → admin resolves with notes and outcome |
| Review system | Star ratings + comments, auto-recalculates worker rating + tier |
| Admin dashboard | Full management panel with 6 tabs |
| Admin authentication | HMAC session cookie |
| Impact page | Live stats pulled from database |
| Partner enquiry | Form for municipal/NGO/corporate partnerships |
| Logo | Hexagonal SA-flag-accented badge with interlocking rings + wordmark |
| Google Business Profile | Created, pending verification |
| PayFast merchant application | Submitted 2026-05-16, awaiting approval |

### In Progress 🔄

| Feature | Description |
|---|---|
| PayFast merchant account | Application submitted — awaiting approval email from PayFast |
| Google Business Profile verification | Up to 5 days for Google to verify |

### Planned / Next Steps 📋

| Feature | Description |
|---|---|
| Automated worker payouts | Use PayFast Payouts API to auto-transfer worker earnings once merchant account is approved with Payouts enabled |
| Platform logo on Google Business Profile | Upload logo once created |
| Custom domain email | e.g. `hello@skillconnect.co.za` (upgrade to Google Workspace when revenue allows) |
| Worker mobile notifications | WhatsApp API or SMS when a job is matched to them |
| Expand service areas | Add Msunduzi Municipality wards beyond Sweetwaters |
| Worker onboarding improvements | In-app bank detail capture for workers who didn't provide it during registration |

---

## 18. Known Issues & Next Steps

| Issue | Impact | Fix |
|---|---|---|
| PayFast live credentials not yet in Vercel env vars | Payments use sandbox (test) mode | Add `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE` once PayFast approves merchant account |
| `ADMIN_SESSION_SECRET` should be set to a strong random value in production | Admin sessions could theoretically be forged if using the default `dev-secret` | Set a real secret in Vercel environment variables |
| `ADMIN_PASSWORD` default is hardcoded in `adminAuth.ts` as fallback | Anyone who knows the default password can access admin if env var not set | Ensure `ADMIN_PASSWORD` is set in Vercel and never left as default |

---

*Update this document whenever a feature is completed, a new service is integrated, or the business model changes.*
