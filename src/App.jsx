import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import BalanceTrend from './components/BalanceTrend';
import SpendingBreakdown from './components/SpendingBreakdown';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import InsightsPanel from './components/InsightsPanel';
import RecentTransactions from './components/RecentTransactions';
import './App.css';

const DashboardPage = () => (
  <div className="page page--dashboard" id="dashboard-page">
    <div className="page__header">
      <h2 className="page__title">Dashboard Overview</h2>
      <p className="page__subtitle">Welcome back! Here's your financial summary.</p>
    </div>
    <SummaryCards />
    <div className="dashboard-grid">
      <BalanceTrend />
      <SpendingBreakdown />
    </div>
    <RecentTransactions />
  </div>
);

const TransactionsPage = () => (
  <div className="page page--transactions" id="transactions-page">
    <TransactionList />
  </div>
);

const InsightsPage = () => (
  <div className="page page--insights" id="insights-page">
    <InsightsPanel />
  </div>
);

const AppContent = () => {
  const { state } = useApp();
  const { activeTab } = state;

  return (
    <div className="app" id="finance-hub-app">
      <Sidebar />
      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'transactions' && <TransactionsPage />}
        {activeTab === 'insights' && <InsightsPage />}
      </main>
      <TransactionModal />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
