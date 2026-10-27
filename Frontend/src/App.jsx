import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCards from './components/StatCards';
import ProblemsChart from './components/ProblemsChart';
import DifficultyDonut from './components/DifficultyDonut';
import ConnectLeetCode from './components/ConnectLeetCode';
import AuthModalOrView from './components/AuthModalOrView';
import StudyPlanModal from './components/StudyPlanModal';
import AnalyticsView from './components/AnalyticsView';
import ProfileView from './components/ProfileView';

import { api, DEMO_DATA } from './api/client';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isStudyPlanOpen, setIsStudyPlanOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [daysFilter, setDaysFilter] = useState(7);

  // Dashboard Data State (initialized with DEMO_DATA matching the screenshot!)
  const [stats, setStats] = useState(DEMO_DATA.stats);
  const [difficulty, setDifficulty] = useState(DEMO_DATA.difficulty);
  const [progressData, setProgressData] = useState(DEMO_DATA.progress);
  const [weakTopics, setWeakTopics] = useState(DEMO_DATA.weakTopics);
  const [aiRecommendation, setAiRecommendation] = useState(DEMO_DATA.aiRecommendation);
  const [recommendedProblems, setRecommendedProblems] = useState(DEMO_DATA.recommendedProblems);
  const [allTopics, setAllTopics] = useState(null);

  // Check initial login session
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const res = await api.auth.getMe();
      if (res?.user) {
        setUser(res.user);
        if (res.user.leetcodeUsername) {
          handleConnectLeetCode(res.user.leetcodeUsername);
        } else {
          fetchDashboardData(res.user);
        }
        return;
      }
    } catch (err) {
      // Not logged in or offline; auto-connect Gaurav's live profile
    }
    handleConnectLeetCode('gaurav_1709').catch(() => {
      setUser(DEMO_DATA.user);
    });
  };

  // Fetch live stats from backend
  const fetchDashboardData = async (currentUser) => {
    try {
      const [overviewRes, diffRes, progRes, topicsRes] = await Promise.allSettled([
        api.analytics.getOverview(),
        api.analytics.getDifficulty(),
        api.analytics.getProgress(daysFilter),
        api.analytics.getTopics(),
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value) {
        const o = overviewRes.value;
        setStats((prev) => ({
          ...prev,
          totalSolved: o.totalSolved ?? prev.totalSolved,
          easy: o.easy ?? prev.easy,
          medium: o.medium ?? prev.medium,
          hard: o.hard ?? prev.hard,
          contestRating: o.contestRating ?? prev.contestRating,
          acceptanceRate: o.acceptanceRate ?? prev.acceptanceRate,
          streak: o.streak ?? prev.streak,
        }));
      }

      if (diffRes.status === 'fulfilled' && diffRes.value) {
        setDifficulty(diffRes.value);
      }

      if (progRes.status === 'fulfilled' && progRes.value?.progress) {
        const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formatted = progRes.value.progress.map((p) => {
          const d = new Date(p.date);
          return {
            day: daysMap[d.getUTCDay()],
            date: p.date,
            solved: p.problemsSolved,
          };
        });
        if (formatted.length > 0) setProgressData(formatted);
      }

      if (topicsRes.status === 'fulfilled' && topicsRes.value?.topics) {
        setAllTopics(topicsRes.value.topics);
      }
    } catch (err) {
      console.log('Using live synced dashboard data:', err);
    }
  };

  // Sync LeetCode action for ANY username or URL
  const handleConnectLeetCode = async (username) => {
    setIsSyncing(true);
    try {
      const res = await api.leetcode.connect(username);
      if (res?.stats) {
        setStats((prev) => ({
          ...prev,
          totalSolved: res.stats.totalSolved ?? prev.totalSolved,
          easy: res.stats.easy ?? prev.easy,
          medium: res.stats.medium ?? prev.medium,
          hard: res.stats.hard ?? prev.hard,
          contestRating: res.stats.contestRating ?? prev.contestRating,
          acceptanceRate: res.stats.acceptanceRate ?? prev.acceptanceRate,
          streak: res.stats.streak ?? prev.streak,
          thisWeekSolved: res.stats.thisWeekSolved ?? prev.thisWeekSolved,
        }));
      }
      if (res?.difficulty) {
        setDifficulty(res.difficulty);
      }
      if (res?.progress && res.progress.length > 0) {
        setProgressData(res.progress);
      }
      setUser((prevUser) => ({
        ...(prevUser || DEMO_DATA.user),
        name: res?.realName || prevUser?.name || 'Gaurav',
        leetcodeUsername: res?.username || username,
        avatarUrl: res?.avatarUrl || prevUser?.avatarUrl,
      }));

      return res;
    } catch (err) {
      console.error('Failed to sync LeetCode profile:', err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      // ignore
    }
    setUser(null);
  };

  const handleDemoLogin = () => {
    setUser(DEMO_DATA.user);
    setStats(DEMO_DATA.stats);
    setDifficulty(DEMO_DATA.difficulty);
    setProgressData(DEMO_DATA.progress);
    handleConnectLeetCode('gaurav_1709').catch(() => {});
  };

  // If user is not logged in, show Auth views
  if (!user) {
    return (
      <AuthModalOrView
        onAuthSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          if (loggedInUser.leetcodeUsername) {
            handleConnectLeetCode(loggedInUser.leetcodeUsername);
          } else {
            fetchDashboardData(loggedInUser);
          }
        }}
        onDemoLogin={handleDemoLogin}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'study-plan') {
            setIsStudyPlanOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onLogout={handleLogout}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <Header
          user={user}
          onLogout={handleLogout}
          onSyncLeetCode={() => handleConnectLeetCode(user?.leetcodeUsername || 'gaurav_1709')}
          isSyncing={isSyncing}
          onNavigateProfile={() => setActiveTab('profile')}
        />

        <main className="dashboard-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Row 1: Stat Cards */}
              <StatCards stats={stats} />

              {/* Row 2: Middle Grid */}
              <div className="middle-grid">
                <ProblemsChart
                  data={progressData}
                  daysFilter={daysFilter}
                  onFilterChange={(d) => {
                    setDaysFilter(d);
                    api.analytics
                      .getProgress(d)
                      .then((res) => {
                        if (res?.progress) {
                          const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                          setProgressData(
                            res.progress.map((p) => {
                              const dt = new Date(p.date);
                              return {
                                day: daysMap[dt.getUTCDay()],
                                date: p.date,
                                solved: p.problemsSolved,
                              };
                            })
                          );
                        }
                      })
                      .catch(() => {});
                  }}
                />

                <DifficultyDonut data={difficulty} />

                <ConnectLeetCode
                  currentUsername={user.leetcodeUsername}
                  onConnect={handleConnectLeetCode}
                  isSyncing={isSyncing}
                />
              </div>

            </>
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              stats={stats}
              difficulty={difficulty}
              topics={allTopics}
              progress={progressData}
              onBack={() => setActiveTab('dashboard')}
            />
          )}

          {/* Profile & Settings View */}
          {(activeTab === 'profile' || activeTab === 'settings') && (
            <ProfileView
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onSyncLeetCode={() => handleConnectLeetCode(user.leetcodeUsername || 'rahulkumar')}
              isSyncing={isSyncing}
              onBack={() => setActiveTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* AI Study Plan Modal */}
      <StudyPlanModal
        isOpen={isStudyPlanOpen}
        onClose={() => setIsStudyPlanOpen(false)}
        initialWeakTopic={aiRecommendation?.highlightTopic}
      />
    </div>
  );
}
