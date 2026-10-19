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

### 2. 🎓 Student Budget GPA (Financial Health Score)
- Calculates a real-time financial health score (e.g. `Grade A+ (92/100)`) right in the header based on savings velocity, spending control, and budget adherence.
- Gamifies money management with GPA grades from `A+` down to `D`.

### 3. 🧾 Official GST Tax Invoices & Digital Bills
- Built-in GST calculation across official tax slabs: `0%` (Exempt), `5%` (Canteen/Food), `12%` (Books & Stationery), `18%` (Tech & Subscriptions), `28%` (Luxury).
- Automatically produces a printable Tax Invoice with Invoice No., Date/Time, Billed-to, Base Price, CGST (half), SGST (half), Grand Total, and Verified Stamp.
- Formatted with `@media print` CSS for 1-click **PDF downloading** or printing.
- Every past expense in the ledger features a `🧾` Receipt button to review past bills anytime.

### 4. 📅 Chronological Transaction History & Timeline
- Daily grouping headers (`📅 Today`, `📅 Yesterday`, `📅 Oct 15`) with instant daily spend subtotals.
- Scope toggling between **"This Month"** and **"All History"**.
- Category filter dropdown and multiple sort options (Date Newest/Oldest, Amount High/Low).
- 1-click **Export CSV** for Excel or Google Sheets submissions.

### 5. 🍔 Student-Centric Expense & Income Categorization
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

### 6. 📊 Visual Analytics & Interactive Donut Chart
- Zero-dependency Retina Canvas donut chart showing percentage expense distribution.
- Real-time legend breakdown with color indicators and percentage share.

### 7. ⚠️ Category Spending Limits & Alert Progress Bars
- Set maximum spending caps per category (e.g., Canteen max $150/month).
- Dynamic progress indicators that turn **amber at 80%** and **pulsing red at 100%+** when exceeding limits.

### 8. 🎯 Gamified Savings Goals (Piggy Bank) with Confetti Celebration
- Target tracker for student goals (e.g., *MacBook for Coding*, *Semester Trip*, *Emergency Fund*).
- Visual progress bar with instant "Add Funds" deposit modal.
- Built-in canvas particle **Confetti Cannon** animation triggers upon reaching 100%!

### 9. 🍕 Roommate & Group Bill Splitter (IOU Calculator)
- Quickly split restaurant checks, pizza parties, or apartment utilities.
- Supports friend names, custom tips, and calculates each roommate's exact share.
- **1-Click "Add My Share"**: Automatically records your portion into your expense ledger tagged with `#split`.

### 10. ⚡ Power-User Keyboard Shortcuts
- Press <kbd>N</kbd> anywhere to open the New Transaction modal.
- Press <kbd>T</kbd> to toggle between Dark Mode and Light Mode.
- Press <kbd>D</kbd> to reload realistic Student Demo Data.
- Press <kbd>Esc</kbd> to close any active modal dialog.

### 11. 🔒 100% Client-Side Privacy & Offline Capability
- Automatic saving via browser `localStorage`. No external databases or servers hold your private financial data.
- Built-in "Reset Data" option in the footer to start a fresh ledger at the start of a new semester.
- Multi-currency support (`$`, `₹`, `€`, `£`, `C$`, `A$`).

---

## 💻 Tech Stack & Architecture

- **Structure**: Semantic HTML5 with accessible labels, modal dialogs, and SVG icons.
- **Styling**: Vanilla CSS3 with:
  - Custom CSS Design System with variables (`--primary`, `--bg-surface`, etc.)
  - Modern Glassmorphism with `backdrop-filter: blur(16px)` and glowing background ambient orbs
  - Responsive layout using CSS Grid & Flexbox
  - Print stylesheet `@media print` for digital GST invoice rendering
- **Logic**: Vanilla ES6+ JavaScript:
  - Modular state architecture
  - High-DPI Canvas 2D rendering for donut charts and particle confetti
  - Dynamic date calculations and filters
  - Zero external framework dependencies — loads instantly anywhere!

---

## 🛠️ How to Run & Present

1. **Live Server**: Double-click [**`Start_Live_Server.bat`**](Start_Live_Server.bat) and visit [`http://localhost:5500`](http://localhost:5500).
2. **Direct Browser**: Double-click [**`Open_In_Browser.bat`**](Open_In_Browser.bat) or [**`index.html`**](index.html).
3. Click **"Demo Data"** in the top navigation bar to populate realistic student numbers instantly.
4. Try adding an expense to see the **GST Tax Invoice** generated on the fly.
5. Use keyboard shortcuts (<kbd>N</kbd>, <kbd>T</kbd>, <kbd>D</kbd>) to demonstrate power-user features.
