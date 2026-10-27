import React from 'react';
import { ArrowLeft, TrendingUp, CheckCircle, BarChart2, Award } from 'lucide-react';
import DifficultyDonut from './DifficultyDonut';
import ProblemsChart from './ProblemsChart';

export default function AnalyticsView({ stats, difficulty, topics, progress, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            Performance & Skill Analytics
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            In-depth breakdown of your problem-solving metrics across all DSA topics.
          </p>
        </div>
      </div>

      {/* Row 1: Donut & Solved History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 20 }}>
        <DifficultyDonut data={difficulty} />
        <ProblemsChart data={progress} daysFilter={30} onFilterChange={() => {}} />
      </div>

      {/* Row 2: Comprehensive Topic Breakdown Table */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>
          Comprehensive Topic Mastery Breakdown
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 14px' }}>Topic</th>
                <th style={{ padding: '12px 14px' }}>Problems Solved</th>
                <th style={{ padding: '12px 14px' }}>Mastery Rate</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(topics || [
                { topic: 'Dynamic Programming', solved: 6, successRate: 20, category: 'Needs Practice' },
                { topic: 'Graph', solved: 7, successRate: 25, category: 'Needs Practice' },
                { topic: 'Tree', solved: 10, successRate: 35, category: 'Developing' },
                { topic: 'Binary Search', solved: 12, successRate: 40, category: 'Developing' },
                { topic: 'Linked List', solved: 15, successRate: 50, category: 'Developing' },
                { topic: 'Two Pointers', solved: 18, successRate: 60, category: 'Developing' },
                { topic: 'String', solved: 22, successRate: 75, category: 'Strong' },
                { topic: 'Array', solved: 24, successRate: 80, category: 'Strong' },
              ]).map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{t.topic || t.name}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{t.solved || 0}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 100, height: 6, background: '#f1f5f9', borderRadius: 999 }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${t.successRate || 0}%`,
                            background:
                              t.category === 'Needs Practice'
                                ? '#ef4444'
                                : t.category === 'Developing'
                                ? '#f59e0b'
                                : '#10b981',
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                        {t.successRate || 0}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      className={`topic-badge ${
                        t.category === 'Needs Practice'
                          ? 'needs-practice'
                          : t.category === 'Developing'
                          ? 'developing'
                          : 'strong'
                      }`}
                    >
                      {t.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
