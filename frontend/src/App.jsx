import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleMessages = [
    {
      label: "Suspicious Job Offer",
      text: "Congratulations! You have been selected for a remote job with a salary of ₹45,000 per month. Pay a refundable ₹1,999 registration fee today to secure your position. Reply with your bank details immediately."
    },
    {
      label: "Urgent Account Alert",
      text: "URGENT: Your bank account will be blocked in 30 minutes. Verify now through this link http://bank-update-secure.com and enter your password and OTP to avoid permanent suspension."
    },
    {
      label: "Legitimate Notice",
      text: "Your appointment is scheduled for Tuesday at 3 PM. Please bring your application reference number. If you need to reschedule, use the contact details on the official appointment confirmation you already received."
    }
  ];

  const handleAnalyze = async (textToAnalyze) => {
    const text = textToAnalyze || message;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to analyze message.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not connect to backend server. Make sure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🛡️ ScamShield Local</h1>
        <p>Understand suspicious messages before you act. Powered by local open-weight Gemma AI.</p>
        <span className="privacy-badge">🔒 Local AI · No third-party API calls</span>
      </header>

      <main className="main-content">
        <div className="input-section">
          <label htmlFor="msg-input">Paste suspicious SMS, email, or message text:</label>
          <textarea
            id="msg-input"
            rows="6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste text here..."
          />

          <div className="samples-row">
            <span className="samples-label">Try sample:</span>
            {sampleMessages.map((sample, idx) => (
              <button
                key={idx}
                className="sample-btn"
                onClick={() => {
                  setMessage(sample.text);
                  handleAnalyze(sample.text);
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>

          <div className="actions-row">
            <button
              className="analyze-btn"
              onClick={() => handleAnalyze()}
              disabled={loading || !message.trim()}
            >
              {loading ? 'Analyzing locally...' : 'Analyze Message'}
            </button>
            <button
              className="clear-btn"
              onClick={() => { setMessage(''); setResult(null); setError(null); }}
            >
              Clear
            </button>
          </div>
        </div>

        {error && <div className="error-card">⚠️ {error}</div>}

        {result && (
          <div className="result-card">
            <div className={`risk-badge ${result.risk_level?.toLowerCase().includes('high') ? 'risk-high' : result.risk_level?.toLowerCase().includes('suspicious') ? 'risk-suspicious' : 'risk-safe'}`}>
              Risk Level: {result.risk_level}
            </div>

            <div className="section-block">
              <h3>Summary</h3>
              <p>{result.summary}</p>
            </div>

            {result.evidence && result.evidence.length > 0 && (
              <div className="section-block">
                <h3>Evidence & Warning Signs</h3>
                <div className="evidence-list">
                  {result.evidence.map((item, idx) => (
                    <div key={idx} className="evidence-item">
                      <blockquote>"{item.quote}"</blockquote>
                      <p><strong>Why it matters:</strong> {item.why_it_matters}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.safe_steps && result.safe_steps.length > 0 && (
              <div className="section-block">
                <h3>Safe Verification Steps</h3>
                <ul>
                  {result.safe_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.uncertainty && result.uncertainty.length > 0 && (
              <div className="section-block uncertainty-block">
                <h3>What Cannot Be Verified From Text Alone</h3>
                <ul>
                  {result.uncertainty.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="disclaimer-footer">
              <p>ℹ️ {result.disclaimer}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;