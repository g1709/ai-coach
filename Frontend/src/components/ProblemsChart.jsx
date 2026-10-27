import React, { useState } from 'react';

export default function ProblemsChart({ data, daysFilter, onFilterChange }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Default 7-day data if none provided
  const pointsData = data && data.length > 0 ? data : [
    { day: 'Mon', solved: 10 },
    { day: 'Tue', solved: 20 },
    { day: 'Wed', solved: 18 },
    { day: 'Thu', solved: 26 },
    { day: 'Fri', solved: 20 },
    { day: 'Sat', solved: 32 },
    { day: 'Sun', solved: 26 },
  ];

  const maxVal = 40;
  const svgWidth = 520;
  const svgHeight = 160;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates
  const coords = pointsData.map((d, i) => {
    const x = paddingLeft + (i / (pointsData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.solved / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  // Build smooth bezier curve path
  const makeSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = makeSmoothPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1]?.x || 0} ${paddingTop + chartHeight} L ${coords[0]?.x || 0} ${paddingTop + chartHeight} Z`;

  const yTicks = [40, 30, 20, 10, 0];

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div className="card-header">
        <h3 className="card-title">Problems Solved</h3>
        <select
          className="chart-filter-select"
          value={daysFilter}
          onChange={(e) => onFilterChange(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      <div className="chart-container" style={{ width: '100%', height: '180px' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-ticks */}
          {yTicks.map((val) => {
            const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? 'none' : '3 3'}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3}
                  fontSize="10"
                  fill="#94a3b8"
                  textAnchor="end"
                  fontWeight="500"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Spline Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {coords.map((pt, idx) => (
            <g
              key={idx}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="#ffffff"
                stroke="#6366f1"
                strokeWidth="2.5"
                style={{ transition: 'all 0.15s ease' }}
              />
              {/* X-axis labels */}
              <text
                x={pt.x}
                y={svgHeight - 4}
                fontSize="11"
                fill="#94a3b8"
                textAnchor="middle"
                fontWeight="500"
              >
                {pt.day || pt.date?.slice(5) || `D${idx + 1}`}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              background: '#0f172a',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              pointerEvents: 'none',
              animation: 'fadeIn 0.15s ease',
            }}
          >
            {hoveredPoint.day || hoveredPoint.date}: <strong>{hoveredPoint.solved} solved</strong>
          </div>
        )}
      </div>
    </div>
  );
}
