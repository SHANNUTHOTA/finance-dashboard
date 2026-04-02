import { useApp } from '../context/AppContext';
import { formatCurrency, getRelativeDate, getCategoryById } from '../utils/helpers';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const RecentTransactions = () => {
  const { state } = useApp();
  const { transactions, categories } = state;

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="chart-card" id="recent-transactions">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Recent Transactions</h3>
        </div>
        <div className="chart-card__body chart-card__body--empty">
          <p>No recent transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card" id="recent-transactions">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Recent Transactions</h3>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => state.dispatch?.({ type: 'SET_ACTIVE_TAB', payload: 'transactions' })}
        >
          View All
        </button>
      </div>
      <div className="chart-card__body recent-list">
        {recent.map((tx, i) => {
          const cat = getCategoryById(categories, tx.category);
          return (
            <div key={tx.id} className="recent-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="recent-item__icon" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                {cat.icon}
              </div>
              <div className="recent-item__info">
                <span className="recent-item__desc">{tx.description}</span>
                <span className="recent-item__time">
                  <Clock size={11} /> {getRelativeDate(tx.date)}
                </span>
              </div>
              <span className={`recent-item__amount recent-item__amount--${tx.type}`}>
                {tx.type === 'income' ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                {formatCurrency(tx.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;
