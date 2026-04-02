// Mock transaction data for the finance dashboard
export const CATEGORIES = {
  FOOD: { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  TRANSPORT: { name: 'Transport', icon: '🚗', color: '#4ECDC4' },
  SHOPPING: { name: 'Shopping', icon: '🛍️', color: '#45B7D1' },
  ENTERTAINMENT: { name: 'Entertainment', icon: '🎮', color: '#96CEB4' },
  BILLS: { name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7' },
  HEALTH: { name: 'Healthcare', icon: '🏥', color: '#DDA0DD' },
  EDUCATION: { name: 'Education', icon: '📚', color: '#98D8C8' },
  SALARY: { name: 'Salary', icon: '💰', color: '#7ED6DF' },
  FREELANCE: { name: 'Freelance', icon: '💻', color: '#E056A0' },
  INVESTMENT: { name: 'Investment', icon: '📈', color: '#F8B500' },
  RENT: { name: 'Rent', icon: '🏠', color: '#FF8A5C' },
  GROCERIES: { name: 'Groceries', icon: '🛒', color: '#88D498' },
};

export const generateTransactions = () => {
  const today = new Date();
  const generateRelativeDate = (daysAgo) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  return [
    // Today / Recent
    { id: 46, date: generateRelativeDate(0), description: 'Salary', amount: 95000, type: 'income', category: 'SALARY', status: 'completed' },
    { id: 45, date: generateRelativeDate(1), description: 'Netflix Subscription', amount: 649, type: 'expense', category: 'ENTERTAINMENT', status: 'completed' },
    { id: 44, date: generateRelativeDate(2), description: 'Zomato Lunch', amount: 850, type: 'expense', category: 'FOOD', status: 'completed' },
    { id: 43, date: generateRelativeDate(3), description: 'Uber Ride', amount: 350, type: 'expense', category: 'TRANSPORT', status: 'completed' },
    { id: 42, date: generateRelativeDate(5), description: 'Grocery Shopping', amount: 4200, type: 'expense', category: 'GROCERIES', status: 'completed' },
    
    // Past Week
    { id: 41, date: generateRelativeDate(8), description: 'Electricity Bill', amount: 2800, type: 'expense', category: 'BILLS', status: 'completed' },
    { id: 40, date: generateRelativeDate(10), description: 'Coffee Shop', amount: 450, type: 'expense', category: 'FOOD', status: 'completed' },
    { id: 39, date: generateRelativeDate(12), description: 'Freelance Design', amount: 15000, type: 'income', category: 'FREELANCE', status: 'completed' },
    { id: 38, date: generateRelativeDate(14), description: 'Gym Membership', amount: 2500, type: 'expense', category: 'HEALTH', status: 'completed' },
    { id: 37, date: generateRelativeDate(15), description: 'House Rent', amount: 25000, type: 'expense', category: 'RENT', status: 'completed' },

    // Past Month
    { id: 36, date: generateRelativeDate(20), description: 'Amazon Shopping', amount: 5600, type: 'expense', category: 'SHOPPING', status: 'completed' },
    { id: 35, date: generateRelativeDate(22), description: 'Doctor Visit', amount: 1200, type: 'expense', category: 'HEALTH', status: 'completed' },
    { id: 34, date: generateRelativeDate(25), description: 'Stock Investment', amount: 10000, type: 'expense', category: 'INVESTMENT', status: 'completed' },
    { id: 33, date: generateRelativeDate(30), description: 'Salary', amount: 95000, type: 'income', category: 'SALARY', status: 'completed' },
    { id: 32, date: generateRelativeDate(32), description: 'Internet Bill', amount: 1199, type: 'expense', category: 'BILLS', status: 'completed' },

    // Older
    { id: 31, date: generateRelativeDate(40), description: 'Weekend Trip', amount: 8500, type: 'expense', category: 'ENTERTAINMENT', status: 'completed' },
    { id: 30, date: generateRelativeDate(45), description: 'House Rent', amount: 25000, type: 'expense', category: 'RENT', status: 'completed' },
    { id: 29, date: generateRelativeDate(48), description: 'Grocery Check', amount: 3500, type: 'expense', category: 'GROCERIES', status: 'completed' },
    { id: 28, date: generateRelativeDate(55), description: 'Freelance Dev Project', amount: 22000, type: 'income', category: 'FREELANCE', status: 'completed' },
    { id: 27, date: generateRelativeDate(60), description: 'Salary', amount: 90000, type: 'income', category: 'SALARY', status: 'completed' },
    
    // Even Older for Chart Trend Density
    { id: 26, date: generateRelativeDate(65), description: 'New Monitor', amount: 14000, type: 'expense', category: 'SHOPPING', status: 'completed' },
    { id: 25, date: generateRelativeDate(70), description: 'Udemy Courses', amount: 3500, type: 'expense', category: 'EDUCATION', status: 'completed' },
    { id: 24, date: generateRelativeDate(75), description: 'House Rent', amount: 25000, type: 'expense', category: 'RENT', status: 'completed' },
    { id: 23, date: generateRelativeDate(85), description: 'Dividend Payout', amount: 4500, type: 'income', category: 'INVESTMENT', status: 'completed' }
  ];
};

export const ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
