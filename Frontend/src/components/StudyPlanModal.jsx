import React, { useState, useEffect } from 'react';
import { X, Bot, Sparkles, Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { api } from '../api/client';

export default function StudyPlanModal({ isOpen, onClose, initialWeakTopic }) {
  const [goal, setGoal] = useState('Crack FAANG DSA interviews & master weak topics');
  const [duration, setDuration] = useState(30);
  const [dailyHours, setDailyHours] = useState(2);

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  // Fetch latest existing plan on open
  useEffect(() => {
    if (isOpen) {
      loadLatestPlan();
    }
  }, [isOpen]);

  const loadLatestPlan = async () => {
    try {
      const res = await api.ai.getLatestStudyPlan();
      if (res.studyPlan?.plan) {
        setPlan(res.studyPlan.plan);
      }
    } catch (err) {
      // It's normal to have no plan yet
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.ai.createStudyPlan({
        goal,
        duration: Number(duration),
        dailyHours: Number(dailyHours),
      });
      setPlan(res.studyPlan.plan);
    } catch (err) {
      setError(
        err.message ||
          'Failed to generate study plan. Make sure LeetCode is connected or API key is set.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <div className="brand-icon-wrapper" style={{ width: 32, height: 32 }}>
              <Bot size={18} />
            </div>
            <span>AI Study Plan Generator</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="auth-error-banner" style={{ marginBottom: 16 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Generator Form */}
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          <div className="input-field-group">
            <label className="input-label">Preparation Goal</label>
            <input
              type="text"
              className="custom-input"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master Dynamic Programming or Google Interview"
              required
            />
            {/* Quick Chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {[
                'Master DP & Graphs',
                'Amazon / Google Interview',
                'Reach 1800+ Contest Rating',
              ].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setGoal(chip)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    background: '#f1f5f9',
                    color: '#475569',
                    fontWeight: 500,
                  }}
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-field-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> Duration ({duration} Days)
              </label>
              <input
                type="range"
                min="7"
                max="90"
                step="7"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {Math.ceil(duration / 7)} weeks intensive plan
              </span>
            </div>

            <div className="input-field-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> Daily Study Hours ({dailyHours}h)
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Recommended: 2 to 3 hrs/day
              </span>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                <span>AI Analyzing & Synthesizing Plan...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate New Study Plan</span>
              </>
            )}
          </button>
        </form>

        {/* Generated Plan Display */}
        {plan && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Plan Overview
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                {plan.summary}
              </p>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
              Weekly Curriculum ({plan.weeks?.length || 0} Weeks)
            </h4>

            {plan.weeks?.map((week) => (
              <div key={week.week} className="study-plan-week-card">
                <div className="study-plan-week-header">
                  <span className="week-badge">Week {week.week}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                    🎯 Goal: {week.dailyProblems} problems/day
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' }}>
                  {week.focus?.map((f, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: '#e0e7ff',
                        color: '#4338ca',
                        fontWeight: 600,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <ul className="tasks-list">
                  {week.tasks?.map((task, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>

                {week.tip && (
                  <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#b45309', background: '#fffbeb', padding: '6px 10px', borderRadius: '6px' }}>
                    💡 <strong>Pro Tip:</strong> {week.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
