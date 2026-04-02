import React, { useEffect, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

export const ToastContainer = () => {
  const { state, dispatch } = useFinance();
  const { notifications } = state;

  return (
    <div className="toast-container">
      {notifications.map((toast) => (
        <Toast key={toast.id} toast={toast} dispatch={dispatch} />
      ))}
    </div>
  );
};

const Toast = ({ toast, dispatch }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: toast.id });
      }, 300); // Wait for exit animation
    }, 4000); // Show for 4 seconds

    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <FiCheckCircle className="toast-icon success" />;
      case 'error': return <FiAlertCircle className="toast-icon error" />;
      default: return <FiInfo className="toast-icon info" />;
    }
  };

  return (
    <div className={`toast-message toast-${toast.type} ${isClosing ? 'toast-exit' : 'toast-enter'}`}>
      {getIcon()}
      <div className="toast-content">{toast.message}</div>
    </div>
  );
};
