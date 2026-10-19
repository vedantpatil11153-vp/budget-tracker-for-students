/**
 * CampusFunds - Student Budget & Finance Tracker
 * Comprehensive client-side state management, interactive canvas chart,
 * budget alerts, safe-to-spend calculation, roommate split & savings goals.
 */

(function () {
  'use strict';

  // --- Student Categories Configuration ---
  const EXPENSE_CATEGORIES = [
    { id: 'canteen', name: 'Canteen & Food', icon: '🍔', color: '#f43f5e' },
    { id: 'tuition', name: 'Tuition & Books', icon: '📚', color: '#6366f1' },
    { id: 'hostel', name: 'Hostel & Rent', icon: '🏠', color: '#06b6d4' },
    { id: 'commute', name: 'Commute & Travel', icon: '🚌', color: '#f59e0b' },
    { id: 'hangouts', name: 'Hangouts & Parties', icon: '🎉', color: '#ec4899' },
    { id: 'subs', name: 'Subscriptions & Tech', icon: '📱', color: '#8b5cf6' },
    { id: 'personal', name: 'Shopping & Self-care', icon: '👕', color: '#14b8a6' },
    { id: 'health', name: 'Health & Medical', icon: '🩹', color: '#ef4444' },
    { id: 'other_exp', name: 'Other Expenses', icon: '✨', color: '#64748b' }
  ];

  const INCOME_CATEGORIES = [
    { id: 'allowance', name: 'Monthly Allowance', icon: '💰', color: '#10b981' },
    { id: 'part_time', name: 'Part-time / Campus Job', icon: '💼', color: '#3b82f6' },
    { id: 'scholarship', name: 'Scholarship & Grants', icon: '🎓', color: '#8b5cf6' },
    { id: 'freelance', name: 'Freelance & Side Hustle', icon: '💻', color: '#06b6d4' },
    { id: 'gift_income', name: 'Gifts & Awards', icon: '🎁', color: '#f59e0b' }
  ];

  const STUDENT_TIPS = [
    "Use your .edu email for 50% off Spotify Premium, YouTube Music, Apple Music, and Amazon Prime Student!",
    "Borrow textbooks or access free digital PDFs from your university library instead of buying new editions.",
    "Cook meals or do meal-prep with roommates to cut weekly food costs by up to 60%.",
    "Grab the GitHub Student Developer Pack for free access to Canva Pro, domain names, and developer tools.",
    "Always carry your Student ID card — local buses, museums, cafes, and cinemas often offer student discounts.",
    "Resell your finished course books to junior students at the start of next semester.",
    "Use college campus gym and recreation facilities instead of paying for commercial fitness memberships.",
    "Set a daily limit before going out for campus parties or weekend hangouts to keep impulse spends low."
  ];

  // --- Initial Default Data for Instant WOW Factor ---
  const DEFAULT_TRANSACTIONS = [
    { id: 'tx_1', type: 'income', title: 'Monthly Allowance from Parents', amount: 650.00, category: 'Monthly Allowance', date: getFormattedCurrentDate(-18), tag: '#pocketmoney', paymentMode: 'Bank Transfer' },
    { id: 'tx_2', type: 'income', title: 'Campus Library Assistant Shift', amount: 180.00, category: 'Part-time / Campus Job', date: getFormattedCurrentDate(-10), tag: '#campusjob', paymentMode: 'Direct Deposit' },
    { id: 'tx_3', type: 'expense', title: 'Hostel Rent & Wi-Fi Share', amount: 280.00, category: 'Hostel & Rent', date: getFormattedCurrentDate(-17), tag: '#hostel', gstRate: 0, paymentMode: 'Net Banking' },
    { id: 'tx_4', type: 'expense', title: 'Engineering Textbooks & Notebooks', amount: 55.00, category: 'Tuition & Books', date: getFormattedCurrentDate(-14), tag: '#books', gstRate: 12, paymentMode: 'UPI (GPay / PhonePe)' },
    { id: 'tx_5', type: 'expense', title: 'Campus Canteen Lunches & Coffee', amount: 74.50, category: 'Canteen & Food', date: getFormattedCurrentDate(-8), tag: '#canteen', gstRate: 5, paymentMode: 'UPI (GPay / PhonePe)' },
    { id: 'tx_6', type: 'expense', title: 'Domino’s Pizza Night with Roommates', amount: 16.50, category: 'Hangouts & Parties', date: getFormattedCurrentDate(-5), tag: '#split', gstRate: 5, paymentMode: 'UPI (GPay / PhonePe)' },
    { id: 'tx_7', type: 'expense', title: 'Spotify Student + Cloud Storage', amount: 7.99, category: 'Subscriptions & Tech', date: getFormattedCurrentDate(-4), tag: '#studentdiscount', gstRate: 18, paymentMode: 'Debit Card' },
    { id: 'tx_8', type: 'expense', title: 'Monthly Metro Student Pass', amount: 35.00, category: 'Commute & Travel', date: getFormattedCurrentDate(-2), tag: '#commute', gstRate: 5, paymentMode: 'Cash' }
  ];

  const DEFAULT_BUDGETS = {
    'Canteen & Food': 150.00,
    'Hangouts & Parties': 70.00,
    'Tuition & Books': 80.00,
    'Commute & Travel': 50.00,
    'Subscriptions & Tech': 20.00,
    'Hostel & Rent': 300.00
  };

  const DEFAULT_GOALS = [
    { id: 'goal_1', title: 'MacBook Air for Coding', target: 800.00, current: 480.00, emoji: '💻' },
    { id: 'goal_2', title: 'Semester Break Road Trip', target: 200.00, current: 135.00, emoji: '🎒' },
    { id: 'goal_3', title: 'Emergency Rainy Day Fund', target: 300.00, current: 300.00, emoji: '🛡️' }
  ];

  // --- Helper to get date formatted YYYY-MM-DD relative to today ---
  function getFormattedCurrentDate(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- Application State ---
  const state = {
    currency: localStorage.getItem('cf_currency') || '$',
    theme: localStorage.getItem('cf_theme') || 'dark',
    currentTipIndex: 0,
    selectedMonth: getCurrentYearMonth(), // 'YYYY-MM'
    transactions: JSON.parse(localStorage.getItem('cf_transactions')) || DEFAULT_TRANSACTIONS,
    budgets: JSON.parse(localStorage.getItem('cf_budgets')) || DEFAULT_BUDGETS,
    goals: JSON.parse(localStorage.getItem('cf_goals')) || DEFAULT_GOALS,
    activeTypeFilter: 'all',
    historyScope: 'month', // 'month' | 'all'
    categoryFilter: 'all',
    sortOrder: 'date-desc',
    searchQuery: '',
    modalType: 'expense'
  };

  function getCurrentYearMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Save state helpers
  function saveTransactions() {
    localStorage.setItem('cf_transactions', JSON.stringify(state.transactions));
  }
  function saveBudgets() {
    localStorage.setItem('cf_budgets', JSON.stringify(state.budgets));
  }
  function saveGoals() {
    localStorage.setItem('cf_goals', JSON.stringify(state.goals));
  }

  // --- Format Currency ---
  function formatMoney(amount) {
    const val = Number(amount) || 0;
    return `${state.currency}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '✓';
    if (type === 'warn') icon = '⚠️';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `<span style="font-weight:bold;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- DOM Element References ---
  const currencySelect = document.getElementById('currencySelect');
  const monthSelect = document.getElementById('monthSelect');
  const demoDataBtn = document.getElementById('demoDataBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  
  const dailyTipText = document.getElementById('dailyTipText');
  const nextTipBtn = document.getElementById('nextTipBtn');

  const totalIncomeDisplay = document.getElementById('totalIncomeDisplay');
  const totalExpenseDisplay = document.getElementById('totalExpenseDisplay');
  const netBalanceDisplay = document.getElementById('netBalanceDisplay');
  const balanceStatusText = document.getElementById('balanceStatusText');
  const dailySafeDisplay = document.getElementById('dailySafeDisplay');
  const safeDaysPill = document.getElementById('safeDaysPill');
  const safeSpendNotice = document.getElementById('safeSpendNotice');

  const donutTotalSpent = document.getElementById('donutTotalSpent');
  const expenseCountBadge = document.getElementById('expenseCountBadge');
  const categoryLegendList = document.getElementById('categoryLegendList');
  const budgetBarsContainer = document.getElementById('budgetBarsContainer');
  const transactionsList = document.getElementById('transactionsList');
  const goalsContainer = document.getElementById('goalsContainer');

  // Splitter elements
  const splitBillTitle = document.getElementById('splitBillTitle');
  const splitTotalAmount = document.getElementById('splitTotalAmount');
  const splitNumPeople = document.getElementById('splitNumPeople');
  const splitTipPercent = document.getElementById('splitTipPercent');
  const splitFriendsList = document.getElementById('splitFriendsList');
  const splitPerPersonVal = document.getElementById('splitPerPersonVal');
  const recordMyShareBtn = document.getElementById('recordMyShareBtn');
  const iouItemsList = document.getElementById('iouItemsList');

  // Modals
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const txModalBackdrop = document.getElementById('txModalBackdrop');
  const closeTxModalBtn = document.getElementById('closeTxModalBtn');
  const cancelTxBtn = document.getElementById('cancelTxBtn');
  const txForm = document.getElementById('txForm');
  const txModalTitle = document.getElementById('txModalTitle');
  const typeExpenseBtn = document.getElementById('typeExpenseBtn');
  const typeIncomeBtn = document.getElementById('typeIncomeBtn');
  const txTypeInput = document.getElementById('txTypeInput');
  const txCategory = document.getElementById('txCategory');
  const editTxId = document.getElementById('editTxId');

  // Budget Modal
  const openBudgetModalBtn = document.getElementById('openBudgetModalBtn');
  const budgetModalBackdrop = document.getElementById('budgetModalBackdrop');
  const closeBudgetModalBtn = document.getElementById('closeBudgetModalBtn');
  const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');
  const saveBudgetsBtn = document.getElementById('saveBudgetsBtn');
  const budgetInputsContainer = document.getElementById('budgetInputsContainer');

  // Goals Modal
  const openGoalModalBtn = document.getElementById('openGoalModalBtn');
  const goalModalBackdrop = document.getElementById('goalModalBackdrop');
  const closeGoalModalBtn = document.getElementById('closeGoalModalBtn');
  const cancelGoalBtn = document.getElementById('cancelGoalBtn');
  const goalForm = document.getElementById('goalForm');

  // Deposit Modal
  const depositModalBackdrop = document.getElementById('depositModalBackdrop');
  const closeDepositModalBtn = document.getElementById('closeDepositModalBtn');
  const cancelDepositBtn = document.getElementById('cancelDepositBtn');
  const depositForm = document.getElementById('depositForm');
  const depositGoalNameText = document.getElementById('depositGoalNameText');
  const depositGoalId = document.getElementById('depositGoalId');

  // Filters
  const txSearchInput = document.getElementById('txSearchInput');
  const txTypeFilter = document.getElementById('txTypeFilter');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  // --- Initial Setup ---
  function init() {
    // 1. Theme
    applyTheme(state.theme);

    // 2. Currency Selector
    currencySelect.value = state.currency;
    updateCurrencyLabels();

    // 3. Month Select Options
    populateMonthSelector();

    // 4. Daily Tips
    renderDailyTip();

    // 5. Populate Category Filter Dropdown
    populateCategoryFilterOptions();

    // 6. Render Everything
    renderAll();

    // 7. Setup Listeners
    setupEventListeners();
  }

  // --- Theme Handling ---
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('cf_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      themeIconSun.classList.add('hide');
      themeIconMoon.classList.remove('hide');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      themeIconSun.classList.remove('hide');
      themeIconMoon.classList.add('hide');
    }
    // Re-draw chart for theme background harmony
    renderDonutChart();
  }

  function updateCurrencyLabels() {
    document.querySelectorAll('.currency-symbol-label').forEach(el => {
      el.textContent = state.currency;
    });
  }

  // --- Month Selector Population ---
  function populateMonthSelector() {
    monthSelect.innerHTML = '';
    const now = new Date();
    
    // Create options for past 5 months and next 2 months
    for (let i = -5; i <= 2; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      const option = document.createElement('option');
      option.value = val;
      option.textContent = label;
      if (val === state.selectedMonth) {
        option.selected = true;
      }
      monthSelect.appendChild(option);
    }
  }

  // --- Daily Tips Rotation ---
  function renderDailyTip() {
    dailyTipText.textContent = STUDENT_TIPS[state.currentTipIndex];
  }

  function nextTip() {
    state.currentTipIndex = (state.currentTipIndex + 1) % STUDENT_TIPS.length;
    renderDailyTip();
  }

  // --- Filtered Transactions for Current Month ---
  function getMonthTransactions() {
    return state.transactions.filter(tx => {
      if (!tx.date) return false;
      return tx.date.startsWith(state.selectedMonth);
    });
  }

  // --- Metrics & Safe-to-Spend Computation ---
  function computeMonthlyMetrics() {
    const list = getMonthTransactions();
    let totalIncome = 0;
    let totalExpense = 0;

    list.forEach(tx => {
      const amt = parseFloat(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }
    });

    const netBalance = totalIncome - totalExpense;

    // Calculate days remaining in the chosen month
    const [yearStr, monthStr] = state.selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // 1-indexed

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === month;
    const daysInMonth = new Date(year, month, 0).getDate();

    let daysLeft = 1;
    if (isCurrentMonth) {
      daysLeft = Math.max(1, daysInMonth - today.getDate() + 1);
    } else {
      const isPastMonth = new Date(year, month - 1, 1) < new Date(today.getFullYear(), today.getMonth(), 1);
      daysLeft = isPastMonth ? 0 : daysInMonth;
    }

    let dailySafe = 0;
    if (daysLeft > 0 && netBalance > 0) {
      dailySafe = netBalance / daysLeft;
    }

    return {
      totalIncome,
      totalExpense,
      netBalance,
      daysLeft,
      dailySafe,
      isCurrentMonth
    };
  }

  // --- Render Top Metrics Cards ---
  function renderMetrics() {
    const metrics = computeMonthlyMetrics();

    totalIncomeDisplay.textContent = formatMoney(metrics.totalIncome);
    totalExpenseDisplay.textContent = formatMoney(metrics.totalExpense);
    netBalanceDisplay.textContent = formatMoney(metrics.netBalance);

    // Balance visual state
    if (metrics.netBalance < 0) {
      netBalanceDisplay.style.color = 'var(--accent-rose)';
      balanceStatusText.textContent = 'Deficit! Cut discretionary expenses';
      balanceStatusText.style.color = 'var(--accent-rose)';
    } else {
      netBalanceDisplay.style.color = 'var(--text-main)';
      balanceStatusText.textContent = metrics.netBalance > 200 ? 'Healthy student surplus ✨' : 'Balanced allowance';
      balanceStatusText.style.color = 'var(--text-muted)';
    }

    // Daily safe spend
    if (metrics.daysLeft <= 0) {
      safeDaysPill.textContent = 'Month Ended';
      dailySafeDisplay.innerHTML = `${formatMoney(0)} <span class="per-day">/ day</span>`;
      safeSpendNotice.textContent = 'Review your final monthly savings!';
    } else {
      safeDaysPill.textContent = `${metrics.daysLeft} days left`;
      dailySafeDisplay.innerHTML = `${formatMoney(metrics.dailySafe)} <span class="per-day">/ day</span>`;
      
      if (metrics.netBalance <= 0) {
        safeSpendNotice.textContent = '⚠️ Balance exhausted! Limit spends to 0.';
        safeSpendNotice.style.color = 'var(--accent-rose)';
      } else if (metrics.dailySafe < 5) {
        safeSpendNotice.textContent = 'Strict budget! Stick to mess & essentials.';
        safeSpendNotice.style.color = 'var(--accent-amber)';
      } else {
        safeSpendNotice.textContent = 'Spend under this to avoid being broke before month-end!';
        safeSpendNotice.style.color = 'var(--text-muted)';
      }
    }

    // Compute Student Budget GPA (Financial Health Score)
    const healthBadgeWrap = document.getElementById('financialHealthBadgeWrap');
    const healthScoreEl = document.getElementById('financialHealthScore');
    
    if (healthScoreEl && healthBadgeWrap) {
      let score = 50;
      if (metrics.totalIncome > 0) {
        const savingsRate = (metrics.netBalance / metrics.totalIncome) * 100;
        if (savingsRate >= 30) score = Math.min(99, 85 + Math.round((savingsRate - 30) / 3));
        else if (savingsRate >= 15) score = Math.round(75 + (savingsRate - 15));
        else if (savingsRate >= 0) score = Math.round(55 + savingsRate);
        else score = Math.max(10, Math.round(50 + savingsRate));
      }

      let grade = 'A+';
      let gradeClass = 'health-grade-a';

      if (score >= 85) {
        grade = 'A+';
        gradeClass = 'health-grade-a';
      } else if (score >= 70) {
        grade = 'B';
        gradeClass = 'health-grade-b';
      } else if (score >= 50) {
        grade = 'C';
        gradeClass = 'health-grade-c';
      } else {
        grade = 'D';
        gradeClass = 'health-grade-d';
      }

      healthScoreEl.textContent = `${grade} (${score}/100)`;
      healthBadgeWrap.className = `health-badge-wrap ${gradeClass}`;
      healthBadgeWrap.title = `Student Financial GPA: Grade ${grade} (${score}/100) based on savings rate & safe-to-spend control.`;
    }
  }

  // --- Category Spend Summary ---
  function getCategorySpendMap() {
    const list = getMonthTransactions().filter(t => t.type === 'expense');
    const spendMap = {};
    let totalExpense = 0;

    list.forEach(tx => {
      const amt = parseFloat(tx.amount) || 0;
      totalExpense += amt;
      spendMap[tx.category] = (spendMap[tx.category] || 0) + amt;
    });

    return { spendMap, totalExpense };
  }

  // --- Donut Chart Rendering (Canvas) ---
  function renderDonutChart() {
    const canvas = document.getElementById('categoryDonutChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const size = 240;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);

    const { spendMap, totalExpense } = getCategorySpendMap();
    donutTotalSpent.textContent = formatMoney(totalExpense);

    const entries = Object.entries(spendMap).filter(([_, val]) => val > 0);
    expenseCountBadge.textContent = `${entries.length} ${entries.length === 1 ? 'category' : 'categories'}`;

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = 95;
    const innerRadius = 66;

    if (totalExpense === 0 || entries.length === 0) {
      // Empty grey ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, innerRadius, 2 * Math.PI, 0, true);
      ctx.fillStyle = state.theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
      ctx.fill();
      return;
    }

    let startAngle = -Math.PI / 2;

    entries.forEach(([catName, amount]) => {
      const sliceAngle = (amount / totalExpense) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      const catObj = EXPENSE_CATEGORIES.find(c => c.name === catName);
      const color = catObj ? catObj.color : '#8b5cf6';

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Divider stroke
      ctx.lineWidth = 2;
      ctx.strokeStyle = state.theme === 'light' ? '#ffffff' : '#111622';
      ctx.stroke();

      startAngle = endAngle;
    });
  }

  // --- Render Category Legend ---
  function renderCategoryLegend() {
    const { spendMap, totalExpense } = getCategorySpendMap();
    categoryLegendList.innerHTML = '';

    const entries = Object.entries(spendMap).filter(([_, val]) => val > 0);
    entries.sort((a, b) => b[1] - a[1]); // Descending

    if (entries.length === 0) {
      categoryLegendList.innerHTML = `<div class="empty-state-mini">No expenses recorded for this month. Click "+ Add Transaction" to begin!</div>`;
      return;
    }

    entries.forEach(([catName, amount]) => {
      const catObj = EXPENSE_CATEGORIES.find(c => c.name === catName) || { icon: '✨', color: '#818cf8' };
      const percent = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;

      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `
        <div class="legend-left">
          <span class="legend-color-dot" style="background-color: ${catObj.color};"></span>
          <span class="legend-name">${catObj.icon} ${catName}</span>
        </div>
        <div class="legend-right">
          <span class="legend-amount">${formatMoney(amount)}</span>
          <span class="legend-percent">${percent}%</span>
        </div>
      `;
      categoryLegendList.appendChild(item);
    });
  }

  // --- Render Category Budget Bars ---
  function renderBudgetBars() {
    budgetBarsContainer.innerHTML = '';
    const { spendMap } = getCategorySpendMap();

    const budgetKeys = Object.keys(state.budgets).filter(k => state.budgets[k] > 0);

    if (budgetKeys.length === 0) {
      budgetBarsContainer.innerHTML = `
        <div class="empty-state-mini">
          No monthly category limits set. Click <strong>"Set Limits"</strong> to keep track of food, canteen, or outing caps!
        </div>
      `;
      return;
    }

    budgetKeys.forEach(catName => {
      const limit = state.budgets[catName];
      const spent = spendMap[catName] || 0;
      const ratio = limit > 0 ? (spent / limit) * 100 : 0;
      const displayRatio = Math.min(100, ratio).toFixed(0);

      const catObj = EXPENSE_CATEGORIES.find(c => c.name === catName) || { icon: '📌' };

      let statusClass = 'fill-safe';
      let statusBadge = '';
      if (ratio >= 100) {
        statusClass = 'fill-alert';
        statusBadge = `<span class="badge" style="background: rgba(244,63,94,0.15); color: #f43f5e;">Over Limit!</span>`;
      } else if (ratio >= 80) {
        statusClass = 'fill-warn';
        statusBadge = `<span class="badge" style="background: rgba(245,158,11,0.15); color: #f59e0b;">Near Cap</span>`;
      }

      const card = document.createElement('div');
      card.className = 'budget-bar-card';
      card.innerHTML = `
        <div class="budget-bar-header">
          <div class="budget-category-info">
            <span>${catObj.icon} ${catName}</span>
            ${statusBadge}
          </div>
          <div class="budget-amounts">
            <strong>${formatMoney(spent)}</strong> / ${formatMoney(limit)}
          </div>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${statusClass}" style="width: ${displayRatio}%;"></div>
        </div>
        <div class="budget-footer">
          <span>${ratio.toFixed(1)}% of allowance limit</span>
          <span>${limit - spent >= 0 ? `${formatMoney(limit - spent)} left` : `${formatMoney(Math.abs(limit - spent))} over`}</span>
        </div>
      `;
      budgetBarsContainer.appendChild(card);
    });
  }

  // --- Populate Category Filter Dropdown ---
  function populateCategoryFilterOptions() {
    const catSelect = document.getElementById('txCategoryFilter');
    if (!catSelect) return;
    const currentVal = state.categoryFilter;
    catSelect.innerHTML = '<option value="all">📁 All Categories</option>';

    const expGroup = document.createElement('optgroup');
    expGroup.label = '── Expenses ──';
    EXPENSE_CATEGORIES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = `${c.icon} ${c.name}`;
      expGroup.appendChild(opt);
    });
    catSelect.appendChild(expGroup);

    const incGroup = document.createElement('optgroup');
    incGroup.label = '── Incomes ──';
    INCOME_CATEGORIES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = `${c.icon} ${c.name}`;
      incGroup.appendChild(opt);
    });
    catSelect.appendChild(incGroup);

    catSelect.value = currentVal;
  }

  // --- Render Transaction History & Timeline ---
  function renderTransactions() {
    transactionsList.innerHTML = '';

    // 1. Scope: This Month vs All History
    let list = state.historyScope === 'all'
      ? [...state.transactions]
      : getMonthTransactions();

    const scopeBadge = document.getElementById('historyScopeBadge');
    if (scopeBadge) {
      scopeBadge.textContent = state.historyScope === 'all' ? 'All History' : 'This Month';
    }

    // 2. Type Filter (All, Expense, Income)
    if (state.activeTypeFilter !== 'all') {
      list = list.filter(t => t.type === state.activeTypeFilter);
    }

    // 3. Category Filter
    if (state.categoryFilter !== 'all') {
      list = list.filter(t => t.category === state.categoryFilter);
    }

    // 4. Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.tag && t.tag.toLowerCase().includes(q))
      );
    }

    // 5. Update Stats Bar
    const countStats = document.getElementById('txCountStats');
    const totalStats = document.getElementById('txTotalStats');
    const netFlow = list.reduce((acc, t) => {
      const amt = parseFloat(t.amount) || 0;
      return acc + (t.type === 'income' ? amt : -amt);
    }, 0);

    if (countStats) {
      countStats.textContent = `${list.length} ${list.length === 1 ? 'record' : 'records'}`;
    }
    if (totalStats) {
      const sign = netFlow >= 0 ? '+' : '-';
      totalStats.textContent = `Net Flow: ${sign}${formatMoney(Math.abs(netFlow))}`;
      totalStats.style.color = netFlow >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)';
    }

    // 6. Sort Order
    list.sort((a, b) => {
      if (state.sortOrder === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (state.sortOrder === 'amt-desc') {
        return (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0);
      } else if (state.sortOrder === 'amt-asc') {
        return (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
      } else {
        // 'date-desc' default
        return new Date(b.date) - new Date(a.date);
      }
    });

    if (list.length === 0) {
      transactionsList.innerHTML = `
        <div class="empty-state-mini">
          No transactions match this timeline filter. Try switching between "This Month" / "All History", clearing filters, or adding a new transaction!
        </div>
      `;
      return;
    }

    // 7. Group items by Date for a sleek visual timeline
    const grouped = {};
    list.forEach(tx => {
      const dateKey = tx.date || 'Undated';
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(tx);
    });

    const todayStr = getFormattedCurrentDate(0);
    const yesterdayStr = getFormattedCurrentDate(-1);

    Object.keys(grouped).forEach(dateKey => {
      const items = grouped[dateKey];
      
      // Calculate date subtotal
      let dayExpense = 0;
      let dayIncome = 0;
      items.forEach(i => {
        const a = parseFloat(i.amount) || 0;
        if (i.type === 'expense') dayExpense += a;
        else dayIncome += a;
      });

      let displayDate = formatDateString(dateKey);
      if (dateKey === todayStr) displayDate = 'Today';
      else if (dateKey === yesterdayStr) displayDate = 'Yesterday';

      let subtotalText = '';
      if (dayExpense > 0 && dayIncome > 0) {
        subtotalText = `Spent: ${formatMoney(dayExpense)} | Inflow: +${formatMoney(dayIncome)}`;
      } else if (dayExpense > 0) {
        subtotalText = `Spent: ${formatMoney(dayExpense)}`;
      } else if (dayIncome > 0) {
        subtotalText = `Inflow: +${formatMoney(dayIncome)}`;
      }

      // Group Header Element
      const groupHeader = document.createElement('div');
      groupHeader.className = 'tx-date-group-header';
      groupHeader.innerHTML = `
        <span>📅 ${displayDate} (${items.length})</span>
        <span class="tx-date-subtotal">${subtotalText}</span>
      `;
      transactionsList.appendChild(groupHeader);

      // Render individual transactions for this date
      items.forEach(tx => {
        const isIncome = tx.type === 'income';
        const catConfig = isIncome
          ? INCOME_CATEGORIES.find(c => c.name === tx.category) || { icon: '💰' }
          : EXPENSE_CATEGORIES.find(c => c.name === tx.category) || { icon: '🍔' };

        const item = document.createElement('div');
        item.className = 'tx-item';
        item.innerHTML = `
          <div class="tx-left">
            <div class="tx-category-icon">${catConfig.icon}</div>
            <div class="tx-info">
              <span class="tx-title">${escapeHtml(tx.title)}</span>
              <div class="tx-meta">
                <span>${tx.category}</span>
                <span>•</span>
                <span>${formatDateString(tx.date)}</span>
                ${tx.tag ? `<span class="tx-tag">${escapeHtml(tx.tag)}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="tx-right">
            <span class="tx-amount ${isIncome ? 'tx-income' : 'tx-expense'}">
              ${isIncome ? '+' : '-'}${formatMoney(tx.amount)}
            </span>
            <div class="tx-actions">
              ${!isIncome ? `
                <button class="btn-icon-subtle view-receipt-btn" data-id="${tx.id}" title="View GST Tax Invoice & Bill">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </button>
              ` : ''}
              <button class="btn-icon-subtle edit-tx-btn" data-id="${tx.id}" title="Edit Transaction">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-icon-danger del-tx-btn" data-id="${tx.id}" title="Delete Transaction">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        `;
        transactionsList.appendChild(item);
      });
    });

    // Attach row action listeners
    document.querySelectorAll('.view-receipt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openReceiptModal(id);
      });
    });

    document.querySelectorAll('.del-tx-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        deleteTransaction(id);
      });
    });

    document.querySelectorAll('.edit-tx-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openEditTxModal(id);
      });
    });
  }

  // --- Render Savings Goals ---
  function renderSavingsGoals() {
    goalsContainer.innerHTML = '';

    if (state.goals.length === 0) {
      goalsContainer.innerHTML = `
        <div class="empty-state-mini">
          No savings goals yet! Create one for a laptop, trip, or emergency buffer.
        </div>
      `;
      return;
    }

    state.goals.forEach(goal => {
      const current = parseFloat(goal.current) || 0;
      const target = parseFloat(goal.target) || 1;
      const progress = Math.min(100, (current / target) * 100);
      const isCompleted = progress >= 100;

      const card = document.createElement('div');
      card.className = 'goal-card';
      card.innerHTML = `
        <div class="goal-header">
          <div class="goal-name-wrap">
            <span class="goal-emoji">${goal.emoji || '🎯'}</span>
            <span class="goal-title">${escapeHtml(goal.title)}</span>
          </div>
          <span class="goal-status-badge ${isCompleted ? 'status-completed' : 'status-active'}">
            ${isCompleted ? 'Completed! 🎉' : `${progress.toFixed(0)}%`}
          </span>
        </div>

        <div class="goal-amounts">
          <span>Saved: <strong>${formatMoney(current)}</strong></span>
          <span>Target: <strong>${formatMoney(target)}</strong></span>
        </div>

        <div class="progress-track">
          <div class="progress-fill ${isCompleted ? 'fill-safe' : ''}" style="width: ${progress}%;"></div>
        </div>

        <div class="goal-actions">
          <button class="btn btn-outline btn-sm deposit-btn" data-id="${goal.id}">
            + Add Funds
          </button>
          <button class="btn-icon-danger del-goal-btn" data-id="${goal.id}" title="Delete goal">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
      goalsContainer.appendChild(card);
    });

    // Attach goal listeners
    document.querySelectorAll('.deposit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openDepositModal(id);
      });
    });

    document.querySelectorAll('.del-goal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        deleteGoal(id);
      });
    });
  }

  // --- Bill Splitter Logic ---
  function calculateBillSplit() {
    const total = parseFloat(splitTotalAmount.value) || 0;
    const numPeople = parseInt(splitNumPeople.value, 10) || 1;
    const tipPercent = parseFloat(splitTipPercent.value) || 0;

    const totalWithTip = total + (total * (tipPercent / 100));
    const perPerson = numPeople > 0 ? (totalWithTip / numPeople) : 0;

    splitPerPersonVal.textContent = formatMoney(perPerson);

    // Friend list breakdown
    const friendsText = splitFriendsList.value.trim();
    iouItemsList.innerHTML = '';

    if (friendsText && numPeople > 1) {
      const friends = friendsText.split(',').map(s => s.trim()).filter(Boolean);
      friends.forEach((name, idx) => {
        const li = document.createElement('li');
        li.className = 'iou-item';
        const isSelf = name.toLowerCase() === 'me' || idx === 0;
        li.innerHTML = `
          <span>${escapeHtml(name)} ${isSelf ? '(My Share)' : ''}</span>
          <strong>${formatMoney(perPerson)}</strong>
        `;
        iouItemsList.appendChild(li);
      });
    }
  }

  function recordMySplitShare() {
    const title = splitBillTitle.value.trim() || 'Roommate Split Bill';
    const total = parseFloat(splitTotalAmount.value) || 0;
    const numPeople = parseInt(splitNumPeople.value, 10) || 1;
    const tipPercent = parseFloat(splitTipPercent.value) || 0;

    if (total <= 0) {
      showToast('Please enter a valid bill amount first!', 'warn');
      return;
    }

    const totalWithTip = total + (total * (tipPercent / 100));
    const myShare = totalWithTip / numPeople;

    const newTx = {
      id: 'tx_' + Date.now(),
      type: 'expense',
      title: `${title} (My Share)`,
      amount: parseFloat(myShare.toFixed(2)),
      category: 'Canteen & Food',
      date: getFormattedCurrentDate(),
      tag: '#split'
    };

    state.transactions.unshift(newTx);
    saveTransactions();
    renderAll();
    showToast(`Added your share of ${formatMoney(myShare)} to expenses!`);
  }

  // --- Modals Management ---
  function openAddTransactionModal(type = 'expense') {
    editTxId.value = '';
    txModalTitle.textContent = 'Add Transaction';
    txForm.reset();
    document.getElementById('txDate').value = getFormattedCurrentDate();
    setModalType(type);
    txModalBackdrop.classList.remove('hide');
  }

  function openEditTxModal(id) {
    const tx = state.transactions.find(t => t.id === id);
    if (!tx) return;

    editTxId.value = tx.id;
    txModalTitle.textContent = 'Edit Transaction';
    setModalType(tx.type);

    document.getElementById('txTitle').value = tx.title;
    document.getElementById('txAmount').value = tx.amount;
    document.getElementById('txDate').value = tx.date;
    document.getElementById('txTag').value = tx.tag || '';
    txCategory.value = tx.category;

    txModalBackdrop.classList.remove('hide');
  }

  function setModalType(type) {
    state.modalType = type;
    txTypeInput.value = type;

    const gstRow = document.getElementById('gstPaymentRow');
    const receiptGroup = document.getElementById('receiptOptGroup');

    if (type === 'expense') {
      typeExpenseBtn.classList.add('active');
      typeIncomeBtn.classList.remove('active');
      populateCategoryOptions(EXPENSE_CATEGORIES);
      if (gstRow) gstRow.classList.remove('hide');
      if (receiptGroup) receiptGroup.classList.remove('hide');
    } else {
      typeIncomeBtn.classList.add('active');
      typeExpenseBtn.classList.remove('active');
      populateCategoryOptions(INCOME_CATEGORIES);
      if (gstRow) gstRow.classList.add('hide');
      if (receiptGroup) receiptGroup.classList.add('hide');
    }
  }

  function populateCategoryOptions(list) {
    txCategory.innerHTML = '';
    list.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = `${cat.icon} ${cat.name}`;
      txCategory.appendChild(opt);
    });
  }

  function closeTxModal() {
    txModalBackdrop.classList.add('hide');
  }

  function saveTransactionFromForm(e) {
    e.preventDefault();

    const title = document.getElementById('txTitle').value.trim();
    const amount = parseFloat(document.getElementById('txAmount').value);
    const date = document.getElementById('txDate').value;
    const category = txCategory.value;
    const tag = document.getElementById('txTag').value.trim();
    const type = txTypeInput.value;
    const existingId = editTxId.value;

    const gstRateSelect = document.getElementById('txGstRate');
    const paymentModeSelect = document.getElementById('txPaymentMode');
    const receiptCheck = document.getElementById('generateReceiptCheck');

    const gstRate = type === 'expense' && gstRateSelect ? (parseFloat(gstRateSelect.value) || 0) : 0;
    const paymentMode = type === 'expense' && paymentModeSelect ? paymentModeSelect.value : 'Direct Inflow';
    const shouldGenerateReceipt = type === 'expense' && receiptCheck && receiptCheck.checked;

    if (!title || isNaN(amount) || amount <= 0 || !date) {
      showToast('Please fill out all required fields with valid values.', 'warn');
      return;
    }

    let savedTxId = existingId;

    if (existingId) {
      // Edit
      const index = state.transactions.findIndex(t => t.id === existingId);
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          title,
          amount,
          date,
          category,
          tag,
          type,
          gstRate,
          paymentMode
        };
        showToast('Transaction updated successfully!');
      }
    } else {
      // Add
      savedTxId = 'tx_' + Date.now();
      const newTx = {
        id: savedTxId,
        type,
        title,
        amount,
        date,
        category,
        tag,
        gstRate,
        paymentMode
      };
      state.transactions.unshift(newTx);
      showToast(`${type === 'income' ? 'Income' : 'Expense'} recorded!`);
    }

    saveTransactions();
    closeTxModal();
    renderAll();

    // If receipt requested, open the GST bill immediately!
    if (shouldGenerateReceipt && savedTxId) {
      setTimeout(() => {
        openReceiptModal(savedTxId);
      }, 350);
    }
  }

  // --- GST Bill & Tax Invoice Modal Logic ---
  const receiptModalBackdrop = document.getElementById('receiptModalBackdrop');
  const closeReceiptModalBtn = document.getElementById('closeReceiptModalBtn');
  const closeReceiptBtn = document.getElementById('closeReceiptBtn');
  const printReceiptBtn = document.getElementById('printReceiptBtn');

  function openReceiptModal(id) {
    const tx = state.transactions.find(t => t.id === id);
    if (!tx || !receiptModalBackdrop) return;

    const storeNames = {
      'Canteen & Food': 'Campus Central Canteen & Cafeteria',
      'Tuition & Books': 'University Book Depot & Stationery',
      'Hostel & Rent': 'Campus Housing & PG Services',
      'Commute & Travel': 'City Metro & Transit Services',
      'Hangouts & Parties': 'Campus Hangout Cafe & Restaurant',
      'Subscriptions & Tech': 'Campus Tech & Digital Services',
      'Shopping & Self-care': 'Student Convenience Store',
      'Health & Medical': 'Campus Health Center & Pharmacy',
      'Other Expenses': 'Campus Merchant Services'
    };

    const amt = parseFloat(tx.amount) || 0;
    const rate = tx.gstRate !== undefined ? tx.gstRate : 5;
    const basePrice = rate > 0 ? (amt / (1 + rate / 100)) : amt;
    const totalTax = amt - basePrice;
    const halfTax = totalTax / 2;

    const storeEl = document.getElementById('receiptStoreName');
    const invEl = document.getElementById('receiptInvoiceNo');
    const dateEl = document.getElementById('receiptDateTime');
    const billedToEl = document.getElementById('receiptBilledTo');
    const modeEl = document.getElementById('receiptPaymentMode');
    const titleEl = document.getElementById('receiptItemTitle');
    const catEl = document.getElementById('receiptItemCat');
    const rateBadge = document.getElementById('receiptGstRateBadge');
    const grossEl = document.getElementById('receiptGrossAmt');
    const baseEl = document.getElementById('receiptBasePrice');
    const cgstLabel = document.getElementById('cgstLabel');
    const sgstLabel = document.getElementById('sgstLabel');
    const cgstEl = document.getElementById('receiptCgst');
    const sgstEl = document.getElementById('receiptSgst');
    const totalTaxEl = document.getElementById('receiptTotalTax');
    const grandTotalEl = document.getElementById('receiptGrandTotal');
    const hashEl = document.getElementById('receiptVerifyHash');

    if (storeEl) storeEl.textContent = storeNames[tx.category] || `${tx.category} Store`;
    if (invEl) invEl.textContent = 'INV-2026-' + (tx.id.replace(/\D/g, '').slice(-4) || '1024');
    if (dateEl) dateEl.textContent = (tx.date || getFormattedCurrentDate()) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (billedToEl) billedToEl.textContent = 'Student (Campus Account)';
    if (modeEl) modeEl.textContent = tx.paymentMode || 'UPI (GPay / PhonePe)';
    
    if (titleEl) titleEl.textContent = tx.title;
    if (catEl) catEl.textContent = tx.category;
    if (rateBadge) rateBadge.textContent = `${rate}% GST`;
    if (grossEl) grossEl.textContent = formatMoney(amt);

    if (baseEl) baseEl.textContent = formatMoney(basePrice);
    if (cgstLabel) cgstLabel.textContent = `Central GST (CGST ${(rate / 2)}%):`;
    if (sgstLabel) sgstLabel.textContent = `State GST (SGST ${(rate / 2)}%):`;

    if (cgstEl) cgstEl.textContent = formatMoney(halfTax);
    if (sgstEl) sgstEl.textContent = formatMoney(halfTax);
    if (totalTaxEl) totalTaxEl.textContent = formatMoney(totalTax);
    if (grandTotalEl) grandTotalEl.textContent = formatMoney(amt);

    if (hashEl) hashEl.textContent = 'VERIFY: CF-' + (tx.id.toUpperCase().slice(-8));

    receiptModalBackdrop.classList.remove('hide');
  }

  function closeReceiptModal() {
    if (receiptModalBackdrop) {
      receiptModalBackdrop.classList.add('hide');
    }
  }

  function deleteTransaction(id) {
    const tx = state.transactions.find(t => t.id === id);
    if (!tx) return;

    if (confirm(`Delete "${tx.title}" (${formatMoney(tx.amount)})?`)) {
      state.transactions = state.transactions.filter(t => t.id !== id);
      saveTransactions();
      renderAll();
      showToast('Transaction deleted.', 'warn');
    }
  }

  // --- Category Budget Modal ---
  function openBudgetModal() {
    budgetInputsContainer.innerHTML = '';

    EXPENSE_CATEGORIES.forEach(cat => {
      const currentLimit = state.budgets[cat.name] || 0;
      const row = document.createElement('div');
      row.className = 'budget-input-row';
      row.innerHTML = `
        <span class="budget-category-label">${cat.icon} ${cat.name}</span>
        <div class="input-prefix-wrap">
          <span class="currency-symbol-label">${state.currency}</span>
          <input type="number" step="1" min="0" data-cat="${cat.name}" value="${currentLimit}">
        </div>
      `;
      budgetInputsContainer.appendChild(row);
    });

    budgetModalBackdrop.classList.remove('hide');
  }

  function closeBudgetModal() {
    budgetModalBackdrop.classList.add('hide');
  }

  function saveBudgets() {
    const inputs = budgetInputsContainer.querySelectorAll('input');
    inputs.forEach(input => {
      const cat = input.dataset.cat;
      const val = parseFloat(input.value) || 0;
      state.budgets[cat] = val;
    });

    localStorage.setItem('cf_budgets', JSON.stringify(state.budgets));
    closeBudgetModal();
    renderBudgetBars();
    showToast('Monthly limits updated!');
  }

  // --- Savings Goals Management ---
  function openGoalModal() {
    goalForm.reset();
    goalModalBackdrop.classList.remove('hide');
  }

  function closeGoalModal() {
    goalModalBackdrop.classList.add('hide');
  }

  function saveGoal(e) {
    e.preventDefault();
    const title = document.getElementById('goalTitle').value.trim();
    const target = parseFloat(document.getElementById('goalTarget').value);
    const current = parseFloat(document.getElementById('goalCurrent').value) || 0;
    const emoji = document.getElementById('goalEmoji').value;

    if (!title || isNaN(target) || target <= 0) {
      showToast('Please enter a valid goal name and target amount.', 'warn');
      return;
    }

    const newGoal = {
      id: 'goal_' + Date.now(),
      title,
      target,
      current,
      emoji
    };

    state.goals.push(newGoal);
    saveGoals();
    closeGoalModal();
    renderSavingsGoals();
    showToast(`Created savings goal: "${title}"! 🎯`);
  }

  function deleteGoal(id) {
    if (confirm('Delete this savings goal?')) {
      state.goals = state.goals.filter(g => g.id !== id);
      saveGoals();
      renderSavingsGoals();
      showToast('Savings goal removed.', 'warn');
    }
  }

  // --- Deposit Funds Modal ---
  function openDepositModal(id) {
    const goal = state.goals.find(g => g.id === id);
    if (!goal) return;

    depositGoalId.value = goal.id;
    depositGoalNameText.textContent = `Adding money to "${goal.title}" (Currently ${formatMoney(goal.current)} of ${formatMoney(goal.target)})`;
    document.getElementById('depositAmount').value = '';
    depositModalBackdrop.classList.remove('hide');
  }

  function closeDepositModal() {
    depositModalBackdrop.classList.add('hide');
  }

  function confirmDeposit(e) {
    e.preventDefault();
    const id = depositGoalId.value;
    const goal = state.goals.find(g => g.id === id);
    if (!goal) return;

    const amount = parseFloat(document.getElementById('depositAmount').value);
    const shouldRecordTx = document.getElementById('deductFromBalanceCheck').checked;

    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid deposit amount.', 'warn');
      return;
    }

    goal.current += amount;
    saveGoals();

    if (shouldRecordTx) {
      const depositTx = {
        id: 'tx_' + Date.now(),
        type: 'expense',
        title: `Savings: ${goal.title}`,
        amount: amount,
        category: 'Other Expenses',
        date: getFormattedCurrentDate(),
        tag: '#savings'
      };
      state.transactions.unshift(depositTx);
      saveTransactions();
    }

    closeDepositModal();
    renderAll();

    if (goal.current >= goal.target) {
      fireConfetti();
      showToast(`🎉 WOW! You achieved your goal "${goal.title}"! Congratulations!`);
    } else {
      showToast(`Deposited ${formatMoney(amount)} into ${goal.title}!`);
    }
  }

  // --- Confetti Particle Cannon for Savings Goals ---
  function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#38bdf8'];
    const particles = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        w: Math.random() * 8 + 4,
        h: Math.random() * 8 + 4,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.rSpeed;
        p.opacity -= 0.014;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    update();
  }

  // --- CSV Export Feature ---
  function exportToCSV() {
    const list = state.transactions;
    if (list.length === 0) {
      showToast('No transactions to export!', 'warn');
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Currency', 'Tags'];
    const rows = list.map(tx => [
      `"${tx.date}"`,
      `"${tx.type}"`,
      `"${tx.category}"`,
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.amount,
      `"${state.currency}"`,
      `"${(tx.tag || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusFunds_Transactions_${state.selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Transactions CSV exported successfully!');
  }

  // --- Populate Demo Data ---
  function loadDemoData() {
    if (confirm('Load sample student budget data? This will add realistic allowance and campus expense items.')) {
      state.transactions = [...DEFAULT_TRANSACTIONS];
      state.budgets = { ...DEFAULT_BUDGETS };
      state.goals = [...DEFAULT_GOALS];
      saveTransactions();
      saveBudgets();
      saveGoals();
      renderAll();
      showToast('Realistic student demo data loaded! 🎓');
    }
  }

  // --- Render Everything Helper ---
  function renderAll() {
    renderMetrics();
    renderDonutChart();
    renderCategoryLegend();
    renderBudgetBars();
    renderTransactions();
    renderSavingsGoals();
    calculateBillSplit();
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Currency change
    currencySelect.addEventListener('change', (e) => {
      state.currency = e.target.value;
      localStorage.setItem('cf_currency', state.currency);
      updateCurrencyLabels();
      renderAll();
      showToast(`Currency updated to ${state.currency}`);
    });

    // Month change
    monthSelect.addEventListener('change', (e) => {
      state.selectedMonth = e.target.value;
      renderAll();
    });

    // Theme toggle
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });

    // Next Tip
    nextTipBtn.addEventListener('click', nextTip);

    // Demo Data
    demoDataBtn.addEventListener('click', loadDemoData);

    // Export CSV
    exportCsvBtn.addEventListener('click', exportToCSV);

    // Add Transaction Modal
    openAddModalBtn.addEventListener('click', () => openAddTransactionModal('expense'));
    closeTxModalBtn.addEventListener('click', closeTxModal);
    cancelTxBtn.addEventListener('click', closeTxModal);
    txForm.addEventListener('submit', saveTransactionFromForm);

    typeExpenseBtn.addEventListener('click', () => setModalType('expense'));
    typeIncomeBtn.addEventListener('click', () => setModalType('income'));

    // Category Budgets Modal
    openBudgetModalBtn.addEventListener('click', openBudgetModal);
    closeBudgetModalBtn.addEventListener('click', closeBudgetModal);
    cancelBudgetBtn.addEventListener('click', closeBudgetModal);
    saveBudgetsBtn.addEventListener('click', saveBudgets);

    // Goals Modal
    openGoalModalBtn.addEventListener('click', openGoalModal);
    closeGoalModalBtn.addEventListener('click', closeGoalModal);
    cancelGoalBtn.addEventListener('click', closeGoalModal);
    goalForm.addEventListener('submit', saveGoal);

    // Deposit Modal
    closeDepositModalBtn.addEventListener('click', closeDepositModal);
    cancelDepositBtn.addEventListener('click', closeDepositModal);
    depositForm.addEventListener('submit', confirmDeposit);

    // Type Filter Pills
    document.querySelectorAll('#txTypeFilter .pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#txTypeFilter .pill-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.activeTypeFilter = e.target.dataset.filter;
        renderTransactions();
      });
    });

    // History Scope Pills (This Month vs All History)
    document.querySelectorAll('#txScopeFilter .pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#txScopeFilter .pill-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.historyScope = e.target.dataset.scope;
        renderTransactions();
      });
    });

    // Category Dropdown Filter
    const catFilterSelect = document.getElementById('txCategoryFilter');
    if (catFilterSelect) {
      catFilterSelect.addEventListener('change', (e) => {
        state.categoryFilter = e.target.value;
        renderTransactions();
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('txSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortOrder = e.target.value;
        renderTransactions();
      });
    }

    // Search input
    txSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderTransactions();
    });

    // Roommate Splitter Inputs
    [splitTotalAmount, splitNumPeople, splitTipPercent, splitFriendsList].forEach(input => {
      input.addEventListener('input', calculateBillSplit);
    });
    recordMyShareBtn.addEventListener('click', recordMySplitShare);

    // Receipt Modal Listeners
    if (closeReceiptModalBtn) closeReceiptModalBtn.addEventListener('click', closeReceiptModal);
    if (closeReceiptBtn) closeReceiptBtn.addEventListener('click', closeReceiptModal);
    if (printReceiptBtn) printReceiptBtn.addEventListener('click', () => window.print());

    // Close modals on clicking backdrop
    [txModalBackdrop, budgetModalBackdrop, goalModalBackdrop, depositModalBackdrop, receiptModalBackdrop].forEach(backdrop => {
      if (!backdrop) return;
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.add('hide');
        }
      });
    });

    // Keyboard escape to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        [txModalBackdrop, budgetModalBackdrop, goalModalBackdrop, depositModalBackdrop, receiptModalBackdrop].forEach(b => {
          if (b) b.classList.add('hide');
        });
      }
    });

    // Reset All Data for New Semester
    const resetBtn = document.getElementById('resetAllDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('⚠️ Start Fresh for New Semester?\n\nThis will clear all transactions, category budgets, and savings goals stored in your browser. (You can click "Demo Data" anytime to reload sample data).')) {
          localStorage.removeItem('cf_transactions');
          localStorage.removeItem('cf_budgets');
          localStorage.removeItem('cf_goals');
          state.transactions = [];
          state.budgets = {};
          state.goals = [];
          renderAll();
          showToast('All data reset! Clean slate for your new semester.', 'warn');
        }
      });
    }

    // Global Power-User Keyboard Shortcuts: N (New Tx), T (Theme), D (Demo)
    window.addEventListener('keydown', (e) => {
      const activeTag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      // Don't trigger if any modal is currently visible
      const isAnyModalOpen = [txModalBackdrop, budgetModalBackdrop, goalModalBackdrop, depositModalBackdrop, receiptModalBackdrop].some(m => m && !m.classList.contains('hide'));

      if ((e.key === 'n' || e.key === 'N') && !isAnyModalOpen) {
        e.preventDefault();
        openAddTransactionModal('expense');
      } else if ((e.key === 't' || e.key === 'T') && !isAnyModalOpen) {
        e.preventDefault();
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        showToast(`Theme switched to ${nextTheme} mode!`);
      } else if ((e.key === 'd' || e.key === 'D') && !isAnyModalOpen) {
        e.preventDefault();
        loadDemoData();
      }
    });

    // Window resize redrawing chart for crispness
    window.addEventListener('resize', () => {
      renderDonutChart();
    });
  }

  // --- Utility: Format Date nicely ---
  function formatDateString(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  // --- Utility: Escape HTML ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
