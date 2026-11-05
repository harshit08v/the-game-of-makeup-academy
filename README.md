# THE GAME OF MAKEUP — ACADEMY MANAGEMENT SUITE

> **Premium Editorial SaaS Academy Management System for Professional Makeup & Beauty Institutions**  
> *Client-Facing Interactive Demonstration*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Commercial%20Demo-C5A16F)](#)

---

## 1. Project Overview & Aesthetic Philosophy

**THE GAME OF MAKEUP: ACADEMY MANAGEMENT SUITE** is a full-featured commercial SaaS platform tailored for luxury beauty academies, high-fashion artistry institutes, and bridal masterclasses.

Rather than resembling a generic AI-generated admin template with purple gradients and bubbly cards, this application was architected with a **refined editorial luxury aesthetic**:
- **Warm Ivory Backgrounds**: Soft ivory canvas (`#FAF8F5`) creating high contrast with white elevation cards.
- **Charcoal Typography**: High-legibility charcoal tones (`#171615`, `#242322`, `#5C554F`) paired with serif headline elegance (*Playfair Display*) and clean functional body (*Inter*).
- **Muted Champagne-Gold Accents**: Subtle champagne-gold (`#C5A16F`, `#B08A56`) highlights for active pills, verified stamps, and focal badges.
- **Hairline Borders**: Clean 1px micro-borders (`#EAE4DC`, `#DFD7CC`) with soft luxury shadows.
- **Zero AI Gradients or Emojis**: Clean iconography provided strictly by Lucide React.
- **100% Interactive**: Every major button, modal, form validation, ledger entry, and batch capacity check is fully wired to local state with `localStorage` persistence.

---

## 2. Portals & Architecture

The application provides a seamless **Dual-Portal Role Switcher** accessible directly from the persistent navigation bar:

### 🏛️ Admin Management Portal
Comprehensive console for academic registrars, finance teams, and studio directors:
1. **Overview Dashboard**: Real-time metrics calculated dynamically from live state (Total students, active admissions, pending reviews, collected fees, outstanding balances, active cohorts). Includes interactive Recharts revenue charts, payment channel splits, recent inquiries, recent receipts, and batch capacity meters.
2. **Admissions Management**: Full lifecycle management of candidate applications (New, Approved, Enrolled, Rejected). Form validation, fee validation, counselor notes, and one-click conversion of approved applicants into active students with automatic ID assignment and batch roster updates.
3. **Student Directory**: Multi-criteria search (name, ID, phone, city) and filtering. Full student profile drawer with 3 tabs (Overview, Fee Ledger & History, Cohort Allocation). Edit student info and transfer students between cohorts with live batch capacity enforcement.
4. **Fees & Payments**: Institutional bursar console with financial metrics (Total Billed, Collected, Scheduled, Overdue). Record simulated partial installments with instant generation of printable luxury electronic receipts.
5. **Batch Management**: Cohort scheduler with lead trainer assignment, class schedules, studio room allocations, and capacity guards that reject over-enrollment.
6. **Course Management**: Catalog of certified academy courses (*Master Bridal Makeup & Hair Artistry*, *Professional Makeup & Glam Artistry*, *Advanced Editorial & Fashion Makeup*, *Personal Self Makeup*, *Airbrush Makeup Specialist*).
7. **Reports & Intelligence**: Cross-sectional analytics with visual charts and **CSV export** for Course Enrollment statements, Batch Occupancy reports, and the Master Fee Audit register.
8. **Settings & Billing Config**: Academy branding coordinates, GSTIN tax registration, receipt numbering prefix, electronic receipt disclaimer notes, and a **One-Click Demo Reset** to restore default seeds anytime.

### 💄 Student Experience Portal
Personalized portal showing only the selected candidate's record:
1. **My Overview**: Welcome greeting, next session details, assigned cohort, fee settlement progress bar, kit allotment status, and attendance rate.
2. **My Course**: Complete syllabus curriculum modules breakdown, trainer credentials, studio lab room, and qualification diploma title.
3. **My Fees**: Complete tuition statement, breakdown of paid vs remaining balance, payment receipt history, and an interactive **Simulate Installment** dialog.
4. **My Profile**: Personal details, editable phone/email/city, emergency contact information, and an interactive **Demo Student Persona Switcher** allowing instant testing from different students' vantage points.

---

## 3. Printable Electronic Fee Receipts

Clicking on any receipt number across the Admin Fees ledger, Student Profile drawer, or Student Portal triggers the **Official Electronic Bursar Receipt**:
- Academy header with GSTIN registration and Bandra West campus address
- Student details, student registration ID, course, and cohort
- Line-item tuition breakdown and notes
- Amount received in Indian Rupees (₹) and remaining outstanding dues
- Official bursar signature seal and simulation disclaimer
- **Print Receipt**: Uses `@media print` CSS rules so that clicking "Print Receipt" renders only the crisp receipt document, hiding all navigation and chrome.

---

## 4. Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.6 (Strict type safety, zero `any` shortcuts)
- **Styling**: Tailwind CSS 3.4 with custom ivory, champagne-gold, and charcoal color extensions
- **Charts**: Recharts 2.13 (Bar charts, pie charts, custom tooltips)
- **Icons**: Lucide React 0.453
- **State & Persistence**: React Context API with automatic synchronization to `localStorage` (`the_game_of_makeup_v1_*`)
- **Typography**: Playfair Display (Headings) + Inter (Interface) via `next/font/google`

---

## 5. Seeded Demo Data (Indian Rupee ₹)

The system is pre-seeded with 12 realistic fictional students, active cohorts, and varied financial statuses:
- **Natasha Roy** (`GOM-2025-001`): Bridal Masterclass — Fully Paid (₹75,000)
- **Ananya Sharma** (`GOM-2025-002`): Pro Artistry — Partial Payment (₹50,000 paid / ₹85,000 total)
- **Priya Kapoor** (`GOM-2025-003`): Pro Artistry Executive Weekend — Fully Paid (₹85,000)
- **Sneha Reddy** (`GOM-2025-004`): Editorial Express — Partial Payment (₹25,000 paid / ₹50,000 total)
- **Simran Kaur** (`GOM-2025-005`): Self Glam Sprint — Graduated / Completed (₹25,000)
- **Tanvi Verma** (`GOM-2025-006`): Airbrush Intensive — Overdue Balance (₹10,000 paid / ₹30,000 overdue)
- **Divya Patel** (`GOM-2025-007`): Bridal Masterclass — Partial Payment (₹40,000 paid / ₹75,000 total)
- **Mehak Malhotra** (`GOM-2025-008`): Pro Artistry — Fully Paid (₹85,000)
- **Ritu Deshmukh** (`GOM-2025-009`): Editorial Express — Partial Payment (₹30,000 paid / ₹50,000 total)
- *Additional fresh applications in "New" and "Approved" status ready for conversion.*

---

## 6. Local Setup & Running Instructions

### Prerequisites
- Node.js `v18.17+` or `v20+` (tested on Node `v24.18.0`)
- npm `v9+` or `v10+`

### Installation
```bash
# Clone or open the project folder
cd "c:\Users\harsh\OneDrive\Desktop\game of makeup"

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Execution
```bash
# Type check and build optimized bundle
npm run build

# Start production server
npm run start
```

---

## 7. Deployment Instructions (GitHub & Vercel)

### Deploy to GitHub
1. Create a new repository on [GitHub](https://github.com/new) named `the-game-of-makeup-academy`.
2. Push your local repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/the-game-of-makeup-academy.git
   git push -u origin main
   ```

### Deploy to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your imported GitHub repository.
3. Framework Preset: **Next.js** (automatically detected).
4. Root Directory: `./`
5. Click **"Deploy"**. No environment variables or third-party API keys are required!

---

## 8. Quality & Verification Log

- [x] **TypeScript Compilation**: `npx tsc --noEmit` passed with 0 errors.
- [x] **Production Build**: `npm run build` compiled all routes statically (`139 kB` first load JS).
- [x] **Server Health Check**: Local production server running at `http://localhost:3000` returning `HTTP 200 OK`.
- [x] **Responsive Mobile Layout**: Tested collapsible sidebar drawer with zero horizontal overflow.
- [x] **Client Persistence**: State persists across page refreshes via `localStorage` with a 1-click restore button.
- [x] **Disclaimer Compliance**: Prominent `"DEMO ENVIRONMENT — SAMPLE DATA ONLY"` banners and simulated payment notices.

---
© THE GAME OF MAKEUP. Academy Management Suite. Designed for Luxury Beauty Institutions.
