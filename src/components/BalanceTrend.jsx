import { useApp } from '../context/AppContext';
import { MONTHLY_DATA } from '../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="chart-tooltip__value" style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BalanceTrend = () => {
  const { state } = useApp();

  return (
    <div className="chart-card" id="balance-trend-chart">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Balance Trend</h3>
        <span className="chart-card__subtitle">Last 7 months overview</span>
      </div>
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7ED321" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7ED321" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#7ED321"
              strokeWidth={2.5}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#FF6B6B"
              strokeWidth={2.5}
              fill="url(#expenseGradient)"
            />
            <Area
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#6C5CE7"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceTrend;
