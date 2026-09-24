# Nexus Product Admin Dashboard

An enterprise-grade, production-ready Product Management Admin Dashboard built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Axios**, and **DummyJSON API**.

---

## 🚀 Live Demo & Features

### 1. Authentication & Route Protection
- **Credentials**: Pre-configured for `emilys` / `emilypass` (with one-click auto-fill on the login screen).
- **Endpoint**: `POST /auth/login` via DummyJSON.
- **Session Handling**: JWT token and user profile are saved and automatically restored from `localStorage`.
- **Protected Routes**: Custom `AuthGuard` validates admin sessions and redirects unauthenticated visits to `/login?callbackUrl=...`, while authenticated users are redirected straight to `/products`.
- **Automatic 401 Interception**: Axios response interceptor dispatches an event on 401 status to immediately log out expired sessions with user-friendly toast feedback.

### 2. Centralized Axios Architecture
- **Single Instance**: Defined in `src/lib/api/axiosInstance.ts` with configurable `baseURL` (`NEXT_PUBLIC_API_BASE_URL`).
- **Request Interceptor**: Seamlessly attaches `Authorization: Bearer <token>` to all authenticated requests.
- **Response Interceptor**: Formats API error messages into standard typed JavaScript errors.
- **Request Cancellation**: Integrates `AbortController` signals to cancel previous in-flight requests and prevent out-of-order race conditions on fast typing or rapid filtering.

### 3. High-Density Product Inventory View
- **Dual Responsive Layout**:
  - **Desktop**: Full data table with sortable column headers, badges, image thumbnails, hover states, and action triggers.
  - **Mobile**: Touch-optimized card list with quick actions and badges.
- **Server Pagination**:
  - Calculates `limit` and `skip` parameters (`skip = (page - 1) * limit`).
  - Dynamic page size selector: **10**, **20**, **50** per page.
  - Formatted status: *"Showing X–Y of Z products"*.
  - Smart sliding window page numbering with First, Previous, Next, and Last buttons.
- **Debounced Search**:
  - 400ms debounce on search input with instant clear button and loading indicator.
  - Queries `GET /products/search?q=...` and resets to page 1.
- **Category Filtering & Multi-field Sorting**:
  - Dynamic category dropdown loaded from `GET /products/categories`.
  - Sorting support for Title (A-Z, Z-A), Price (Low-High, High-Low), Rating (High-Low), and Stock.

### 4. URL Query Parameter Synchronization
- All filter states (`search`, `category`, `sortBy`, `order`, `page`, `limit`) are synchronized in the URL query string (`/products?search=phone&category=smartphones&sortBy=price&order=asc&page=1&limit=10`).
- **Robust Parameter Sanitization**: Query parameters like `?page=abc`, `?page=-5`, or `?limit=9999` are automatically clamped and sanitized to safe defaults without crashing or throwing errors.
- Bookmarking or sharing URLs restores the exact dashboard view.

### 5. Detailed Product View (`/products/[id]`)
- Interactive multi-image gallery with thumbnail preview strip.
- Breadcrumb navigation (`Dashboard > Category > Product Title`).
- Price comparison with original price calculation, discount percentage badge, and savings estimate.
- Inventory gauge bar with low stock and out-of-stock indicators.
- Technical dimensions (Width, Height, Depth, Weight), shipping details, warranty information, and return policies.
- Customer review list with star ratings, reviewer avatars, verified buyer badges, and dates.
- Polished **Not Found state** for invalid IDs (e.g. `/products/999999` or `/products/invalid-id`).

### 6. Add & Edit Product Forms
- Modal interface with client-side validation rules:
  - Title (required, min 3 characters)
  - Description (required, min 10 characters)
  - Price (required, positive decimal number)
  - Discount Percentage (0–100%)
  - Stock (required, non-negative whole integer)
  - Category (required selection)
  - Brand (required)
  - Thumbnail URL (URL validation with preview)
- Instant inline error messages and disable state during submission.

### 7. Delete Product with Confirmation
- Modal confirmation dialog displaying product thumbnail and SKU to prevent accidental deletion.
- Loading indicator during deletion and immediate UI feedback.

---

## 💡 Key Design Decisions & API Limitations

### 1. DummyJSON API Search + Category Limitation
**Observation**: The DummyJSON API does not provide a single endpoint that natively combines server-side full-text search with category filtering (e.g. `/products/search?q=phone&category=smartphones` ignores the category filter).
**Architecture Decision**:
- When both `search` and `category` are specified, the dashboard queries the search endpoint and applies category filtering client-side on the returned dataset.
- The UI renders a subtle informational pill informing the user that search and category have been combined smoothly.

### 2. DummyJSON Mock Mutation Persistence
**Observation**: DummyJSON's `POST /products/add`, `PUT /products/[id]`, and `DELETE /products/[id]` endpoints simulate responses but do not mutate the remote database.
**Architecture Decision**:
- Built a **Hybrid Client Store** (`ProductStoreContext`) that layers local additions, updates, and deletions on top of server data.
- Newly created products are assigned a unique local ID and highlighted with a **"NEW"** badge.
- Edited products show an **"UPDATED"** badge.
- Deleted products are instantly hidden from tables, cards, and detail pages.
- A **"Reset Mock Data"** button in the sidebar allows developers and reviewers to restore pristine server data at any time.

---

## 🛠️ Tech Stack & Architecture

```
src/
├── app/                      # Next.js App Router pages
│   ├── login/page.tsx        # Login page with demo credentials
│   ├── products/page.tsx     # Main dashboard & product list
│   ├── products/[id]/page.tsx# Product detail view
│   ├── not-found.tsx         # Global 404 page
│   ├── error.tsx             # Global error boundary
│   ├── globals.css           # Tailwind CSS & custom styles
│   └── layout.tsx            # Root layout with context providers & Sonner Toaster
├── components/
│   ├── layout/               # AppLayout, Sidebar, Header, AuthGuard
│   ├── products/             # ProductTable, ProductCardList, ProductFilters, ProductStats, ProductFormModal, DeleteConfirmModal, ProductImageGallery, ProductReviewList
│   └── ui/                   # Reusable UI primitives (Button, Input, Select, Badge, Modal, Card, Skeleton, EmptyState, ErrorState, StarRating, Breadcrumb, Pagination)
├── context/                  # AuthContext, ProductStoreContext, ThemeContext
├── hooks/                    # useAuth, useProducts, useProductDetails, useProductForm, useDebounce
├── lib/
│   ├── api/                  # axiosInstance, authService, productService
│   └── utils.ts              # cn helper, formatters, sanitizers
└── types/                    # TypeScript interfaces for Auth & Products
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js `v18.17+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd product-admin-dashboard

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file (or use default `.env.example`):
```env
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

### 4. Running Locally
```bash
# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Linting
```bash
# Type check and build for production
npm run build

# Run ESLint
npm run lint
```

---
