import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate, getCategoryInfo } from '../../utils/helpers';
import { CATEGORIES } from '../../data/mockData';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export const TransactionList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { 
    state, 
    dispatch, 
    getFilteredTransactions, 
    isAdmin 
  } = useFinance();

  const { filters, darkMode } = state;
  const filteredTransactions = getFilteredTransactions();

  const handleFilterChange = (key, value) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  };

  const handleEdit = (transaction) => {
    dispatch({ type: 'SET_EDITING', payload: transaction });
    dispatch({ type: 'TOGGLE_ADD_MODAL' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  return (
    <div className="transactions-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Transactions</h2>
            <p className="section-subtitle">Manage and track your financial history.</p>
          </div>
          {isAdmin && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                dispatch({ type: 'SET_EDITING', payload: null });
                dispatch({ type: 'TOGGLE_ADD_MODAL' });
              }}
            >
              <FiPlus /> <span className="mobile-hidden">Add Transaction</span>
            </button>
          )}
        </div>

        {!isAdmin && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            color: 'var(--info-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 500
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <strong>Viewer Mode Active:</strong> You're currently viewing data in read-only mode. All Add/Edit/Delete actions are locked. Switch to Admin mode in the top right header to unlock controls.
          </div>
        )}

      <div className="filters-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        
        <button 
          className="btn btn-outline filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="expanded-filters">
          <div className="filter-group">
            <label>Type</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{CATEGORIES[cat].name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range</label>
            <select 
              value={filters.dateRange} 
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Order</label>
            <select 
              value={filters.sortOrder} 
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <button 
            className="btn btn-text"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          >
            Reset Filters
          </button>
        </div>
      )}

      <div className="table-responsive">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th className="text-right">Amount</th>
              {isAdmin && <th className="text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => {
                const categoryInfo = getCategoryInfo(t.category);
                return (
                  <tr key={t.id}>
                    <td className="date-col">{formatDate(t.date)}</td>
                    <td className="desc-col">
                      <div className="desc-content">{t.description}</div>
                      <div className={`type-badge-pill ${t.type.toLowerCase()}`}>
                        {t.type === 'income' ? '↑' : '↓'} {t.type}
                      </div>
                    </td>
                    <td className="category-col">
                      <span className="category-badge" style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}>
                        <span className="cat-icon">{categoryInfo.icon}</span>
                        {categoryInfo.name}
                      </span>
                    </td>
                    <td className={`amount-col text-right ${t.type === 'income' ? 'success' : ''}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    {isAdmin && (
                      <td className="actions-col text-center">
                        <button className="icon-btn edit-btn" onClick={() => handleEdit(t)} aria-label="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => handleDelete(t.id)} aria-label="Delete">
                          <FiTrash2 />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-center empty-state">
                  <div className="empty-content">
                    <div className="empty-icon">📊</div>
                    <p>No transactions found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          {filteredTransactions.length > 0 && (
            <tfoot>
              <tr className="summary-row">
                <td colSpan="3" className="text-right bold">Filtered Balance:</td>
                <td className={`text-right bold ${
                  filteredTransactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0) >= 0 
                    ? 'success' 
                    : 'danger'
                }`}>
                  {formatCurrency(filteredTransactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0))}
                </td>
                {isAdmin && <td></td>}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
