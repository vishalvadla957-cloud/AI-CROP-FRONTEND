import React, { useState, useRef, useEffect } from 'react';
import { assistantApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Inline Markdown & Structured Formatter
function renderInlineText(text) {
  if (!text) return null;
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = [];
  let lastIndex = 0;
  let key = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} style={{ color: 'var(--text-green)', fontWeight: 700 }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={key++}
          style={{
            background: 'rgba(34, 197, 94, 0.15)',
            color: 'var(--accent-bright)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            border: '1px solid rgba(34, 197, 94, 0.25)'
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

// Structured Table Block Component
function TableBlock({ headers, rows }) {
  const [copied, setCopied] = useState(false);

  const copyTable = () => {
    const headerStr = headers.join('\t');
    const rowsStr = rows.map((r) => r.join('\t')).join('\n');
    navigator.clipboard.writeText(`${headerStr}\n${rowsStr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: '14px 0',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-green)',
        background: 'rgba(15, 22, 18, 0.85)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.05))',
          borderBottom: '1px solid var(--border-green)'
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-bright)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>📊</span>
          <span>Advisory Table</span>
        </span>
        <button
          type="button"
          onClick={copyTable}
          style={{
            background: 'transparent',
            border: 'none',
            color: copied ? 'var(--accent-bright)' : 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {copied ? '✓ Copied' : '📋 Copy Table'}
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '10px 14px',
                    color: 'var(--accent-bright)',
                    fontWeight: 700,
                    borderBottom: '1px solid var(--border-green)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {renderInlineText(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                style={{
                  background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                  borderBottom: rIdx === rows.length - 1 ? 'none' : '1px solid var(--border)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34, 197, 94, 0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)')}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      verticalAlign: 'top',
                      lineHeight: '1.5'
                    }}
                  >
                    {renderInlineText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Formatted Message Renderer (Parser for Tables, Bullet Lists, and Headers)
function FormattedMessage({ text, isBot }) {
  if (!text) return null;

  // Split into structured blocks (tables vs text paragraphs)
  const lines = text.split('\n');
  const blocks = [];
  let currentTable = null;
  let currentLines = [];

  const flushLines = () => {
    if (currentLines.length > 0) {
      blocks.push({ type: 'text', lines: currentLines });
      currentLines = [];
    }
  };

  const flushTable = () => {
    if (currentTable) {
      blocks.push({ type: 'table', headers: currentTable.headers, rows: currentTable.rows });
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check for markdown table row (| col1 | col2 |)
    if (line.startsWith('|') && line.endsWith('|') && line.length > 2) {
      const cells = line.slice(1, -1).split('|').map((c) => c.trim());
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));

      if (isSeparator) {
        // Table header separator line
        continue;
      }

      if (!currentTable) {
        // Check if next line is a separator to confirm this is a table header
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
        const isNextSeparator =
          nextLine.startsWith('|') &&
          nextLine.endsWith('|') &&
          nextLine.slice(1, -1).split('|').every((c) => /^:?-+:?$/.test(c.trim()));

        if (isNextSeparator) {
          flushLines();
          currentTable = { headers: cells, rows: [] };
          continue;
        }
      }

      if (currentTable) {
        currentTable.rows.push(cells);
        continue;
      }
    }

    // Regular line
    flushTable();
    currentLines.push(rawLine);
  }

  flushTable();
  flushLines();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'table') {
          return <TableBlock key={bIdx} headers={block.headers} rows={block.rows} />;
        }

        // Render text lines with list & header recognition
        return (
          <div key={bIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {block.lines.map((l, lIdx) => {
              const trimmed = l.trim();
              if (!trimmed) {
                return <div key={lIdx} style={{ height: '6px' }} />;
              }

              // Heading line (e.g. ## Title or ### Subtitle)
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} style={{ fontSize: '15px', color: 'var(--accent-bright)', fontWeight: 700, marginTop: '6px' }}>
                    {renderInlineText(trimmed.replace(/^###\s+/, ''))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} style={{ fontSize: '16px', color: 'var(--accent-bright)', fontWeight: 800, marginTop: '8px' }}>
                    {renderInlineText(trimmed.replace(/^##\s+/, ''))}
                  </h3>
                );
              }

              // Bullet line (•, -, *)
              const bulletMatch = trimmed.match(/^([•\-\*]|\d+\.)\s+(.+)$/);
              if (bulletMatch) {
                const bulletSymbol = bulletMatch[1];
                const content = bulletMatch[2];
                return (
                  <div
                    key={lIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '2px 0'
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--accent-bright)',
                        fontWeight: 700,
                        fontSize: '13px',
                        lineHeight: '1.6',
                        flexShrink: 0
                      }}
                    >
                      {bulletSymbol.endsWith('.') ? bulletSymbol : '🌱'}
                    </span>
                    <span style={{ lineHeight: '1.6', flex: 1 }}>{renderInlineText(content)}</span>
                  </div>
                );
              }

              // Default text line
              return (
                <div key={lIdx} style={{ lineHeight: '1.65' }}>
                  {renderInlineText(trimmed)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function AssistantPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('detailed'); // 'short' or 'detailed'
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      mode: 'detailed',
      text: `Namaste ${user?.fullName || 'Kisan Bhai'}! 🙏 I am KrishiMitra, your Groq AI-powered agricultural advisor.\n\nI can help you with:\n• Crop selection and soil nutrition (NPK, FYM)\n• Plant diseases, insect attacks & organic control\n• Irrigation scheduling & weather preparation\n• Government schemes (PM-KISAN, PMFBY, KCC)\n\nUse the toggle above to switch between **⚡ Short** and **📖 Detailed** answers anytime!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    'How to control stem borer in paddy?',
    'Best fertilizer dose for wheat in Punjab?',
    'How do I apply for PM-KISAN scheme?',
    'Organic neem spray preparation formula',
    'Ideal soil pH and water tips for cotton'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user', text: textToSend.trim(), mode };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await assistantApi.ask(textToSend.trim(), '', mode);
      const botMsg = {
        role: 'bot',
        mode: res.mode || mode,
        text: res.response || 'I could not generate an answer right now. Please try again.'
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          mode,
          text: `⚠️ Error communicating with KrishiMitra AI: ${err.message}. Please verify backend connection.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'bot',
        mode,
        text: 'Chat history cleared. How can I assist you with your farming today?'
      }
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Top Bar with Mode Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>🤖 KrishiMitra Groq AI Assistant</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Powered by Groq High-Speed LLM inference (`openai/gpt-oss-120b`)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Short / Detailed Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-green)',
              borderRadius: '30px',
              padding: '3px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <button
              type="button"
              onClick={() => setMode('short')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '24px',
                border: 'none',
                background: mode === 'short' ? 'linear-gradient(135deg, var(--accent), #10b981)' : 'transparent',
                color: mode === 'short' ? '#052e16' : 'var(--text-secondary)',
                fontWeight: mode === 'short' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <span>⚡</span>
              <span>Short Summary</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('detailed')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '24px',
                border: 'none',
                background: mode === 'detailed' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent',
                color: mode === 'detailed' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: mode === 'detailed' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <span>📖</span>
              <span>Detailed Guide</span>
            </button>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={clearChat}>
            🗑 Clear
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          marginBottom: '16px'
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role}`}>
            <div className={`chat-avatar ${msg.role}`}>
              {msg.role === 'bot' ? '🌿' : '👨‍🌾'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '100%' }}>
              {msg.role === 'bot' && msg.mode && (
                <div style={{ alignSelf: 'flex-start' }}>
                  <span
                    className={`badge ${msg.mode === 'short' ? 'badge-green' : 'badge-blue'}`}
                    style={{ fontSize: '10px', padding: '2px 8px' }}
                  >
                    {msg.mode === 'short' ? '⚡ Short Answer' : '📖 Detailed Advisory'}
                  </span>
                </div>
              )}
              <div className="chat-text">
                <FormattedMessage text={msg.text} isBot={msg.role === 'bot'} />
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble bot">
            <div className="chat-avatar bot">🌿</div>
            <div className="chat-text" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              ⚡ KrishiMitra AI is generating {mode === 'short' ? 'a concise summary' : 'a detailed breakdown with structured tables'}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="chips-row">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            className="chip"
            onClick={() => handleSend(chip)}
            disabled={loading}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 1 }}
          placeholder={`Ask about farming (${mode === 'short' ? '⚡ Short bullet mode active' : '📖 Detailed guide mode active'})...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
        >
          <span>Send</span>
          <span>🚀</span>
        </button>
      </div>
    </div>
  );
}
