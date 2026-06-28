import React, { useState } from 'react';
import './Payment.css';

const METHODS = [
  { id:'cod',       icon:'💵', label:'Cash on Delivery', sub:'Pay when your order arrives at your door', color:'#10b981' },
  { id:'jazzcash',  icon:'📱', label:'JazzCash',         sub:'Pay via JazzCash mobile wallet instantly',  color:'#ef4444' },
  { id:'easypaisa', icon:'📲', label:'Easypaisa',        sub:'Pay via Easypaisa mobile wallet instantly', color:'#22c55e' },
  { id:'card',      icon:'💳', label:'Credit/Debit Card', sub:'Visa, Mastercard — secure & encrypted',   color:'#3b82f6' },
];

export default function Payment({ total, onPaid, onBack }) {
  const [method, setMethod]     = useState('cod');
  const [txnId, setTxnId]       = useState('');
  const [card, setCard]         = useState({ number:'', expiry:'', cvv:'', name:'' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const delivery   = 150;
  const grandTotal = total + delivery;

  const handleCard = e => setCard({ ...card, [e.target.name]: e.target.value });

  const validate = () => {
    if (method === 'jazzcash' || method === 'easypaisa') {
      if (!txnId.trim()) { setError('Please enter Transaction ID'); return false; }
    }
    if (method === 'card') {
      if (!card.number || !card.expiry || !card.cvv || !card.name) {
        setError('Please fill all card details'); return false;
      }
    }
    return true;
  };

  const handlePay = () => {
    setError('');
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPaid({ method, txnId, grandTotal });
    }, 2000);
  };

  return (
    <div className="pay-page">

      <div className="pay-header">
        <button className="pay-back" onClick={onBack}>← Back</button>
        <h2>Payment</h2>
        <div className="pay-amount">Rs. {grandTotal.toLocaleString()}</div>
      </div>

      <div className="pay-body">

        {/* PAYMENT METHODS */}
        <div className="pay-methods">
          {METHODS.map(m => (
            <div
              key={m.id}
              className={`pay-method ${method === m.id ? 'active' : ''}`}
              style={method === m.id ? { borderColor: m.color } : {}}
              onClick={() => { setMethod(m.id); setError(''); }}
            >
              <div className="pay-method-icon" style={method === m.id ? { background: m.color + '22' } : {}}>
                {m.icon}
              </div>
              <div className="pay-method-info">
                <strong>{m.label}</strong>
                <span>{m.sub}</span>
              </div>
              <div className="pay-radio" style={method === m.id ? { background: m.color, borderColor: m.color } : {}}>
                {method === m.id && '✓'}
              </div>
            </div>
          ))}
        </div>

        {/* JAZZCASH DETAILS */}
        {method === 'jazzcash' && (
          <div className="pay-detail-box" style={{ borderColor: '#ef444433' }}>
            <div className="pay-detail-title" style={{ color: '#ef4444' }}>📱 JazzCash Payment</div>
            <div className="pay-steps">
              <div className="pay-step">1. Open JazzCash app on your phone</div>
              <div className="pay-step">2. Go to <strong>Send Money</strong></div>
              <div className="pay-step">3. Send <strong>Rs. {grandTotal.toLocaleString()}</strong> to number:</div>
              <div className="pay-number">0300 — 1234567</div>
              <div className="pay-step">4. Enter Transaction ID below:</div>
            </div>
            <input
              className="pay-input"
              placeholder="e.g. TXN123456789"
              value={txnId}
              onChange={e => setTxnId(e.target.value)}
            />
          </div>
        )}

        {/* EASYPAISA DETAILS */}
        {method === 'easypaisa' && (
          <div className="pay-detail-box" style={{ borderColor: '#22c55e33' }}>
            <div className="pay-detail-title" style={{ color: '#22c55e' }}>📲 Easypaisa Payment</div>
            <div className="pay-steps">
              <div className="pay-step">1. Open Easypaisa app on your phone</div>
              <div className="pay-step">2. Go to <strong>Send Money</strong></div>
              <div className="pay-step">3. Send <strong>Rs. {grandTotal.toLocaleString()}</strong> to number:</div>
              <div className="pay-number">0311 — 1234567</div>
              <div className="pay-step">4. Enter Transaction ID below:</div>
            </div>
            <input
              className="pay-input"
              placeholder="e.g. EP123456789"
              value={txnId}
              onChange={e => setTxnId(e.target.value)}
            />
          </div>
        )}

        {/* CARD DETAILS */}
        {method === 'card' && (
          <div className="pay-detail-box" style={{ borderColor: '#3b82f633' }}>
            <div className="pay-detail-title" style={{ color: '#3b82f6' }}>💳 Card Payment — Secure & Encrypted</div>
            <div className="pay-card-preview">
              <div className="pay-card-chip">▪▪▪</div>
              <div className="pay-card-number">
                {card.number ? card.number.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
              </div>
              <div className="pay-card-bottom">
                <span>{card.name || 'CARDHOLDER NAME'}</span>
                <span>{card.expiry || 'MM/YY'}</span>
              </div>
            </div>
            <div className="pay-card-fields">
              <div className="pay-field">
                <label>Card Number</label>
                <input
                  name="number"
                  className="pay-input"
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  value={card.number}
                  onChange={handleCard}
                />
              </div>
              <div className="pay-field-row">
                <div className="pay-field">
                  <label>Expiry Date</label>
                  <input
                    name="expiry"
                    className="pay-input"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={card.expiry}
                    onChange={handleCard}
                  />
                </div>
                <div className="pay-field">
                  <label>CVV</label>
                  <input
                    name="cvv"
                    className="pay-input"
                    placeholder="•••"
                    maxLength={3}
                    type="password"
                    value={card.cvv}
                    onChange={handleCard}
                  />
                </div>
              </div>
              <div className="pay-field">
                <label>Cardholder Name</label>
                <input
                  name="name"
                  className="pay-input"
                  placeholder="Name on card"
                  value={card.name}
                  onChange={handleCard}
                />
              </div>
            </div>
            <div className="pay-secure-badge">🔒 256-bit SSL encrypted — your card is safe</div>
          </div>
        )}

        {/* COD INFO */}
        {method === 'cod' && (
          <div className="pay-detail-box" style={{ borderColor: '#10b98133' }}>
            <div className="pay-detail-title" style={{ color: '#10b981' }}>💵 Cash on Delivery</div>
            <div className="pay-steps">
              <div className="pay-step">✅ No online payment needed</div>
              <div className="pay-step">✅ Pay <strong>Rs. {grandTotal.toLocaleString()}</strong> to the rider</div>
              <div className="pay-step">✅ Please keep exact change ready</div>
            </div>
          </div>
        )}

        {/* ORDER SUMMARY */}
        <div className="pay-summary">
          <div className="pay-summary-row"><span>Subtotal</span><span>Rs. {total.toLocaleString()}</span></div>
          <div className="pay-summary-row"><span>Delivery Fee</span><span>Rs. {delivery}</span></div>
          <div className="pay-summary-row total">
            <strong>Grand Total</strong>
            <strong>Rs. {grandTotal.toLocaleString()}</strong>
          </div>
        </div>

        {/* ERROR */}
        {error && <div className="pay-error">⚠️ {error}</div>}

        {/* PAY BUTTON */}
        <button
          className="pay-btn"
          onClick={handlePay}
          disabled={loading}
        >
          {loading
            ? '⏳ Processing...'
            : method === 'cod'
              ? '✅ Place Order — Pay on Delivery'
              : `💳 Pay Rs. ${grandTotal.toLocaleString()}`
          }
        </button>

      </div>
    </div>
  );
}