import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { generateTransactions, ROLES } from '../data/mockData';

const FinanceContext = createContext();

const STORAGE_KEY = 'finance_dashboard_state_v2';

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return null;
};

const saveToStorage = (state) => {
  try {
    const toSave = {
      transactions: state.transactions,
      role: state.role,
      darkMode: state.darkMode,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

const initialState = {
  transactions: generateTransactions(),
  role: ROLES.ADMIN,
  darkMode: true,
  activeTab: 'dashboard',
  isLoading: true, // NEW: Simulating mock API
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  editingTransaction: null,
  showAddModal: false,
  notifications: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      };

    case 'ADD_TRANSACTION': {
      const newTransaction = {
        ...action.payload,
        id: Math.max(...state.transactions.map((t) => t.id), 0) + 1,
        status: 'completed',
      };
      return {
        ...state,
        transactions: [newTransaction, ...state.transactions],
        showAddModal: false,
        notifications: [
          ...state.notifications,
          { id: Date.now(), message: 'Transaction added successfully!', type: 'success' },
        ],
      };
    }

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
        editingTransaction: null,
        notifications: [
          ...state.notifications,
          { id: Date.now(), message: 'Transaction updated successfully!', type: 'success' },
        ],
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
        notifications: [
          ...state.notifications,
          { id: Date.now(), message: 'Transaction deleted!', type: 'info' },
        ],
      };

    case 'SET_EDITING':
      return { ...state, editingTransaction: action.payload };

    case 'TOGGLE_ADD_MODAL':
      return { ...state, showAddModal: !state.showAddModal };

    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { id: Date.now(), message: action.payload.message, type: action.payload.type || 'info' }
        ]
      };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export const FinanceProvider = ({ children }) => {
  const stored = loadFromStorage();
  const init = stored
    ? {
        ...initialState,
        transactions: stored.transactions || initialState.transactions,
        role: stored.role || initialState.role,
        darkMode: stored.darkMode !== undefined ? stored.darkMode : initialState.darkMode,
      }
    : initialState;

  const [state, dispatch] = useReducer(reducer, init);

  // MOCK API: Simulate network delay for initial load
  useEffect(() => {
    if (state.isLoading) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1200); // 1.2s delay to show loading skeletons
      return () => clearTimeout(timer);
    }
  }, [state.isLoading]);

  // Persist to localStorage
  useEffect(() => {
    if (!state.isLoading) {
      saveToStorage(state);
    }
  }, [state.transactions, state.role, state.darkMode, state.isLoading]);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'DISMISS_NOTIFICATION', payload: state.notifications[0].id });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.notifications]);

  // Filtered and sorted transactions
  const getFilteredTransactions = useCallback(() => {
    let filtered = [...state.transactions];

    // Search filter
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(search) ||
          t.category.toLowerCase().includes(search)
      );
    }

    // Type filter
    if (state.filters.type !== 'all') {
      filtered = filtered.filter((t) => t.type === state.filters.type);
    }

    // Category filter
    if (state.filters.category !== 'all') {
      filtered = filtered.filter((t) => t.category === state.filters.category);
    }

    // Date range filter
    if (state.filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      switch (state.filters.dateRange) {
        case '7d':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30d':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90d':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        filtered = filtered.filter((t) => new Date(t.date) >= startDate);
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (state.filters.sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return state.filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [state.transactions, state.filters]);

  const value = {
    state,
    dispatch,
    getFilteredTransactions,
    isAdmin: state.role === ROLES.ADMIN,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
