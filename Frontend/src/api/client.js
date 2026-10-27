// API Client for CodeCoach AI Backend

const API_BASE = '/api';

// Helper for fetch with credentials & JSON headers
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('codecoach_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function cleanLeetCodeUsername(input) {
  if (!input) return '';
  let str = String(input).trim();
  try {
    if (str.startsWith('http://') || str.startsWith('https://')) {
      const url = new URL(str);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts[0] === 'u' && parts[1]) {
        return parts[1];
      }
      if (parts[0]) {
        return parts[0];
      }
    }
  } catch (e) {}
  return str.replace(/\/+$/, '').replace(/^@/, '').trim();
}

export const api = {
  // Authentication
  auth: {
    async register(name, email, password) {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      if (data.token) localStorage.setItem('codecoach_token', data.token);
      return data;
    },
    async login(email, password) {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token) localStorage.setItem('codecoach_token', data.token);
      return data;
    },
    async getMe() {
      return request('/auth/me');
    },
    async logout() {
      try {
        await request('/auth/logout', { method: 'POST' });
      } finally {
        localStorage.removeItem('codecoach_token');
      }
    },
  },

  // LeetCode integration
  leetcode: {
    async connect(username) {
      const clean = cleanLeetCodeUsername(username);
      return request('/leetcode/connect', {
        method: 'POST',
        body: JSON.stringify({ username: clean }),
      });
    },
    async fetchUser(username) {
      const clean = cleanLeetCodeUsername(username);
      return request(`/leetcode/user/${encodeURIComponent(clean)}`);
    },
    async sync(username) {
      return request('/leetcode/sync', {
        method: 'POST',
        body: JSON.stringify(username ? { username: cleanLeetCodeUsername(username) } : {}),
      });
    },
    async getStats() {
      return request('/leetcode/stats');
    },
  },

  // Analytics endpoints
  analytics: {
    async getOverview() {
      return request('/analytics/overview');
    },
    async getTopics() {
      return request('/analytics/topics');
    },
    async getDifficulty() {
      return request('/analytics/difficulty');
    },
    async getProgress(days = 7) {
      return request(`/analytics/progress?days=${days}`);
    },
    async getWeaknesses() {
      return request('/analytics/weaknesses');
    },
  },

  // AI endpoints
  ai: {
    async createStudyPlan(payload) {
      return request('/ai/study-plan', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    async getLatestStudyPlan() {
      return request('/ai/study-plan');
    },
  },

  // User Profile
  user: {
    async getProfile() {
      return request('/user/profile');
    },
    async updateProfile(updates) {
      return request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
  },
};

// Demo/fallback data initialized with Gaurav's real LeetCode profile
export const DEMO_DATA = {
  user: {
    name: 'Gaurav',
    email: 'gaurav@example.com',
    leetcodeUsername: 'gaurav_1709',
    avatarUrl: 'https://assets.leetcode.com/users/gaurav_1709/avatar_1782195607.png',
  },
  stats: {
    totalSolved: 411,
    easy: 204,
    medium: 192,
    hard: 15,
    contestRating: 1351,
    acceptanceRate: 66.2,
    streak: 12,
    thisWeekSolved: 18,
    ratingGain: 32,
    streakGain: 3,
    acceptanceGain: 4,
  },
  progress: [
    { day: 'Mon', solved: 10 },
    { day: 'Tue', solved: 20 },
    { day: 'Wed', solved: 18 },
    { day: 'Thu', solved: 26 },
    { day: 'Fri', solved: 20 },
    { day: 'Sat', solved: 32 },
    { day: 'Sun', solved: 26 },
  ],
  difficulty: {
    total: 411,
    easy: { count: 204, percent: 50 },
    medium: { count: 192, percent: 47 },
    hard: { count: 15, percent: 3 },
  },
  weakTopics: [
    { name: 'Dynamic Programming', percent: 20, status: 'Needs Practice', color: '#ef4444' },
    { name: 'Graphs', percent: 25, status: 'Needs Practice', color: '#f97316' },
    { name: 'Trees', percent: 35, status: 'Developing', color: '#f59e0b' },
    { name: 'Arrays', percent: 80, status: 'Strong', color: '#10b981' },
    { name: 'Strings', percent: 75, status: 'Strong', color: '#10b981' },
  ],
  aiRecommendation: {
    highlightTopic: 'Dynamic Programming',
    message:
      'You are currently weakest in Dynamic Programming. We recommend focusing on 1D DP basics before moving to more advanced 2D DP problems.',
  },
  recommendedProblems: [
    {
      id: 1,
      title: 'Number of Islands',
      difficulty: 'Medium',
      topic: 'Graph',
      link: 'https://leetcode.com/problems/number-of-islands/',
    },
    {
      id: 2,
      title: 'Course Schedule',
      difficulty: 'Medium',
      topic: 'Graph',
      link: 'https://leetcode.com/problems/course-schedule/',
    },
    {
      id: 3,
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Easy',
      topic: 'Tree',
      link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    },
    {
      id: 4,
      title: 'Longest Increasing Subsequence',
      difficulty: 'Medium',
      topic: 'DP',
      link: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    },
  ],
};
