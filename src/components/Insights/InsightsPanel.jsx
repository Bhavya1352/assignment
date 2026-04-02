import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { getInsights, formatCurrency, getCategoryInfo } from '../../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiAward, FiStar, FiActivity } from 'react-icons/fi';

export const InsightsPanel = () => {
  const { state: { transactions, darkMode } } = useFinance();

  const insights = useMemo(() => getInsights(transactions), [transactions]);
  
  const monthlyComparisonData = insights.monthComparison ? [
      {
        name: insights.monthComparison.previous.month,
        Expenses: insights.monthComparison.previous.expenses,
        Income: insights.monthComparison.previous.income,
      },
      {
        name: insights.monthComparison.current.month,
        Expenses: insights.monthComparison.current.expenses,
        Income: insights.monthComparison.current.income,
      }
    ] : [];

  const HighSpendCard = () => {
    if (!insights.highestCategory) return null;
    const catInfo = getCategoryInfo(insights.highestCategory.name); // Actually the name matches the key via helper grouping if modified, but let's use the object directly
    return (
      <div className="insight-card highlight">
        <div className="insight-icon warning"><FiAlertCircle /></div>
        <div className="insight-content">
          <h4>Highest Spending Area</h4>
          <div className="insight-value primary">
            <span className="cat-icon-large">{insights.highestCategory.icon}</span>
            {insights.highestCategory.name}
          </div>
          <p className="insight-desc">
            You've spent <span className="bold">{formatCurrency(insights.highestCategory.value)}</span> here so far.
          </p>
        </div>
      </div>
    );
  };

  const SavingsCard = () => {
    return (
      <div className="insight-card success-bg">
        <div className="insight-icon success"><FiAward /></div>
        <div className="insight-content">
          <h4>Savings Rate</h4>
          <div className="insight-value success">{insights.savingsRate}%</div>
          <p className="insight-desc">
            {insights.savingsRate > 20 
              ? "Great job! You're saving a healthy portion of your income." 
              : "Consider reviewing expenses to boost your savings rate."}
          </p>
        </div>
      </div>
    );
  };

  const TrendCard = () => {
    if (!insights.monthComparison) return null;
    
    const { changePercent, change } = insights.monthComparison;
    const isIncrease = change > 0;
    
    return (
      <div className={`insight-card ${isIncrease ? 'warning-bg' : 'success-bg'}`}>
        <div className={`insight-icon ${isIncrease ? 'warning' : 'success'}`}>
          {isIncrease ? <FiTrendingUp /> : <FiTrendingDown />}
        </div>
        <div className="insight-content">
          <h4>Month over Month Spending</h4>
          <div className={`insight-value ${isIncrease ? 'warning' : 'success'}`}>
            {isIncrease ? '+' : ''}{changePercent}%
          </div>
          <p className="insight-desc">
            You spent {formatCurrency(Math.abs(change))} {isIncrease ? 'more' : 'less'} than last month.
          </p>
        </div>
      </div>
    );
  };

  const FrequencyCard = () => {
    if (!insights.mostFrequent) return null;
    return (
      <div className="insight-card info-bg">
        <div className="insight-icon info"><FiActivity /></div>
        <div className="insight-content">
          <h4>Most Frequent Category</h4>
          <div className="insight-value info">
            <span className="cat-icon-large">{insights.mostFrequent.icon}</span>
            {insights.mostFrequent.name}
          </div>
          <p className="insight-desc">
            You made <span className="bold">{insights.mostFrequent.count}</span> transactions in this category.
          </p>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: darkMode ? '#1e1e1e' : '#fff',
          padding: '10px',
          border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
          borderRadius: '8px',
          color: darkMode ? '#fff' : '#333'
        }}>
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="insights-container">
      <div className="section-header">
        <h2 className="section-title">Financial Insights</h2>
        <p className="section-subtitle">AI-powered analysis of your spending habits</p>
      </div>

      <div className="insights-grid">
        <HighSpendCard />
        <TrendCard />
        <SavingsCard />
        <FrequencyCard />
      </div>

      {monthlyComparisonData.length > 0 && (
        <div className="chart-card large">
          <h3>Recent Month Comparison</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#e0e0e0'} vertical={false} />
                <XAxis dataKey="name" stroke={darkMode ? '#888' : '#666'} />
                <YAxis stroke={darkMode ? '#888' : '#666'} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <div className="summary-stats-banner">
        <div className="stat-item">
          <span className="stat-label">Total Transactions Analyzed</span>
          <span className="stat-value">{insights.totalTransactions}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active Categories</span>
          <span className="stat-value">{insights.totalCategories}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Monthly Spend</span>
          <span className="stat-value">{formatCurrency(insights.avgMonthlyExpense)}</span>
        </div>
      </div>
    </div>
  );
};
