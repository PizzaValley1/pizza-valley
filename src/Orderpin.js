cat > /mnt/user-data/outputs/OrderPin.js << 'EOF'
import React, { useState, useEffect } from 'react';
import './OrderPin.css';

export default function OrderPin({ orderId, onClose }) {
  const [pin]         = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [revealed,    setRevealed]    = useState(false);
  const [riderInput,  setRiderInput]  = useState('');
  const [verified,    setVerified]    = useState(false);
  const [error,       setError]       = useState('');
  const [timeLeft,    setTimeLeft]    = useState(1800); // 30 min

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const verifyPin = () => {
    if (riderInput === pin) {
      setVerified(true);
      setError('');
    } else {
      setError('Wrong PIN — please check and try again');
    }
  };

  if (verified) {
    return (
      <div className="pin-overlay" onClick={onClose}>
        <div className="pin-modal" onClick={e => e.stopPropagation()}>
          <div className="pin-success">
            <div className="pin-success-icon">🎉</div>
            <h2>Order Delivered!</h2>
            <p>PIN verified successfully. Order #{orderId} is now complete.</p>
            <div className="pin-rating">
              <p>Rate your experience:</p>
              <div className="pin-stars">
                {[1,2,3,4,5].map(s => (
                  <button key={s} className="pin-star">⭐</button>
                ))}
              </div>
            </div>
            <button className="pin-btn" onClick={onClose}>Done ✓</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pin-overlay" onClick={onClose}>
      <div className="pin-modal" onClick={e => e.stopPropagation()}>

        <div className="pin-header">
          <h2>🔐 Order Confirmation PIN</h2>
          <button className="pin-close" onClick={onClose}>✕</button>
        </div>

        <div className="pin-body">
          <p className="pin-desc">
            Share this PIN with your rider when your order arrives to confirm delivery.
            <strong> Like Careem/foodpanda style.</strong>
          </p>

          <div className="pin-order-id">Order #{orderId}</div>

          {/* PIN DISPLAY */}
          <div className="pin-box">
            <div className="pin-label">Your Delivery PIN</div>
            {revealed ? (
              <div className="pin-digits">
                {pin.split('').map((d,i) => (
                  <div key={i} className="pin-digit">{d}</div>
                ))}
              </div>
            ) : (
              <div className="pin-hidden">
                {[1,2,3,4].map(i => <div key={i} className="pin-dot">●</div>)}
              </div>
            )}
            <button className="pin-reveal-btn" onClick={() => setRevealed(!revealed)}>
              {revealed ? '🙈 Hide PIN' : '👁️ Show PIN'}
            </button>
          </div>

          {/* TIMER */}
          <div className="pin-timer">
            <div className="pin-timer-icon">⏱️</div>
            <div>
              <div className="pin-timer-label">PIN expires in</div>
              <div className="pin-timer-val">
                {mins}:{secs.toString().padStart(2,'0')}
              </div>
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className="pin-instructions">
            <div className="pin-step">
              <div className="pin-step-num">1</div>
              <span>Rider arrives at your door</span>
            </div>
            <div className="pin-step">
              <div className="pin-step-num">2</div>
              <span>Rider asks for your PIN</span>
            </div>
            <div className="pin-step">
              <div className="pin-step-num">3</div>
              <span>Tell rider your <strong>4-digit PIN</strong></span>
            </div>
            <div className="pin-step">
              <div className="pin-step-num">4</div>
              <span>Order confirmed — enjoy your pizza! 🍕</span>
            </div>
          </div>

          {/* RIDER VERIFICATION (for testing) */}
          <div className="pin-verify-section">
            <div className="pin-verify-label">🛵 Rider PIN Entry (Demo)</div>
            <div className="pin-verify-row">
              <input
                className="pin-input"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                value={riderInput}
                onChange={e => setRiderInput(e.target.value.replace(/\D/,''))}
              />
              <button className="pin-verify-btn" onClick={verifyPin}>Verify</button>
            </div>
            {error && <div className="pin-error">⚠️ {error}</div>}
          </div>

        </div>
      </div>
    </div>
  );
}