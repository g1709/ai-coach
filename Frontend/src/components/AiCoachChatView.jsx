import React, { useState } from 'react';
import { ArrowLeft, Bot, Sparkles, Send, User, Code2, HelpCircle } from 'lucide-react';

export default function AiCoachChatView({ onBack, userWeakTopic }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'coach',
      text: `Hello Rahul! 👋 I'm your AI DSA Coach. I noticed your weakest topic currently is **Dynamic Programming** (20% solved). How can I help you today? Would you like an intuition breakdown of 1D DP, practice problem hints, or mock interview guidance?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Intelligent context-aware coach response
    setTimeout(() => {
      let reply = `Great question! When approaching ${
        userText.toLowerCase().includes('graph')
          ? 'Graphs'
          : userText.toLowerCase().includes('dp') || userText.toLowerCase().includes('dynamic')
          ? 'Dynamic Programming'
          : 'DSA problems'
      }, the key is to first identify the recurrence relation and overlapping subproblems.\n\n1. Define state: What variables uniquely determine the subproblem? (e.g. \`dp[i]\` = max answer up to index i)\n2. Base case: What is the smallest subproblem with a trivial answer?\n3. Transition: \`dp[i] = max(dp[i-1], dp[i-2] + val)\`\n\nWould you like to try solving "Climbing Stairs" or "House Robber" with this framework?`;

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'coach', text: reply },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const samplePrompts = [
    'Explain 0/1 Knapsack intuition step-by-step',
    'How do I detect cycles in a directed graph using DFS?',
    'Give me a hint for "Longest Increasing Subsequence"',
    'What are common DP patterns asked in Google interviews?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', gap: 16 }}>
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bot size={26} color="var(--primary)" /> AI DSA Coach Assistant
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Personalized guidance, problem intuition, step-by-step hints, and complexity analysis.
        </p>
      </div>

      {/* Chat Messages Box */}
      <div
        className="card"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: 24,
          background: '#ffffff',
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              gap: 12,
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: m.sender === 'user' ? '#0f172a' : 'var(--primary-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {m.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: m.sender === 'user' ? 'var(--primary)' : '#f8fafc',
                color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                fontSize: '0.92rem',
                lineHeight: 1.55,
                border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                whiteSpace: 'pre-line',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#64748b', fontSize: '0.82rem' }}>
            <Sparkles size={16} className="animate-spin" />
            <span>Coach is thinking...</span>
          </div>
        )}
      </div>

      {/* Sample Quick Prompts */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => setInput(p)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '0.78rem',
              color: '#475569',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <HelpCircle size={13} color="var(--primary)" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          className="custom-input"
          placeholder="Ask CodeCoach anything about DSA algorithms, problem hints, or complexity..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '12px 16px' }}
        />
        <button type="submit" className="btn-primary" disabled={!input.trim()} style={{ padding: '0 24px' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
