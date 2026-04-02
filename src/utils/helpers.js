import { CATEGORIES, MONTHS } from '../data/mockData';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
};

export const getMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const getMonthIndex = (dateStr) => {
  return new Date(dateStr).getMonth();
};

export const getCategoryInfo = (categoryKey) => {
  return CATEGORIES[categoryKey] || { name: categoryKey, icon: '📄', color: '#999' };
};

export const calculateTotals = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
};

export const getMonthlyData = (transactions) => {
  const monthlyMap = {};

  transactions.forEach((t) => {
    const key = getMonthYear(t.date);
    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: key, income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      monthlyMap[key].income += t.amount;
    } else {
      monthlyMap[key].expenses += t.amount;
    }
  });

  return Object.values(monthlyMap).map((m) => ({
    ...m,
    balance: m.income - m.expenses,
  }));
};

export const getCategoryBreakdown = (transactions) => {
  const categoryMap = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const info = getCategoryInfo(t.category);
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = {
          name: info.name,
          value: 0,
          color: info.color,
          icon: info.icon,
          count: 0,
        };
      }
      categoryMap[t.category].value += t.amount;
      categoryMap[t.category].count += 1;
    });

  return Object.values(categoryMap).sort((a, b) => b.value - a.value);
};

export const getBalanceTrend = (transactions) => {
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let runningBalance = 0;
  const trend = [];
  const seen = new Set();

  sorted.forEach((t) => {
    runningBalance += t.type === 'income' ? t.amount : -t.amount;
    const dateKey = t.date;
    if (!seen.has(dateKey)) {
      seen.add(dateKey);
      trend.push({
        date: formatShortDate(t.date),
        fullDate: t.date,
        balance: runningBalance,
      });
    } else {
      const existing = trend.find((tr) => tr.fullDate === dateKey);
      if (existing) existing.balance = runningBalance;
    }
  });

  return trend;
};

export const getInsights = (transactions) => {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const categoryBreakdown = getCategoryBreakdown(transactions);
  const monthlyData = getMonthlyData(transactions);
  const totals = calculateTotals(transactions);

  // Highest spending category
  const highestCategory = categoryBreakdown[0] || null;

  // Average monthly spending
  const avgMonthlyExpense = monthlyData.length
    ? Math.round(monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length)
    : 0;

  // Most frequent transaction category
  const mostFrequent = categoryBreakdown.reduce(
    (max, cat) => (cat.count > (max?.count || 0) ? cat : max),
    null
  );

  // Month with highest spending
  const highestSpendMonth = monthlyData.reduce(
    (max, m) => (m.expenses > (max?.expenses || 0) ? m : max),
    null
  );

  // Savings rate
  const savingsRate = totals.income > 0 
    ? Math.round(((totals.income - totals.expenses) / totals.income) * 100) 
    : 0;

  // Monthly comparison (last 2 months)
  const monthComparison = monthlyData.length >= 2
    ? {
        current: monthlyData[monthlyData.length - 1],
        previous: monthlyData[monthlyData.length - 2],
        change: monthlyData[monthlyData.length - 1].expenses - monthlyData[monthlyData.length - 2].expenses,
        changePercent: Math.round(
          ((monthlyData[monthlyData.length - 1].expenses - monthlyData[monthlyData.length - 2].expenses) /
            monthlyData[monthlyData.length - 2].expenses) *
            100
        ),
      }
    : null;

  return {
    highestCategory,
    avgMonthlyExpense,
    mostFrequent,
    highestSpendMonth,
    savingsRate,
    monthComparison,
    totalTransactions: transactions.length,
    totalCategories: categoryBreakdown.length,
  };
};

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Status'];
  const rows = transactions.map((t) => [
    t.date,
    t.description,
    t.amount,
    t.type,
    getCategoryInfo(t.category).name,
    t.status,
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const data = transactions.map((t) => ({
    ...t,
    categoryName: getCategoryInfo(t.category).name,
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
