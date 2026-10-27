import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, ExternalLink, Network, GitBranch, Layers, Code, Binary } from 'lucide-react';

export default function RecommendedProblemsView({ onBack }) {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDiff, setSelectedDiff] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allProblems = [
    { id: 1, title: 'Number of Islands', difficulty: 'Medium', topic: 'Graph', slug: 'number-of-islands', link: 'https://leetcode.com/problems/number-of-islands/' },
    { id: 2, title: 'Course Schedule', difficulty: 'Medium', topic: 'Graph', slug: 'course-schedule', link: 'https://leetcode.com/problems/course-schedule/' },
    { id: 3, title: 'Network Delay Time', difficulty: 'Medium', topic: 'Graph', slug: 'network-delay-time', link: 'https://leetcode.com/problems/network-delay-time/' },
    { id: 4, title: 'Binary Tree Level Order Traversal', difficulty: 'Easy', topic: 'Tree', slug: 'binary-tree-level-order-traversal', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { id: 5, title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', topic: 'Tree', slug: 'lowest-common-ancestor-of-a-binary-tree', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
    { id: 6, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Tree', slug: 'serialize-and-deserialize-binary-tree', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
    { id: 7, title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', slug: 'longest-increasing-subsequence', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    { id: 8, title: 'Coin Change', difficulty: 'Medium', topic: 'DP', slug: 'coin-change', link: 'https://leetcode.com/problems/coin-change/' },
    { id: 9, title: 'Edit Distance', difficulty: 'Hard', topic: 'DP', slug: 'edit-distance', link: 'https://leetcode.com/problems/edit-distance/' },
    { id: 10, title: 'Climbing Stairs', difficulty: 'Easy', topic: 'DP', slug: 'climbing-stairs', link: 'https://leetcode.com/problems/climbing-stairs/' },
    { id: 11, title: 'Two Sum', difficulty: 'Easy', topic: 'Array', slug: 'two-sum', link: 'https://leetcode.com/problems/two-sum/' },
    { id: 12, title: 'Container With Most Water', difficulty: 'Medium', topic: 'Array', slug: 'container-with-most-water', link: 'https://leetcode.com/problems/container-with-most-water/' },
    { id: 13, title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Array', slug: 'trapping-rain-water', link: 'https://leetcode.com/problems/trapping-rain-water/' },
    { id: 14, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'String', slug: 'longest-substring-without-repeating-characters', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { id: 15, title: 'Valid Anagram', difficulty: 'Easy', topic: 'String', slug: 'valid-anagram', link: 'https://leetcode.com/problems/valid-anagram/' },
  ];

  const topicsList = ['All', 'DP', 'Graph', 'Tree', 'Array', 'String'];
  const diffList = ['All', 'Easy', 'Medium', 'Hard'];

  const filtered = allProblems.filter((p) => {
    const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchDiff = selectedDiff === 'All' || p.difficulty === selectedDiff;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTopic && matchDiff && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
          Recommended Practice Problems
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Hand-picked problems prioritized for your weak topics to maximize interview readiness.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search problems by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="custom-input"
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {topicsList.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: selectedTopic === t ? 'var(--primary)' : '#f1f5f9',
                    color: selectedTopic === t ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 4 }}>
              {diffList.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiff(d)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: selectedDiff === d ? '#0f172a' : '#f1f5f9',
                    color: selectedDiff === d ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map((prob) => {
          const diffClass = prob.difficulty.toLowerCase();
          return (
            <div
              key={prob.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '18px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      color: '#475569',
                    }}
                  >
                    {prob.topic}
                  </span>
                  <span className={`difficulty-pill ${diffClass}`}>{prob.difficulty}</span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  {prob.title}
                </h4>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href={prob.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                >
                  <span>Solve on LeetCode</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
