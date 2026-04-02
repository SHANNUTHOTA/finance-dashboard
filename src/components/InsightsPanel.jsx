import { useApp } from '../context/AppContext';
import { getInsights, formatCurrency, getSpendingByCategory } from '../utils/helpers';
import { MONTHLY_DATA } from '../data/mockData';
import {
  TrendingUp, TrendingDown, Target, Zap, PieChart as PieIcon,
  BarChart3, Activity, AlertTriangle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="chart-tooltip__value" style={{ color: entry.color || entry.fill }}>
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const InsightsPanel = () => {
  const { state } = useApp();
  const insights = getInsights(state.transactions, state.categories);
  const spendingData = getSpendingByCategory(state.transactions, state.categories);

  const insightCards = [
    {
      icon: Zap,
      title: 'Highest Spending',
      value: insights.highestCategory ? `${insights.highestCategory.icon} ${insights.highestCategory.name}` : 'N/A',
      detail: insights.highestCategory ? formatCurrency(insights.highestCategory.value) : '',
      color: '#FF6B6B',
    },
    {
      icon: Target,
      title: 'Savings Rate',
      value: `${insights.savingsRate}%`,
      detail: Number(insights.savingsRate) >= 20 ? 'Great! Above 20% target' : 'Below 20% target',
      color: Number(insights.savingsRate) >= 20 ? '#7ED321' : '#FFEAA7',
    },
    {
      icon: Activity,
      title: 'Avg Transaction',
      value: formatCurrency(Math.round(insights.avgTransaction)),
      detail: `Across ${state.transactions.filter(t => t.type === 'expense').length} expenses`,
      color: '#45B7D1',
    },
    {
      icon: BarChart3,
      title: 'Monthly Change',
      value: `${insights.expenseChange > 0 ? '+' : ''}${insights.expenseChange}%`,
      detail: insights.expenseChange > 0 ? 'Spending increased' : 'Spending decreased',
      color: insights.expenseChange > 0 ? '#FF6B6B' : '#7ED321',
    },
    {
      icon: PieIcon,
      title: 'Income Streams',
      value: insights.incomeStreams,
      detail: 'Active income sources',
      color: '#6C5CE7',
    },
    {
      icon: insights.lowestCategory ? TrendingDown : AlertTriangle,
      title: 'Lowest Spending',
      value: insights.lowestCategory ? `${insights.lowestCategory.icon} ${insights.lowestCategory.name}` : 'N/A',
      detail: insights.lowestCategory ? formatCurrency(insights.lowestCategory.value) : '',
      color: '#4ECDC4',
    },
  ];

  return (
    <div className="insights-section" id="insights-section">
      <div className="section-header">
        <h2 className="section-title">Financial Insights</h2>
        <p className="section-subtitle">Key observations from your financial data</p>
      </div>

      <div className="insights-grid">
        {insightCards.map((card, i) => (
          <div
            key={i}
            className="insight-card"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="insight-card__icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <card.icon size={22} />
            </div>
            <div className="insight-card__content">
              <span className="insight-card__label">{card.title}</span>
              <span className="insight-card__value">{card.value}</span>
              <span className="insight-card__detail">{card.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="chart-card" id="monthly-comparison-chart">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Monthly Income vs Expenses</h3>
          <span className="chart-card__subtitle">Side-by-side comparison over the last 7 months</span>
        </div>
        <div className="chart-card__body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={state.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
              <XAxis
                dataKey="month"
                stroke={state.darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke={state.darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}
                fontSize={12}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#7ED321" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Ranking */}
      <div className="chart-card" id="spending-ranking">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Category Spending Ranking</h3>
          <span className="chart-card__subtitle">From highest to lowest</span>
        </div>
        <div className="chart-card__body">
          {spendingData.length === 0 ? (
            <div className="chart-card__body--empty">
              <p>No spending data to display</p>
            </div>
          ) : (
            <div className="spending-ranking">
              {spendingData.map((item, i) => {
                const maxVal = spendingData[0].value;
                const pct = (item.value / maxVal) * 100;
                return (
                  <div key={i} className="spending-rank-item" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="spending-rank-item__header">
                      <div className="spending-rank-item__left">
                        <span className="spending-rank-item__rank">#{i + 1}</span>
                        <span className="spending-rank-item__icon">{item.icon}</span>
                        <span className="spending-rank-item__name">{item.name}</span>
                      </div>
                      <span className="spending-rank-item__amount">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="spending-rank-item__bar">
                      <div
                        className="spending-rank-item__fill"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
