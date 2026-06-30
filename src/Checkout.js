import React, { useState } from 'react';
import './Checkout.css';
import Payment from './Payment';
import LocationPicker from './LocationPicker';

const STEPS = ['Cart Review', 'Delivery Info', 'Payment', 'Confirmation'];

export default function Checkout({ cart, total, onBack, updateQty, removeFromCart, onOrderPlaced }) {
  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState({ name:'', phone:'', notes:'' });
  const [orderId]                 = useState('PV' + Math.floor(Math.random()*90000+10000));
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null); // { type, address, distance, eta } or { type:'pickup' }

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const delivery   = deliveryInfo?.type === 'pickup' ? 0 : (deliveryInfo?.distance > 5 ? 200 : 150);
  const grandTotal = total + delivery; // eslint-disable-line no-unused-vars

  const handleOrderPlaced = () => {
    if (onOrderPlaced) onOrderPlaced(orderId);
    else setStep(3);
  };

  return (
    <div className="co-page">

      {/* LOCATION PICKER MODAL */}
      {showLocationPicker && (
        <LocationPicker
          onConfirm={(info) => setDeliveryInfo(info)}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

      {/* HEADER */}
      <div className="co-header">
        <button className="co-back" onClick={onBack}>← Back to Menu</button>
        <div className="co-logo">🍕 Pizza Valley</div>
        <div />
      </div>

      {/* STEPS */}
      <div className="co-steps">
        {STEPS.map((s, i) => (
          <div key={i} className={`co-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="co-step-num">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="co-body">

        {/* STEP 0 — CART REVIEW */}
        {step === 0 && (
          <div className="co-section">
            <h2>Review Your Order</h2>
            {cart.length === 0 ? (
              <div className="co-empty">
                <p>🍕 Your cart is empty</p>
                <button className="co-btn" onClick={onBack}>Browse Menu</button>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div className="co-item" key={item.id}>
                    <img src={item.img} alt={item.name} className="co-item-img" />
                    <div className="co-item-info">
                      <strong>{item.displayName || item.name}</strong>
                      <span>Rs. {item.price.toLocaleString()} each</span>
                    </div>
                    <div className="co-item-qty">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <div className="co-item-total">Rs. {(item.price * item.qty).toLocaleString()}</div>
                    <button className="co-remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                  </div>
                ))}
                <div className="co-summary">
                  <div className="co-summary-row"><span>Subtotal</span><span>Rs. {total.toLocaleString()}</span></div>
                  <div className="co-summary-row total"><span>Total</span><strong>Rs. {total.toLocaleString()}</strong></div>
                </div>
                <button className="co-btn" onClick={() => setStep(1)}>Continue to Delivery →</button>
              </>
            )}
          </div>
        )}

        {/* STEP 1 — DELIVERY INFO */}
        {step === 1 && (
          <div className="co-section">
            <h2>Delivery Information</h2>

            <div className="co-form">
              <div className="co-field">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Your full name" />
              </div>
              <div className="co-field">
                <label>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="03XX-XXXXXXX" />
              </div>

              {/* LOCATION SELECTOR */}
              <div className="co-field">
                <label>Delivery Location</label>
                {deliveryInfo ? (
                  <div className="co-location-confirmed" onClick={() => setShowLocationPicker(true)}>
                    {deliveryInfo.type === 'pickup' ? (
                      <>
                        <span className="co-loc-icon">🏪</span>
                        <div>
                          <strong>Self Pickup</strong>
                          <span>Pizza Valley - Saddar Branch</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="co-loc-icon">📍</span>
                        <div>
                          <strong>{deliveryInfo.distance} km away · {deliveryInfo.eta} min</strong>
                          <span>{deliveryInfo.address?.slice(0, 60)}...</span>
                        </div>
                      </>
                    )}
                    <span className="co-loc-edit">Edit →</span>
                  </div>
                ) : (
                  <button className="co-location-btn" onClick={() => setShowLocationPicker(true)}>
                    📍 Set Delivery Location / Pickup
                  </button>
                )}
              </div>

              <div className="co-field">
                <label>Order Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handle}
                  placeholder="Extra cheese, no onions..." rows={3} />
              </div>
            </div>
            <div className="co-nav-btns">
              <button className="co-btn-outline" onClick={() => setStep(0)}>← Back</button>
              <button className="co-btn" onClick={() => setStep(2)}
                disabled={!form.name || !form.phone || !deliveryInfo}>
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — PAYMENT */}
        {step === 2 && (
          <Payment
            total={total + delivery}
            onBack={() => setStep(1)}
            onPaid={handleOrderPlaced}
          />
        )}

        {/* STEP 3 — CONFIRMATION */}
        {step === 3 && (
          <div className="co-section co-confirm">
            <div className="co-confirm-icon">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p>Your order has been received and is being prepared.</p>
            <div className="co-order-id">Order #{orderId}</div>
            <div className="co-tracking">
              <div className="co-track-step done">✓ Order Received</div>
              <div className="co-track-step active">🔥 Preparing your pizza</div>
              <div className="co-track-step">🚴 Out for delivery</div>
              <div className="co-track-step">✅ Delivered</div>
            </div>
            <p className="co-eta">⏱ Estimated: <strong>{deliveryInfo?.eta || 30} minutes</strong></p>
            <button className="co-btn" onClick={onBack}>Back to Menu</button>
          </div>
        )}

      </div>
    </div>
  );
}