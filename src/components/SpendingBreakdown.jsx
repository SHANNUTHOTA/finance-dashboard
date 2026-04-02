import { useApp } from '../context/AppContext';
import { getSpendingByCategory, formatCurrency } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{payload[0].payload.icon} {payload[0].name}</p>
        <p className="chart-tooltip__value" style={{ color: payload[0].payload.color }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingBreakdown = () => {
  const { state } = useApp();
  const spendingData = getSpendingByCategory(state.transactions, state.categories);
  const totalExpenses = spendingData.reduce((sum, item) => sum + item.value, 0);

  if (spendingData.length === 0) {
    return (
      <div className="chart-card" id="spending-breakdown-chart">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Spending Breakdown</h3>
        </div>
        <div className="chart-card__body chart-card__body--empty">
          <p>No expense data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card" id="spending-breakdown-chart">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Spending Breakdown</h3>
        <span className="chart-card__subtitle">By category</span>
      </div>
      <div className="chart-card__body spending-breakdown">
        <div className="spending-breakdown__chart">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                animationBegin={0}
                animationDuration={800}
              >
                {spendingData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="spending-breakdown__legend">
          {spendingData.slice(0, 6).map((item, i) => (
            <div key={i} className="spending-legend-item">
              <div className="spending-legend-item__left">
                <span className="spending-legend-item__dot" style={{ backgroundColor: item.color }} />
                <span className="spending-legend-item__icon">{item.icon}</span>
                <span className="spending-legend-item__name">{item.name}</span>
              </div>
              <div className="spending-legend-item__right">
                <span className="spending-legend-item__amount">{formatCurrency(item.value)}</span>
                <span className="spending-legend-item__pct">
                  {((item.value / totalExpenses) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingBreakdown;
