import React from 'react';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';

export default function AiCoachRecommendation({ recommendation, onGenerateStudyPlan }) {
  const highlight = recommendation?.highlightTopic || 'Dynamic Programming';
  const text =
    recommendation?.message ||
    `You are currently weakest in Dynamic Programming. We recommend focusing on 1D DP basics before moving to more advanced 2D DP problems.`;

  return (
    <div className="card ai-recommendation-card">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="ai-coach-icon-badge">
            <Bot size={24} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6366f1', fontSize: '0.85rem' }}>
            <Sparkles size={16} />
          </div>
        </div>

        <h3 className="ai-coach-title">AI Coach Recommendation</h3>

        <p className="ai-coach-body">
          {text.includes(highlight) ? (
            <>
              {text.split(highlight)[0]}
              <strong>{highlight}</strong>
              {text.split(highlight)[1]}
            </>
          ) : (
            text
          )}
        </p>
      </div>

      <button className="ai-generate-btn" onClick={onGenerateStudyPlan}>
        <span>Generate My Study Plan</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
