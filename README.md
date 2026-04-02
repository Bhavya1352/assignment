# Zorvyn Frontend Assessment — Finance Dashboard

A professional-grade, highly-responsive frontend finance dashboard built as a submission for the Frontend Developer Intern role at Zorvyn. This application demonstrates advanced frontend competencies including complex state management, custom theming, responsive grid layouts, and meaningful data visualization without relying heavily on bloated component libraries.

---

## 🎯 Evaluation Highlights & Technical Decisions

I purposefully approached this assignment intending to demonstrate proficiency in core React and modern CSS rather than simply glueing together external template libraries. 

Here are the specific architectural choices made to meet the evaluation criteria:

### 1. Architectural & State Management Approach (Score Driver: Technical Quality)
- **Why no Redux/Zustand?** For an application of this scale, an external state library is overkill and increases bundle size. I implemented a robust `useReducer` pattern coupled with `useContext` (`FinanceContext.jsx`). This elegantly centralizes the complex logic needed for:
  - Role-Based Access Control (RBAC) toggles
  - Global filter algorithms
  - Light/Dark mode theming
  - Active tab navigation
  - Add/Update/Delete transaction payloads
- **Real-world Simulation**: I implemented an `isLoading` initialization sequence accompanied by a CSS-animated `SkeletonLoader`. Instead of data popping in instantly, the app simulates a mock asynchronous API fetch.

### 2. Design, Aesthetics, & CSS (Score Driver: Design & Creativity)
- **No Tailwind / No MUI**: I built the entire UI using pure CSS (with CSS variables) to showcase deep understanding of fundamental styling.
- **Glassmorphism & Theming**: The application features a deeply integrated Light/Dark mode. The variables dynamically shift background blurs, text contrasts, and border transparencies. 
- **Polished Animations**: Navigation, sorting, and modal openings utilize CSS `keyframes` and `transitions` for a premium, snappy feel perfectly suited for modern SaaS dashboards.

### 3. Core Requirements Met
- ✅ **Dashboard Overview**: Implemented real-time aggregate charts using `recharts` for visual balance trending (React AreaChart) and categorical spending (React PieChart).
- ✅ **Transactions Section**: A fully featured data-table capable of composite searching, sorting, and filtering by Type/Date/Category.
- ✅ **Insights Section**: Complex mathematical derivations tracking Savings Rate, Highest Spend Categories, and Month-over-Month comparison logic seamlessly updated via `useMemo` hooks.
- ✅ **Role Based UI**: Toggling the "Admin/Viewer" switch instantly mounts/unmounts Edit, Delete, and Add Transaction components natively simulating RBAC logic on the frontend.

## 🚀 Getting Started

This project is built using **Vite + React**. 

### Prerequisites
- Node.js installed

### Installation

1. **Clone the repository** (or extract the directory):
   ```bash
   cd finance-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **View in Browser**:
   Open [http://localhost:5173/](http://localhost:5173/) to see the application.

---

## 💼 Application Structure

- `/src/components` - Modularized React components broken down by Domain (Dashboard, Transactions, Insights).
- `/src/context` - The central `useReducer` Hub.
- `/src/data` - The `mockData.js` engine simulating 4 months of transactions to give the application highly realistic, tangible data.
- `/src/utils` - Extracting complex calculations, dataset formatting, and CSV/JSON export handlers.
- `index.css` - The global stylesheet governing all layout mathematics, design tokens, and CSS variable theming logic.

---

*Thank you for taking the time to review this submission!*
