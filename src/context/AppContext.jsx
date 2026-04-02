import { createContext, useContext, useReducer, useEffect } from 'react';
import { generateTransactions, CATEGORIES } from '../data/mockData';

const AppContext = createContext();

const STORAGE_KEY = 'financeHub_state';

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
};

const saveToStorage = (state) => {
  try {
    const toSave = {
      transactions: state.transactions,
      darkMode: state.darkMode,
      role: state.role,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

const initialState = () => {
  const stored = loadFromStorage();
  return {
    transactions: stored?.transactions || generateTransactions(),
    categories: CATEGORIES,
    role: stored?.role || 'admin', // 'admin' or 'viewer'
    darkMode: stored?.darkMode ?? true,
    activeTab: 'dashboard',
    filters: {
      search: '',
      type: 'all',
      category: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    },
    editingTransaction: null,
    showAddModal: false,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.payload.key]: action.payload.value } };
    case 'RESET_FILTERS':
      return { ...state, filters: { search: '', type: 'all', category: 'all', sortBy: 'date', sortOrder: 'desc' } };
    case 'ADD_TRANSACTION': {
      const newTx = { ...action.payload, id: Date.now() };
      return { ...state, transactions: [newTx, ...state.transactions], showAddModal: false };
    }
    case 'UPDATE_TRANSACTION': {
      const updated = state.transactions.map(t =>
        t.id === action.payload.id ? action.payload : t
      );
      return { ...state, transactions: updated, editingTransaction: null };
    }
    case 'DELETE_TRANSACTION': {
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    }
    case 'SET_EDITING_TRANSACTION':
      return { ...state, editingTransaction: action.payload };
    case 'TOGGLE_ADD_MODAL':
      return { ...state, showAddModal: !state.showAddModal, editingTransaction: null };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, null, initialState);

  useEffect(() => {
    saveToStorage(state);
  }, [state.transactions, state.darkMode, state.role]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
