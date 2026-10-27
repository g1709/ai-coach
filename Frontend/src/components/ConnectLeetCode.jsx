import React, { useState, useEffect } from 'react';
import { Link2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function ConnectLeetCode({ currentUsername, onConnect, isSyncing }) {
  const [username, setUsername] = useState(currentUsername || 'gaurav_1709');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (currentUsername) {
      setUsername(currentUsername);
    }
  }, [currentUsername]);

  const handleSync = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setFeedback(null);
    try {
      const res = await onConnect(username.trim());
      const count = res?.stats?.totalSolved || res?.stats?.total || '';
      setFeedback({
        type: 'success',
        message: `Synced ${res?.username || username}! ${count ? `(${count} problems solved)` : ''}`,
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Could not sync username. Please check the LeetCode ID.',
      });
    }
  };

  return (
    <div className="card connect-leetcode-card">
      <div>
        <div className="leetcode-header">
          <div className="leetcode-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.649 1.837-.649s1.357.195 1.823.662l2.697 2.606"
                stroke="#d97706"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 7.5L16.5 1.5"
                stroke="#1e293b"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M8.5 12.5H19"
                stroke="#f59e0b"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h3 className="leetcode-title">Connect LeetCode</h3>
        </div>

        <p className="leetcode-desc">
          Sync your LeetCode account to get personalized insights and recommendations.
        </p>
      </div>

      <form onSubmit={handleSync} className="leetcode-input-group">
        <input
          type="text"
          className="custom-input"
          placeholder="Enter LeetCode username or profile URL"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSyncing}
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={isSyncing || !username.trim()}
          style={{ width: '100%' }}
        >
          {isSyncing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Fetching LeetCode Data...</span>
            </>
          ) : (
            <>
              <Link2 size={16} />
              <span>Sync Now</span>
            </>
          )}
        </button>

        {feedback && (
          <div
            style={{
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: feedback.type === 'success' ? '#059669' : '#dc2626',
              marginTop: 4,
            }}
          >
            {feedback.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            <span>{feedback.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
