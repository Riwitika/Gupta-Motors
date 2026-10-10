# Gupta Motors — Dealership & Service ERP Management Platform

An enterprise-grade web application and dealership ERP system built for **Gupta Motors**, an authorized multi-category motorcycle dealership and service centre located in Kurawali, Mainpuri, Uttar Pradesh.

---

## 1. Dealership Profile

- **Business Name**: Gupta Motors
- **Proprietor**: Vishal Gupta
- **Showroom & Workshop Address**: G.T. Road, Kurawali, Mainpuri, Uttar Pradesh — 205265
- **Direct Helpline**: +91 94100 43111 (9410043111)
- **Services Offered**: New motorcycle sales, genuine OEM spare parts, computerized diagnostics, periodic servicing, and repairs.

---

## 2. Technology Stack

- **Frontend Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with custom motorcycle dealership tokens (warm ivory surfaces, deep charcoal typography, restrained crimson accents, crisp stone borders)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth)
- **Hosting / Deployment Target**: Vercel

---

## 3. Project Architecture

```
gupta-motors/
├── index.html                  # HTML entry point with fonts & metadata
├── vite.config.ts              # Vite configuration with @ path alias
├── tsconfig.json               # TypeScript compiler configuration
├── tailwind.config.js          # Dealership theme tokens (ivory, charcoal, crimson)
├── postcss.config.js           # PostCSS plugins
├── .env.example                # Supabase environment variables template
├── .gitignore                  # Git ignore rules for node_modules, build, secrets
├── src/
│   ├── main.tsx                # React DOM mounting & BrowserRouter
│   ├── App.tsx                 # Route definitions (Public & Admin)
│   ├── index.css               # Tailwind directives & base styles
│   ├── constants/
│   │   └── business.ts         # Dealership profile, address, phone & nav links
│   ├── services/
│   │   └── supabase.ts         # Supabase client setup with safe fallbacks
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── components/
│   │   └── layout/
│   │       ├── PublicLayout.tsx # Customer-facing header, navigation & footer
│   │       └── AdminLayout.tsx  # Information-dense ERP back-office layout
│   └── pages/
│       ├── public/             # Public routes (Home, Bikes, Offers, About, etc.)
│       ├── auth/               # Employee login portal
│       ├── admin/              # Admin ERP placeholders (Dashboard, CRM, Service, etc.)
│       └── NotFound.tsx        # 404 page
└── README.md
```

---

## 4. Route Map

### Customer Portal (Public)
| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/` | Home | Dealership overview, pillars, and hero intro |
| `/bikes` | Motorcycles | Motorcycle models, variants & showroom stock |
| `/offers` | Offers | Festive bonuses, financing schemes & promotions |
| `/service-booking` | Service Booking | Workshop appointment scheduling |
| `/spare-parts` | Spare Parts | OEM parts search & request |
| `/about` | About Us | Dealership history & credentials |
| `/contact` | Contact Us | Location, timing, and phone support |

### Authentication
| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/login` | Staff Login | Secure portal for dealership employees |

### Back-Office ERP (Protected Placeholders)
| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/admin/dashboard` | Dashboard | Operations overview & key metrics |
| `/admin/sales-crm` | Sales CRM | Lead pipeline, test rides & quotations |
| `/admin/service-centre` | Service Centre | Workshop job cards & bay allocations |
| `/admin/inventory` | Inventory | Vehicle chassis ledger & spare parts stock |
| `/admin/pos-billing` | POS & Billing | Retail invoicing & workshop billing |
| `/admin/reports` | Reports | Business analytics & sales performance |
| `/admin/employees` | Staff Management| Employee roles & credential assignments |

---

## 5. Prerequisites

- **Node.js**: Version `18.x` or later (tested on Node `22.x`)
- **Package Manager**: `npm` (comes with Node.js) or `pnpm` / `yarn`
- **Git**: Installed locally

---

## 6. Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd "/Users/apple/Downloads/Gupta Motors"
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to create your local environment file:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase project credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
   ```
   *Note: Never commit `.env.local` or expose any `service_role` keys in client-side code.*

---

## 7. Development & Production Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local development server at `http://localhost:5173` |
| `npm run build` | Compiles TypeScript (`tsc`) and builds optimized production bundle via Vite (`dist/`) |
| `npm run preview` | Locally serves the production build from `dist/` |

---

## 8. Git Workflow & Repository Rules

- **Local Repository Isolation**: The repository is isolated inside `Gupta Motors` and detached from any parent directories.
- **Branch**: Default development branch is `main`.
- **Security Policy**: `.gitignore` strictly blocks all `.env` files, build output, secrets, operating system artifacts, and temporary scratch files from being tracked.
- **Remote Policy**: Remote repositories and pushing are governed by explicit confirmation to avoid accidental pushes.
