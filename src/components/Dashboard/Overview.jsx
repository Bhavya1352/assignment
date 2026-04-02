import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { calculateTotals, getBalanceTrend, getCategoryBreakdown, formatCurrency } from '../../utils/helpers';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { AnimatedCounter } from '../Common/AnimatedCounter';

export const Overview = () => {
  const { state: { transactions, darkMode }, dispatch } = useFinance();

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const trendData = useMemo(() => getBalanceTrend(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryBreakdown(transactions), [transactions]);

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
          <p className="intro" style={{ color: payload[0].color }}>
            {`Balance: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    // ... existing tooltip code ...
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: darkMode ? '#1e1e1e' : '#fff',
          padding: '10px',
          border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
          borderRadius: '8px',
          color: darkMode ? '#fff' : '#333'
        }}>
          <p className="label">{`${payload[0].name}`}</p>
          <p className="intro" style={{ color: payload[0].payload.color }}>
            {`${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const savingsGoal = 300000; // 3 Lakh mock goal
  const progressPercent = Math.min((totals.balance / savingsGoal) * 100, 100);

  return (
    <div className="overview-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">{getGreeting()}, JD 👋</h2>
          <p className="section-subtitle">Here's what's happening with your finances today.</p>
        </div>
      </div>
      
      <div className="summary-cards">
        <div 
          className="card balance-card clickable-card" 
          style={{ flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'SET_TAB', payload: 'transactions' });
            dispatch({ type: 'SET_FILTER', payload: { key: 'type', value: 'all' } });
          }}
          title="Click to view all transactions"
        >
          <div className="flex align-center justify-between" style={{ width: '100%' }}>
            <div className="card-info">
              <h3>Total Balance</h3>
              <p className="amount"><AnimatedCounter value={totals.balance} /></p>
            </div>
            <div className="card-icon"><FiDollarSign /></div>
          </div>
          
          <div className="savings-goal-wrapper">
            <div className="savings-goal-header">
              <span>Savings Goal</span>
              <span className="primary bold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
        
        <div 
          className="card income-card clickable-card"
          onClick={() => {
            dispatch({ type: 'SET_TAB', payload: 'transactions' });
            dispatch({ type: 'SET_FILTER', payload: { key: 'type', value: 'income' } });
          }}
          style={{ cursor: 'pointer' }}
          title="Click to view only Income"
        >
          <div className="card-icon"><FiTrendingUp /></div>
          <div className="card-info">
            <h3>Total Income</h3>
            <p className="amount success"><AnimatedCounter value={totals.income} /></p>
          </div>
        </div>
        
        <div 
          className="card expense-card clickable-card"
          onClick={() => {
            dispatch({ type: 'SET_TAB', payload: 'transactions' });
            dispatch({ type: 'SET_FILTER', payload: { key: 'type', value: 'expense' } });
          }}
          style={{ cursor: 'pointer' }}
          title="Click to view only Expenses"
        >
          <div className="card-icon"><FiTrendingDown /></div>
          <div className="card-info">
            <h3>Total Expenses</h3>
            <p className="amount danger"><AnimatedCounter value={totals.expenses} /></p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Balance Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#e0e0e0'} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke={darkMode ? '#888' : '#666'} 
                  tick={{fill: darkMode ? '#888' : '#666', fontSize: 12}} 
                  minTickGap={40}
                  tickMargin={10}
                />
                <YAxis stroke={darkMode ? '#888' : '#666'} tick={{fill: darkMode ? '#888' : '#666'}} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="balance" stroke="#4F46E5" fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Spending Breakdown</h3>
          <div className="chart-wrapper">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="40%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
                    formatter={(value, entry) => <span style={{ color: darkMode ? '#ccc' : '#333', fontSize: '13px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No expense data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
