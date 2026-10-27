import React from 'react';
import { Check, Trophy, Flame, Gauge, ArrowUp } from 'lucide-react';

export default function StatCards({ stats }) {
  const cards = [
    {
      id: 'solved',
      title: 'Total Solved',
      value: stats?.totalSolved ?? 250,
      trend: stats?.thisWeekSolved ? `↑ ${stats.thisWeekSolved} this week` : '↑ 15 this week',
      icon: Check,
      iconType: 'solved',
    },
    {
      id: 'rating',
      title: 'Contest Rating',
      value: stats?.contestRating ?? 1450,
      trend: stats?.ratingGain ? `↑ ${stats.ratingGain} this week` : '↑ 32 this week',
      icon: Trophy,
      iconType: 'rating',
    },
    {
      id: 'streak',
      title: 'Current Streak',
      value: stats?.streak ?? 12,
      trend: stats?.streakGain ? `↑ ${stats.streakGain} days` : '↑ 3 days',
      icon: Flame,
      iconType: 'streak',
    },
    {
      id: 'acceptance',
      title: 'Acceptance Rate',
      value: `${stats?.acceptanceRate ?? 72}%`,
      trend: stats?.acceptanceGain ? `↑ ${stats.acceptanceGain}% this week` : '↑ 4% this week',
      icon: Gauge,
      iconType: 'acceptance',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="stat-card">
            <div className={`stat-icon-wrapper ${card.iconType}`}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{card.title}</span>
              <span className="stat-value">{card.value}</span>
              <span className="stat-trend">{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
