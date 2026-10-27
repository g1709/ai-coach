import React, { useState } from 'react';
import { ChevronDown, User, LogOut, RefreshCw } from 'lucide-react';

export default function Header({ user, onLogout, onSyncLeetCode, isSyncing, onNavigateProfile }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.name || 'Ayush Kumar Jha';
  const firstName = displayName.split(' ')[0];

  return (
    <header className="top-header">
      <div className="header-greeting">
        <h1>
          {getGreeting()}, {firstName}! <span role="img" aria-label="wave">👋</span>
        </h1>
        <p>Here's your coding progress and personalized recommendations.</p>
      </div>

      <div className="header-actions">
        {/* User Profile Pill Menu */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile-menu"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="user-avatar"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="user-avatar-placeholder">
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="user-name">{displayName}</span>
            <ChevronDown size={16} color="var(--text-muted)" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                width: '220px',
                background: '#ffffff',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '8px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div style={{ padding: '8px 12px 10px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{displayName}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email || 'user@example.com'}</div>
              </div>

              <button
                className="dropdown-menu-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigateProfile();
                }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>

              <button
                className="dropdown-menu-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  onSyncLeetCode();
                }}
                disabled={isSyncing}
              >
                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Syncing...' : 'Sync LeetCode'}</span>
              </button>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

              <button
                className="dropdown-menu-item logout"
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
