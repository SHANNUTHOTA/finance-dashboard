import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, getRelativeDate, getCategoryById } from '../utils/helpers';
import {
  Search, Filter, SortAsc, SortDesc, Plus, Pencil, Trash2,
  ArrowUpRight, ArrowDownLeft, Download, X, RotateCcw
} from 'lucide-react';
import { exportToCSV, exportToJSON } from '../utils/helpers';
import { useState } from 'react';

const TransactionList = () => {
  const { state, dispatch } = useApp();
  const { transactions, categories, filters, role } = state;
  const [exportMenu, setExportMenu] = useState(false);

  // Apply filters
  let filtered = [...transactions];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(query) ||
      getCategoryById(categories, t.category).name.toLowerCase().includes(query)
    );
  }

  if (filters.type !== 'all') {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  if (filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  // Sort
  filtered.sort((a, b) => {
    let compare = 0;
    switch (filters.sortBy) {
      case 'date':
        compare = new Date(a.date) - new Date(b.date);
        break;
      case 'amount':
        compare = a.amount - b.amount;
        break;
      case 'description':
        compare = a.description.localeCompare(b.description);
        break;
      default:
        compare = new Date(a.date) - new Date(b.date);
    }
    return filters.sortOrder === 'desc' ? -compare : compare;
  });

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.category !== 'all';

  return (
    <div className="transactions-section" id="transactions-section">
      <div className="transactions-section__header">
        <div>
          <h2 className="section-title">Transactions</h2>
          <p className="section-subtitle">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        <div className="transactions-section__actions">
          {role === 'admin' && (
            <button
              className="btn btn--primary"
              onClick={() => dispatch({ type: 'TOGGLE_ADD_MODAL' })}
              id="add-transaction-btn"
            >
              <Plus size={16} />
              <span>Add Transaction</span>
            </button>
          )}
          <div className="export-dropdown">
            <button
              className="btn btn--outline"
              onClick={() => setExportMenu(!exportMenu)}
              id="export-btn"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            {exportMenu && (
              <div className="export-dropdown__menu">
                <button onClick={() => { exportToCSV(filtered, categories); setExportMenu(false); }}>
                  Export as CSV
                </button>
                <button onClick={() => { exportToJSON(filtered); setExportMenu(false); }}>
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="transactions-filters" id="transaction-filters">
        <div className="transactions-filters__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { key: 'search', value: e.target.value } })}
            id="search-input"
          />
          {filters.search && (
            <button className="transactions-filters__clear" onClick={() => dispatch({ type: 'SET_FILTER', payload: { key: 'search', value: '' } })}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="transactions-filters__group">
          <select
            value={filters.type}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { key: 'type', value: e.target.value } })}
            className="filter-select"
            id="type-filter"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { key: 'category', value: e.target.value } })}
            className="filter-select"
            id="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { key: 'sortBy', value: e.target.value } })}
            className="filter-select"
            id="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="description">Sort by Name</option>
          </select>

          <button
            className="btn btn--icon"
            onClick={() => dispatch({
              type: 'SET_FILTER',
              payload: { key: 'sortOrder', value: filters.sortOrder === 'asc' ? 'desc' : 'asc' }
            })}
            id="sort-order-btn"
            title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {filters.sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
          </button>

          {hasActiveFilters && (
            <button
              className="btn btn--ghost"
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              id="reset-filters-btn"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Transaction List */}
      {filtered.length === 0 ? (
        <div className="empty-state" id="empty-transactions">
          <div className="empty-state__icon">📭</div>
          <h3 className="empty-state__title">No transactions found</h3>
          <p className="empty-state__text">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more results.'
              : 'Start by adding your first transaction.'}
          </p>
          {hasActiveFilters && (
            <button className="btn btn--primary" onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="transactions-list">
          {filtered.map((tx, i) => {
            const cat = getCategoryById(categories, tx.category);
            return (
              <div
                key={tx.id}
                className="transaction-item"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
              >
                <div className="transaction-item__left">
                  <div
                    className="transaction-item__icon"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div className="transaction-item__details">
                    <span className="transaction-item__desc">{tx.description}</span>
                    <span className="transaction-item__meta">
                      {cat.name} • {getRelativeDate(tx.date)}
                    </span>
                  </div>
                </div>
                <div className="transaction-item__right">
                  <span className={`transaction-item__amount transaction-item__amount--${tx.type}`}>
                    {tx.type === 'income' ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownLeft size={14} />
                    )}
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="transaction-item__date">{formatDate(tx.date)}</span>
                  {role === 'admin' && (
                    <div className="transaction-item__actions">
                      <button
                        className="btn btn--icon-sm"
                        onClick={() => dispatch({ type: 'SET_EDITING_TRANSACTION', payload: tx })}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn--icon-sm btn--icon-danger"
                        onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: tx.id })}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
