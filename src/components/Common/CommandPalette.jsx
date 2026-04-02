import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FiSearch, FiMonitor, FiList, FiPieChart, FiPlus, FiMoon, FiSun, FiShield } from 'react-icons/fi';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { state, dispatch } = useFinance();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    { id: 'go-dashboard', title: 'Go to Dashboard', icon: <FiMonitor />, onSelect: () => dispatch({ type: 'SET_TAB', payload: 'dashboard' }) },
    { id: 'go-transactions', title: 'Go to Transactions', icon: <FiList />, onSelect: () => dispatch({ type: 'SET_TAB', payload: 'transactions' }) },
    { id: 'go-insights', title: 'Go to Insights', icon: <FiPieChart />, onSelect: () => dispatch({ type: 'SET_TAB', payload: 'insights' }) },
    { id: 'add-transaction', title: 'Add New Transaction', icon: <FiPlus />, onSelect: () => {
        if (state.role === 'admin') dispatch({ type: 'TOGGLE_ADD_MODAL' });
        else alert('Must be Admin to add transactions');
    }},
    { id: 'toggle-theme', title: 'Toggle Dark/Light Mode', icon: state.darkMode ? <FiSun /> : <FiMoon />, onSelect: () => dispatch({ type: 'TOGGLE_THEME' }) },
    { id: 'toggle-role', title: `Switch to ${state.role === 'admin' ? 'Viewer' : 'Admin'} Role`, icon: <FiShield />, onSelect: () => dispatch({ type: 'SET_ROLE', payload: state.role === 'admin' ? 'viewer' : 'admin' }) },
  ];

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)} style={{ zIndex: 10000, backdropFilter: 'blur(8px)' }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '500px', padding: 0, overflow: 'hidden', height: 'auto', border: `1px solid ${state.darkMode ? '#333' : '#e0e0e0'}` }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cmd-header" style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${state.darkMode ? '#333' : '#eee'}` }}>
          <FiSearch style={{ color: '#888', marginRight: '12px', fontSize: '1.2rem' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: state.darkMode ? '#fff' : '#000', fontSize: '1.1rem' }}
          />
        </div>
        
        <div className="cmd-body" style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px 0' }}>
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => (
              <div
                key={action.id}
                className="cmd-item"
                onClick={() => {
                  action.onSelect();
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  gap: '12px',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                  color: state.darkMode ? '#ddd' : '#333'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = state.darkMode ? 'rgba(255,255,255,0.05)' : '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {action.icon}
                {action.title}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              No commands found.
            </div>
          )}
        </div>
        
        <div className="cmd-footer" style={{ borderTop: `1px solid ${state.darkMode ? '#333' : '#eee'}`, padding: '10px 20px', fontSize: '0.8rem', color: '#888', background: state.darkMode ? '#111' : '#f9fafb' }}>
          <span>Use <kbd style={{ background: state.darkMode ? '#333' : '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>↑</kbd> <kbd style={{ background: state.darkMode ? '#333' : '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>↓</kbd> to navigate, <kbd style={{ background: state.darkMode ? '#333' : '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>Enter</kbd> to select, <kbd style={{ background: state.darkMode ? '#333' : '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>Esc</kbd> to close.</span>
        </div>
      </div>
    </div>
  );
};
