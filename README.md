# CampusFunds 🎓 — Smart Budget & Finance Tracker for Students

A modern, responsive, and student-focused financial management web application built with clean HTML5, Vanilla CSS (Glassmorphism design system), and JavaScript.

---

## 🌟 Why Student Budgeting Matters (Presentation & Project Points)

When presenting this web development project for college/university evaluations, submissions, or portfolio reviews, here are the key selling points to highlight:

### 1. The Core Problem It Solves
- **Irregular Inflow**: Unlike salaried professionals, students juggle pocket money allowances, semester scholarships, part-time campus jobs, and freelancing.
- **Micro-Spends Add Up**: Small, frequent canteen lunches, coffee runs, stationary, and ride-shares silently drain student bank accounts before the month ends.
- **The "Broke by Day 20" Syndrome**: Most students spend heavily at the beginning of the month and run out of funds 10 days before their next allowance.
- **Shared Roommate Expenses**: Splitting groceries, mess food, Wi-Fi, and outing bills with friends often causes confusion and awkward reminders.

---

## 🚀 Key Features Implemented

### 1. 💡 "Daily Safe-to-Spend" Algorithm (Student Superpower)
- Instead of showing just a monthly remaining balance, the app calculates:
  $$\text{Daily Safe-to-Spend} = \frac{\text{Net Remaining Balance}}{\text{Remaining Days in Current Month}}$$
- Gives students an immediate, actionable daily limit so they never run out of money before month-end.
- Dynamically highlights in **Green** (Safe), **Amber** (Tight budget), or **Red** (Over budget).

### 2. 🍔 Student-Centric Expense & Income Categorization
- **Expenses**:
  - `🍔 Canteen & Food` (Mess, canteen snacks, coffee)
  - `📚 Tuition & Books` (Textbooks, exam registration, notebooks)
  - `🏠 Hostel & Rent` (Dorm fees, PG rent, utilities)
  - `🚌 Commute & Travel` (Metro pass, bus fares, fuel)
  - `🎉 Hangouts & Parties` (Movies, outings, celebrations)
  - `📱 Subscriptions & Tech` (Student Spotify, Prime, internet)
  - `👕 Shopping & Self-care`
  - `🩹 Health & Medical`
- **Incomes**:
  - `💰 Monthly Allowance` (Parents/guardians)
  - `💼 Part-time / Campus Job`
  - `🎓 Scholarship & Grants`
  - `💻 Freelance & Side Hustles`

### 3. 📊 Visual Analytics & Interactive Donut Chart
- Zero-dependency Retina Canvas donut chart showing percentage expense distribution.
- Real-time legend breakdown with color indicators and percentage share.

### 4. ⚠️ Category Spending Limits & Alert Progress Bars
- Set maximum spending caps per category (e.g., Canteen max $150/month).
- Dynamic progress indicators that turn **amber at 80%** and **pulsing red at 100%+** when exceeding limits.

### 5. 🎯 Gamified Savings Goals (Piggy Bank)
- Target tracker for student goals (e.g., *MacBook for Coding*, *Semester Trip*, *Emergency Fund*).
- Visual progress bar with instant "Add Funds" deposit modal and celebratory feedback upon completion.

### 6. 🍕 Roommate & Group Bill Splitter (IOU Calculator)
- Quickly split restaurant checks, pizza parties, or apartment utilities.
- Supports friend names, custom tips, and calculates each roommate's exact share.
- **1-Click "Add My Share"**: Automatically records your portion into your expense ledger tagged with `#split`.

### 7. 💡 Rotating Campus Smart Tips
- Displays practical, actionable student savings tips (e.g., `.edu` discounts for Spotify/GitHub/Canva, textbook sharing, campus recreation access).

### 8. 📁 Data Persistence & CSV Export
- Automatic saving via browser `localStorage`.
- 1-click **Export CSV** for Excel or Google Sheets.
- Pre-loaded **Realistic Student Demo Data** toggle for immediate demonstrations.
- **Dark & Light Mode** toggle with persistent theme memory.
- Multi-currency support (`$`, `₹`, `€`, `£`, `C$`, `A$`).

---

## 💻 Tech Stack & Architecture

- **Structure**: Semantic HTML5 with accessible labels, modal dialogs, and SVG icons.
- **Styling**: Vanilla CSS3 with:
  - Custom CSS Design System with variables (`--primary`, `--bg-surface`, etc.)
  - Modern Glassmorphism with `backdrop-filter: blur(16px)` and glowing background ambient orbs
  - Responsive layout using CSS Grid & Flexbox
- **Logic**: Vanilla ES6+ JavaScript:
  - Modular state architecture
  - High-DPI Canvas 2D rendering for the donut chart
  - Dynamic date calculations and filters
  - Zero external framework dependencies — loads instantly anywhere!

---

## 🛠️ How to Run & Present

1. Open `index.html` in any web browser (Google Chrome, Microsoft Edge, Brave, Firefox, Safari).
2. Click **"Demo Data"** in the top navigation bar to populate realistic student numbers instantly.
3. Test adding an expense or income using the **"+ Add Transaction"** button.
4. Try the **Roommate Split & IOU** tool on the right sidebar.
5. Toggle between **Dark Mode** and **Light Mode** using the sun/moon icon.
