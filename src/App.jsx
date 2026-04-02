import React from 'react';
import { useFinance } from './context/FinanceContext';
import { MainLayout } from './components/Layout/MainLayout';
import { Overview } from './components/Dashboard/Overview';
import { TransactionList } from './components/Transactions/TransactionList';
import { TransactionForm } from './components/Transactions/TransactionForm';
import { InsightsPanel } from './components/Insights/InsightsPanel';
import { DashboardSkeleton } from './components/Common/Skeleton';
import { ToastContainer } from './components/Common/Toast';
import { CommandPalette } from './components/Common/CommandPalette';

const AppContent = () => {
  const { state } = useFinance();
  const { activeTab, isLoading } = state;

  const renderTab = () => {
    if (isLoading) {
      return <DashboardSkeleton />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Overview />;
      case 'transactions':
        return <TransactionList />;
      case 'insights':
        return <InsightsPanel />;
      default:
        return <Overview />;
    }
  };

  return (
    <MainLayout>
      <div className="tab-content transition-fade">
        {renderTab()}
      </div>
      <TransactionForm />
      <ToastContainer />
      <CommandPalette />
    </MainLayout>
  );
};

export default AppContent;
