// Utility functions for the Finance Dashboard

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

export const getRelativeDate = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export const getCategoryById = (categories, id) => {
  return categories.find(c => c.id === id) || categories[categories.length - 1];
};

export const calculateTotals = (transactions) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expenses, balance: income - expenses };
};

export const getSpendingByCategory = (transactions, categories) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryMap = {};

  expenseTransactions.forEach(t => {
    if (!categoryMap[t.category]) {
      const cat = getCategoryById(categories, t.category);
      categoryMap[t.category] = { 
        name: cat.name, 
        value: 0, 
        color: cat.color, 
        icon: cat.icon,
        id: cat.id
      };
    }
    categoryMap[t.category].value += t.amount;
  });

  return Object.values(categoryMap).sort((a, b) => b.value - a.value);
};

export const getInsights = (transactions, categories) => {
  const spending = getSpendingByCategory(transactions, categories);
  const totals = calculateTotals(transactions);
  
  const highestCategory = spending[0] || null;
  const lowestCategory = spending[spending.length - 1] || null;
  
  // Monthly comparison
  const currentMonth = new Date().getMonth();
  const currentMonthTx = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
  const lastMonthTx = transactions.filter(t => new Date(t.date).getMonth() === currentMonth - 1);
  
  const currentMonthExpenses = currentMonthTx
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const lastMonthExpenses = lastMonthTx
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseChange = lastMonthExpenses > 0 
    ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1) 
    : 0;

  const avgTransaction = totals.expenses / transactions.filter(t => t.type === 'expense').length || 0;

  const savingsRate = totals.income > 0 
    ? ((totals.balance / totals.income) * 100).toFixed(1) 
    : 0;

  return {
    highestCategory,
    lowestCategory,
    currentMonthExpenses,
    lastMonthExpenses,
    expenseChange,
    avgTransaction,
    savingsRate,
    totalTransactions: transactions.length,
    incomeStreams: [...new Set(transactions.filter(t => t.type === 'income').map(t => t.category))].length,
  };
};

export const exportToCSV = (transactions, categories) => {
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Category'];
  const rows = transactions.map(t => {
    const cat = getCategoryById(categories, t.category);
    return [
      t.date,
      t.description,
      t.amount,
      t.type,
      cat.name,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
