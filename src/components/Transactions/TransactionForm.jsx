import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../data/mockData';
import { FiX, FiCheck } from 'react-icons/fi';

export const TransactionForm = () => {
  const { state, dispatch } = useFinance();
  const { editingTransaction, showAddModal } = state;

  const initialFormState = {
    description: '',
    amount: '',
    type: 'expense',
    category: 'FOOD',
    date: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData(editingTransaction);
    } else {
      setFormData(initialFormState);
    }
  }, [editingTransaction, showAddModal]);

  if (!showAddModal) return null;

  const validate = () => {
    let newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? Number(value) : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (editingTransaction) {
        dispatch({ type: 'UPDATE_TRANSACTION', payload: formData });
      } else {
        dispatch({ type: 'ADD_TRANSACTION', payload: formData });
      }
    }
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_ADD_MODAL' });
    dispatch({ type: 'SET_EDITING', payload: null });
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <button className="icon-btn close-btn" onClick={handleClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group row">
            <div className="col type-toggle">
              <label className={`radio-label ${formData.type === 'expense' ? 'active expense' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                />
                Expense
              </label>
              <label className={`radio-label ${formData.type === 'income' ? 'active income' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                />
                Income
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What was this for?"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group row">
            <div className="col">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={errors.amount ? 'error' : ''}
              />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
            </div>
            
            <div className="col">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <div className="category-select-wrapper">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="category-select"
              >
                {Object.keys(CATEGORIES).map(key => (
                  <option key={key} value={key}>
                    {CATEGORIES[key].icon} {CATEGORIES[key].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary submit-btn">
              <FiCheck /> {editingTransaction ? 'Update' : 'Save'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
