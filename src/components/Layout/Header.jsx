import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ROLES } from '../../data/mockData';
import { FiMenu, FiMoon, FiSun, FiSearch, FiBell, FiDownload } from 'react-icons/fi';
import { exportToCSV, exportToJSON } from '../../utils/helpers';

export const Header = ({ toggleSidebar }) => {
  const { state, dispatch, isAdmin } = useFinance();
  const { role, darkMode, transactions } = state;

  const handleRoleToggle = () => {
    const newRole = role === ROLES.ADMIN ? ROLES.VIEWER : ROLES.ADMIN;
    dispatch({ type: 'SET_ROLE', payload: newRole });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        message: newRole === ROLES.ADMIN ? 'Unlocked Admin Privileges' : 'Locked to Viewer Mode', 
        type: newRole === ROLES.ADMIN ? 'success' : 'info' 
      } 
    });
  };

  const handleThemeToggle = () => {
    dispatch({ type: 'SET_DARK_MODE', payload: !darkMode });
  };

  const [showExportMenu, setShowExportMenu] = React.useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle icon-btn" onClick={toggleSidebar} aria-label="Toggle menu">
          <FiMenu />
        </button>
        <div className="header-search">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Quick search..." />
        </div>
      </div>

      <div className="header-right">
        <div className="role-switch tooltip-container">
          <span className="role-label">{isAdmin ? 'Admin View' : 'Viewer Mode'}</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isAdmin} 
              onChange={handleRoleToggle} 
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="export-dropdown">
          <button 
            className="icon-btn tooltip-container" 
            onClick={() => setShowExportMenu(!showExportMenu)}
            aria-label="Export data"
          >
            <FiDownload />
            <span className="tooltip">Export Data</span>
          </button>
          
          {showExportMenu && (
            <div className="dropdown-menu">
              <button onClick={() => { exportToCSV(transactions); setShowExportMenu(false); }}>
                Export as CSV
              </button>
              <button onClick={() => { exportToJSON(transactions); setShowExportMenu(false); }}>
                Export as JSON
              </button>
            </div>
          )}
        </div>

        <button 
          className="icon-btn theme-toggle tooltip-container" 
          onClick={handleThemeToggle}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
        
        <button className="icon-btn notifications-btn">
          <FiBell />
          <span className="notification-badge">3</span>
        </button>
      </div>
    </header>
  );
};
