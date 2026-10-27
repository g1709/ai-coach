import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  BookOpen,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'study-plan', label: 'Study Plan', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand-logo" onClick={() => setActiveTab('dashboard')}>
        <div className="brand-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" fill="rgba(255,255,255,0.15)" />
            <path d="m8.5 10-2.5 2 2.5 2" />
            <path d="m15.5 10 2.5 2-2.5 2" />
            <path d="m13 9-2 6" />
          </svg>
        </div>
        <span className="brand-name">
          CodeCoach <span className="brand-ai">AI</span>
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Settings & Logout */}
      <div className="sidebar-footer">
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button className="nav-item" onClick={onLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
