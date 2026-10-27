import React from 'react';
import { ArrowRight, ChevronRight, Network, GitBranch, Binary, Layers } from 'lucide-react';

export default function RecommendedProblems({ problems, onViewAll }) {
  const defaultProblems = [
    {
      id: 1,
      title: 'Number of Islands',
      difficulty: 'Medium',
      topic: 'Graph',
      iconClass: 'green',
      icon: Network,
      link: 'https://leetcode.com/problems/number-of-islands/',
    },
    {
      id: 2,
      title: 'Course Schedule',
      difficulty: 'Medium',
      topic: 'Graph',
      iconClass: 'blue',
      icon: Network,
      link: 'https://leetcode.com/problems/course-schedule/',
    },
    {
      id: 3,
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Easy',
      topic: 'Tree',
      iconClass: 'green',
      icon: GitBranch,
      link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    },
    {
      id: 4,
      title: 'Longest Increasing Subsequence',
      difficulty: 'Medium',
      topic: 'DP',
      iconClass: 'blue',
      icon: Layers,
      link: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    },
  ];

  const items = problems && problems.length > 0 ? problems : defaultProblems;

  const handleProblemClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recommended Problems</h3>
        <button onClick={onViewAll} className="card-link">
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="problems-list">
        {items.slice(0, 4).map((p, idx) => {
          const Icon = p.icon || Network;
          const diffClass = (p.difficulty || 'Medium').toLowerCase();
          const iconType = p.iconClass || (p.topic === 'Tree' ? 'tree' : p.topic === 'DP' ? 'dp' : 'graph');

          return (
            <div
              key={p.id || idx}
              className="problem-item"
              onClick={() => handleProblemClick(p.link)}
              title="Click to solve on LeetCode"
            >
              <div className="problem-left">
                <div className={`problem-icon-circle ${iconType}`}>
                  <Icon size={16} />
                </div>
                <div className="problem-details">
                  <span className="problem-title">{p.title}</span>
                  <div className="problem-meta">
                    <span className={`difficulty-pill ${diffClass}`}>{p.difficulty}</span>
                    <span>•</span>
                    <span>{p.topic}</span>
                  </div>
                </div>
              </div>

              <ChevronRight size={16} className="problem-chevron" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
