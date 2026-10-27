import React from 'react';

export default function DifficultyDonut({ data }) {
  const easyCount = data?.easy?.count ?? 120;
  const mediumCount = data?.medium?.count ?? 90;
  const hardCount = data?.hard?.count ?? 40;

  const total = easyCount + mediumCount + hardCount || 250;

  const easyPercent = data?.easy?.percent ?? Math.round((easyCount / total) * 100);
  const mediumPercent = data?.medium?.percent ?? Math.round((mediumCount / total) * 100);
  const hardPercent = data?.hard?.percent ?? Math.round((hardCount / total) * 100);

  // SVG Donut calculation
  const size = 130;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const easyStroke = (easyPercent / 100) * circumference;
  const mediumStroke = (mediumPercent / 100) * circumference;
  const hardStroke = (hardPercent / 100) * circumference;

  const easyOffset = 0;
  const mediumOffset = -easyStroke;
  const hardOffset = -(easyStroke + mediumStroke);

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: 12 }}>
        <h3 className="card-title">Difficulty Distribution</h3>
      </div>

      <div className="donut-chart-container">
        {/* SVG Donut */}
        <div className="donut-svg-wrapper">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              {/* Easy Arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth={strokeWidth}
                strokeDasharray={`${easyStroke} ${circumference}`}
                strokeDashoffset={easyOffset}
                strokeLinecap="round"
                style={{ transition: 'all 0.6s ease' }}
              />
              {/* Medium Arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={strokeWidth}
                strokeDasharray={`${mediumStroke} ${circumference}`}
                strokeDashoffset={mediumOffset}
                strokeLinecap="round"
                style={{ transition: 'all 0.6s ease' }}
              />
              {/* Hard Arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#ef4444"
                strokeWidth={strokeWidth}
                strokeDasharray={`${hardStroke} ${circumference}`}
                strokeDashoffset={hardOffset}
                strokeLinecap="round"
                style={{ transition: 'all 0.6s ease' }}
              />
            </g>
          </svg>

          {/* Center text */}
          <div className="donut-center-text">
            <span className="donut-center-number">{total}</span>
            <span className="donut-center-label">Total Solved</span>
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          <div className="legend-item">
            <div className="legend-info">
              <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
              <span className="legend-label">Easy</span>
            </div>
            <span className="legend-value">{easyCount} ({easyPercent}%)</span>
          </div>

          <div className="legend-item">
            <div className="legend-info">
              <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }} />
              <span className="legend-label">Medium</span>
            </div>
            <span className="legend-value">{mediumCount} ({mediumPercent}%)</span>
          </div>

          <div className="legend-item">
            <div className="legend-info">
              <span className="legend-dot" style={{ backgroundColor: '#ef4444' }} />
              <span className="legend-label">Hard</span>
            </div>
            <span className="legend-value">{hardCount} ({hardPercent}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
