import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Link2, RefreshCw, CheckCircle, Save } from 'lucide-react';
import { api } from '../api/client';

export default function ProfileView({ user, onUpdateUser, onSyncLeetCode, isSyncing, onBack }) {
  const [name, setName] = useState(user?.name || 'Rahul Kumar');
  const [leetcodeUsername, setLeetcodeUsername] = useState(user?.leetcodeUsername || 'rahulkumar');
  const [statusMessage, setStatusMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await api.user.updateProfile({ name, leetcodeUsername });
      onUpdateUser(res.user);
      setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: '720px' }}>
      <div>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--primary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: 8,
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Profile & Account Settings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage your personal details and connected coding platforms.
        </p>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: statusMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: statusMessage.type === 'success' ? '#047857' : '#dc2626',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircle size={16} />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="card" style={{ gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{name}</h3>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{user?.email || 'rahul.kumar@example.com'}</span>
          </div>
        </div>

        <div className="input-field-group">
          <label className="input-label">Full Name</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon-left" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="custom-input"
              style={{ paddingLeft: 42 }}
              required
            />
          </div>
        </div>

        <div className="input-field-group">
          <label className="input-label">Email Address (Read-only)</label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon-left" />
            <input
              type="email"
              value={user?.email || 'rahul.kumar@example.com'}
              disabled
              className="custom-input"
              style={{ paddingLeft: 42, background: '#f8fafc', color: '#64748b' }}
            />
          </div>
        </div>

        <div className="input-field-group">
          <label className="input-label">LeetCode Username</label>
          <div className="input-wrapper">
            <Link2 size={18} className="input-icon-left" />
            <input
              type="text"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              placeholder="e.g. rahulkumar"
              className="custom-input"
              style={{ paddingLeft: 42 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <button
            type="button"
            onClick={onSyncLeetCode}
            disabled={isSyncing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing with LeetCode...' : 'Sync LeetCode Data Now'}</span>
          </button>

          <button type="submit" className="btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
