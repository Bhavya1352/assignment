import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FiHome, FiList, FiPieChart, FiSettings, FiLogOut } from 'react-icons/fi';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { state, dispatch } = useFinance();
  const { activeTab } = state;

  const handleTabChange = (tab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { id: 'transactions', label: 'Transactions', icon: <FiList /> },
    { id: 'insights', label: 'Insights', icon: <FiPieChart /> },
  ];

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">💼</span>
            <h2>Zorvyn</h2>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button 
                  className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-email">john@example.com</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
