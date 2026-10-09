import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from './Toast';

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { section: 'Main' },
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/recommendation', label: 'Crop Recommendation', icon: '🧪' },
    { to: '/assistant', label: 'AI Assistant', icon: '💬' },
    { section: 'Knowledge' },
    { to: '/diseases', label: 'Disease Library', icon: '🦠' },
    { to: '/crops', label: 'Crop Database', icon: '🌱' },
    { section: 'Records' },
    { to: '/history', label: 'Farming History', icon: '📋' },
    { to: '/profile', label: 'My Profile', icon: '👤' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">🌾</div>
          <div>
            <div className="logo-text">Krishi<span>Mitra</span></div>
            <div className="logo-sub">कृषि मित्र • AI Advisory</div>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">
            {(user?.fullName || user?.username || 'F').charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div className="user-name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.fullName || user?.username || 'Farmer'}
            </div>
            <div className="user-role">{user?.role || 'FARMER'}</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((item, idx) => {
          if (item.section) {
            return (
              <div key={idx} className="nav-section-title">
                {item.section}
              </div>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ display: 'none', '@media (max-width: 900px)': { display: 'flex' } }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div>
              <div className="topbar-title">KrishiMitra Agricultural Advisory</div>
              <div className="topbar-subtitle">Precision AI Farming Platform</div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="badge badge-green">🟢 System Live</span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
