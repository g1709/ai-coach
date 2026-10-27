import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import AuthBannerIllustration from './AuthBannerIllustration';
import { api } from '../api/client';

export default function AuthModalOrView({ onAuthSuccess, onDemoLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.auth.login(email, password);
        onAuthSuccess(res.user);
      } else {
        const res = await api.auth.register(name, email, password);
        onAuthSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Info Panel */}
        <div className="auth-left-banner">
          <div className="auth-brand-logo">
            <div className="auth-logo-row">
              <div className="brand-icon-wrapper" style={{ width: 36, height: 36 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" fill="rgba(255,255,255,0.15)" />
                  <path d="m8.5 10-2.5 2 2.5 2" />
                  <path d="m15.5 10 2.5 2-2.5 2" />
                  <path d="m13 9-2 6" />
                </svg>
              </div>
              <span className="brand-name" style={{ color: '#0f172a' }}>
                CodeCoach <span style={{ color: 'var(--primary)' }}>AI</span>
              </span>
            </div>
            <div className="auth-logo-tagline">Learn • Improve • Crack</div>
          </div>

          <div className="auth-illustration-wrapper">
            <AuthBannerIllustration />
          </div>

          <div className="auth-left-footer">
            <h3>Your Personal DSA Coach</h3>
            <p>
              Track your progress, find your weak topics, and get AI-powered study plans to ace your coding interviews.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-form">
          <div className="auth-form-header">
            {isLogin ? (
              <>
                <h2>Welcome Back 👋</h2>
                <p>Login to your account to continue</p>
              </>
            ) : (
              <>
                <h2>Create Account 👋</h2>
                <p>Join CodeCoach AI and start your journey</p>
              </>
            )}
          </div>

          {error && (
            <div className="auth-error-banner" style={{ marginBottom: 16 }}>
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-field-group">
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon-left" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="input-field-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon-left" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-field-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="input-field-group">
                <label className="input-label">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon-left" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="auth-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#forgot" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Please contact administrator or reset via backend.'); }}>
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          {/* Quick Demo Mode shortcut */}
          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              onClick={onDemoLogin}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                border: '1px dashed #6366f1',
                background: '#f5f7ff',
                color: '#4f46e5',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={16} /> Explore Live UI Demo (Gaurav - gaurav_1709)
            </button>
          </div>

          <div className="auth-footer-toggle">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => { setIsLogin(false); setError(null); }}>
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => { setIsLogin(true); setError(null); }}>
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
