import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun,
  Shield, Eye, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { state, dispatch } = useApp();
  const { activeTab, role, darkMode } = state;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
  ];

  const handleNavClick = (id) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: id });
    setMobileOpen(false);
  };

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        id="mobile-menu-toggle"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <span>F</span>
          </div>
          <h1 className="sidebar__title">FinanceHub</h1>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar__nav-item ${activeTab === item.id ? 'sidebar__nav-item--active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__role-switch">
            <label className="sidebar__role-label">Role</label>
            <div className="role-toggle" id="role-toggle">
              <button
                className={`role-toggle__btn ${role === 'admin' ? 'role-toggle__btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ROLE', payload: 'admin' })}
                id="role-admin-btn"
              >
                <Shield size={14} />
                <span>Admin</span>
              </button>
              <button
                className={`role-toggle__btn ${role === 'viewer' ? 'role-toggle__btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ROLE', payload: 'viewer' })}
                id="role-viewer-btn"
              >
                <Eye size={14} />
                <span>Viewer</span>
              </button>
            </div>
          </div>

          <button
            className="sidebar__theme-btn"
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            id="theme-toggle"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
