import { useApp } from '../context/AppContext';
import { calculateTotals } from '../utils/helpers';
import { formatCurrency } from '../utils/helpers';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, PiggyBank } from 'lucide-react';

const SummaryCards = () => {
  const { state } = useApp();
  const { transactions } = state;
  const { income, expenses, balance } = calculateTotals(transactions);
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  const cards = [
    {
      id: 'total-balance',
      title: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      trend: balance >= 0 ? 'positive' : 'negative',
      trendText: balance >= 0 ? 'Healthy' : 'Deficit',
      gradient: 'card-gradient--primary',
    },
    {
      id: 'total-income',
      title: 'Total Income',
      value: formatCurrency(income),
      icon: ArrowUpRight,
      trend: 'positive',
      trendText: `${((income / (income + expenses)) * 100).toFixed(0)}% of total`,
      gradient: 'card-gradient--success',
    },
    {
      id: 'total-expenses',
      title: 'Total Expenses',
      value: formatCurrency(expenses),
      icon: ArrowDownLeft,
      trend: 'negative',
      trendText: `${((expenses / (income + expenses)) * 100).toFixed(0)}% of total`,
      gradient: 'card-gradient--danger',
    },
    {
      id: 'savings-rate',
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: PiggyBank,
      trend: savingsRate >= 20 ? 'positive' : 'warning',
      trendText: savingsRate >= 20 ? 'On track' : 'Below target',
      gradient: 'card-gradient--info',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, i) => (
        <div key={card.id} className={`summary-card ${card.gradient}`} id={card.id} style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="summary-card__header">
            <span className="summary-card__title">{card.title}</span>
            <div className="summary-card__icon">
              <card.icon size={22} />
            </div>
          </div>
          <div className="summary-card__value">{card.value}</div>
          <div className={`summary-card__trend summary-card__trend--${card.trend}`}>
            {card.trend === 'positive' ? <TrendingUp size={14} /> : card.trend === 'negative' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span>{card.trendText}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
