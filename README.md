# Product Admin Dashboard

This is a frontend assignment to build a product admin dashboard. It uses React, Vite, Tailwind CSS, and Axios to interface with the DummyJSON API.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rohiitbagal/admin-dashboard.git
   cd admin-dashboard
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features Completed
- [x] **Login Page**: Authenticates against `POST /auth/login` using credentials `emilys` / `emilyspass`. Handles loading and error states.
- [x] **Protected Routes**: Redirects unauthenticated users to `/login`.
- [x] **Product List**: Responsive layout (Table on Desktop, Cards on Mobile). Shows image, title, category, price, rating, stock.
- [x] **Pagination**: Server-side pagination with URL synchronization (`?page=x&limit=y`). Allows dynamic page sizes (10, 20, 50).
- [x] **Search & Filter**: Debounced search synced with the URL (`?q=xxx`). Category filtering synced with URL.
- [x] **Sorting**: Sort by price, rating, or title.
- [x] **Product Details**: Dedicated page `/products/[id]` showing images, descriptions, and reviews. Handles 404s gracefully.
- [x] **CRUD Operations**: Add, edit, and delete functionality implemented via modals with local state updates (fake persistence).
- [x] **Centralized Axios**: Shared setup in `src/services/api.js` for tokens and error handling.

## Architectural Notes & Edge Cases Handled

### 1. Framework Choice (React + Vite)
While the assignment mentioned Next.js, this project was scaffolded using pure React + Vite with React Router for an SPA approach, ensuring all assignment rules regarding manual logic (no React Query/SWR) were strictly followed using custom hooks.

### 2. Search & Category Mutual Exclusivity
**Challenge**: The DummyJSON API does not support simultaneously passing a search query (`/search?q=`) and a category filter (`/category/[name]`).
**Solution**: We made them mutually exclusive in the UI. If a user selects a category, the search bar is cleared. If a user types in the search bar, the category filter is temporarily disabled and the category is stripped from the URL. This ensures the user is never confused by an empty API response caused by combining unsupported parameters.

### 3. Fast Typing & Race Conditions (Debouncing)
**Challenge**: Rapidly typing in the search bar could cause multiple API calls to overlap, potentially resulting in an older request resolving *after* a newer one.
**Solution**: We built a custom `useDebounce` hook that waits 500ms after the user stops typing before modifying the URL and triggering the fetch. Inside the `useProducts` hook, we utilize an `AbortController` to immediately cancel any pending Axios request when a new dependency (like the search term) changes.

### 4. Fake Persistence (Add/Edit/Delete)
**Challenge**: DummyJSON acknowledges POST/PUT/DELETE requests but does not actually save the data to the server.
**Solution**: We maintain a `localProducts` state within the `Products` component. When a successful response is received from the API for an Add/Edit/Delete action, we manually mutate this local state (e.g., prepending a new product, or mapping over the array to update an edited one) so the user sees immediate feedback without needing to refresh. *Note: Because pagination requests fetch fresh server data, navigating between pages will reset these local mutations.*

### 5. URL Tampering
**Challenge**: Users typing `?page=abc` or `?limit=999`.
**Solution**: URL parameters are strictly parsed as integers on mount. If they are `NaN` or fall outside acceptable ranges (e.g., limit isn't 10, 20, or 50), they gracefully fallback to safe default values (`page=1, limit=10`).

## AI Assistance
AI was used in this project primarily as a pair-programming partner to scaffold the Vite environment, configure the Tailwind v4 integration, and quickly generate boilerplate UI components (like the Tailwind Table and Modal). The architectural decisions regarding the `AbortController`, debouncing logic, and URL state synchronization were designed collaboratively to ensure all assignment constraints were explicitly met.
