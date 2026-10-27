import React from 'react';
import { ArrowRight, Code, GitFork, Network, Layers, Binary, Cpu } from 'lucide-react';

export default function WeakTopics({ topics, onViewAll }) {
  const defaultTopics = [
    { name: 'Dynamic Programming', percent: 20, status: 'Needs Practice', color: '#ef4444', icon: Cpu },
    { name: 'Graphs', percent: 25, status: 'Needs Practice', color: '#f97316', icon: Network },
    { name: 'Trees', percent: 35, status: 'Developing', color: '#f59e0b', icon: GitFork },
    { name: 'Arrays', percent: 80, status: 'Strong', color: '#10b981', icon: Layers },
    { name: 'Strings', percent: 75, status: 'Strong', color: '#10b981', icon: Code },
  ];

  const displayTopics = topics && topics.length > 0 ? topics : defaultTopics;

  const getStatusClass = (status) => {
    if (status === 'Needs Practice') return 'needs-practice';
    if (status === 'Developing') return 'developing';
    return 'strong';
  };

  const getBarColor = (status, customColor) => {
    if (customColor) return customColor;
    if (status === 'Needs Practice') return '#ef4444';
    if (status === 'Developing') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Your Weak Topics</h3>
        <button onClick={onViewAll} className="card-link">
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="topics-list">
        {displayTopics.slice(0, 5).map((topic, idx) => {
          const statusClass = getStatusClass(topic.status || topic.category);
          const barColor = getBarColor(topic.status || topic.category, topic.color);
          const percent = topic.percent ?? topic.successRate ?? 0;
          const Icon = topic.icon || Code;

          return (
            <div key={idx} className="topic-row">
              <div
                className="topic-bullet"
                style={{
                  backgroundColor: `${barColor}18`,
                  color: barColor,
                }}
              >
                <Icon size={13} />
              </div>

              <span className="topic-name" title={topic.name || topic.topic}>
                {topic.name || topic.topic}
              </span>

              <div className="topic-progress-wrapper">
                <div
                  className="topic-progress-bar"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>

              <span className="topic-percent">{percent}%</span>

              <span
                className={`topic-badge ${statusClass}`}
                style={
                  barColor === '#f97316'
                    ? { backgroundColor: '#fff7ed', color: '#c2410c' }
                    : barColor === '#ef4444'
                    ? { backgroundColor: '#fef2f2', color: '#b91c1c' }
                    : barColor === '#f59e0b'
                    ? { backgroundColor: '#fffbeb', color: '#b45309' }
                    : { backgroundColor: '#ecfdf5', color: '#047857' }
                }
              >
                {topic.status || topic.category || 'Needs Practice'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
