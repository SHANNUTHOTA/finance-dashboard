import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

const TransactionModal = () => {
  const { state, dispatch } = useApp();
  const { showAddModal, editingTransaction, categories } = state;

  const isOpen = showAddModal || editingTransaction;
  const isEditing = !!editingTransaction;

  const defaultForm = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense',
    category: 'food',
  };

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        date: editingTransaction.date,
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        category: editingTransaction.category,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editingTransaction, showAddModal]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      newErrors.amount = 'Enter a valid amount';
    if (!form.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const txData = {
      ...form,
      amount: Number(form.amount),
    };

    if (isEditing) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...txData, id: editingTransaction.id } });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: txData });
    }
  };

  const handleClose = () => {
    if (isEditing) {
      dispatch({ type: 'SET_EDITING_TRANSACTION', payload: null });
    } else {
      dispatch({ type: 'TOGGLE_ADD_MODAL' });
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose} id="transaction-modal">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button className="modal__close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className={`form-input ${errors.description ? 'form-input--error' : ''}`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Grocery shopping"
              id="tx-description-input"
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                className={`form-input ${errors.amount ? 'form-input--error' : ''}`}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                min="0"
                id="tx-amount-input"
              />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className={`form-input ${errors.date ? 'form-input--error' : ''}`}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                id="tx-date-input"
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="type-toggle" id="type-toggle">
                <button
                  type="button"
                  className={`type-toggle__btn ${form.type === 'expense' ? 'type-toggle__btn--expense' : ''}`}
                  onClick={() => setForm({ ...form, type: 'expense' })}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`type-toggle__btn ${form.type === 'income' ? 'type-toggle__btn--income' : ''}`}
                  onClick={() => setForm({ ...form, type: 'income' })}
                >
                  Income
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                id="tx-category-select"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" id="tx-submit-btn">
              {isEditing ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
