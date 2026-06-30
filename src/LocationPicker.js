import React, { useState, useEffect } from 'react';
import './LocationPicker.css';

// Restaurant location (Rawalpindi - Saddar branch)
const RESTAURANT_LOCATION = { lat: 33.5969, lng: 73.0479, name: 'Pizza Valley - Saddar Branch' };

// Calculate distance between two coordinates (Haversine formula)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function estimateDeliveryTime(distanceKm) {
  const prepTime = 12; // minutes to prepare pizza
  const travelTime = Math.ceil(distanceKm * 4); // ~15km/h avg city speed
  return prepTime + travelTime;
}

export default function LocationPicker({ onConfirm, onClose }) {
  const [orderType, setOrderType]   = useState('delivery'); // delivery | pickup
  const [location, setLocation]     = useState(null);
  const [address, setAddress]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [distance, setDistance]     = useState(0);
  const [eta, setEta]               = useState(0);

  const detectLocation = () => {
    setError('');
    setLoading(true);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });

        const dist = getDistance(RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng, lat, lng);
        setDistance(dist);
        setEta(estimateDeliveryTime(dist));

        // Reverse geocode using free Nominatim API
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            setAddress(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          })
          .catch(() => {
            setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          })
          .finally(() => setLoading(false));
      },
      (err) => {
        setError('Could not detect location. Please enable location permission or enter address manually.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (orderType === 'delivery') {
      detectLocation();
    }
  }, [orderType]);

  const handleConfirm = () => {
    if (orderType === 'pickup') {
      onConfirm({
        type: 'pickup',
        restaurant: RESTAURANT_LOCATION,
        eta: 15, // pickup ready time
      });
    } else {
      if (!location) {
        setError('Please detect or enter your location first');
        return;
      }
      onConfirm({
        type: 'delivery',
        location,
        address,
        distance: distance.toFixed(1),
        eta,
      });
    }
    onClose();
  };

  return (
    <div className="lp-overlay" onClick={onClose}>
      <div className="lp-modal" onClick={e => e.stopPropagation()}>

        <div className="lp-header">
          <h2>📍 Delivery or Pickup?</h2>
          <button className="lp-close" onClick={onClose}>✕</button>
        </div>

        <div className="lp-body">

          {/* ORDER TYPE SELECTOR */}
          <div className="lp-type-grid">
            <button
              className={`lp-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
              onClick={() => setOrderType('delivery')}>
              <span className="lp-type-icon">🚴</span>
              <span className="lp-type-label">Delivery</span>
              <span className="lp-type-desc">Delivered to your door</span>
            </button>
            <button
              className={`lp-type-btn ${orderType === 'pickup' ? 'active' : ''}`}
              onClick={() => setOrderType('pickup')}>
              <span className="lp-type-icon">🏪</span>
              <span className="lp-type-label">Self Pickup</span>
              <span className="lp-type-desc">Collect from restaurant</span>
            </button>
          </div>

          {/* DELIVERY VIEW */}
          {orderType === 'delivery' && (
            <>
              <div className="lp-map-box">
                {loading ? (
                  <div className="lp-map-loading">
                    <div className="lp-spinner"></div>
                    <span>Detecting your location...</span>
                  </div>
                ) : location ? (
                  <iframe
                    title="map"
                    className="lp-map-iframe"
                    src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                  />
                ) : (
                  <div className="lp-map-placeholder">
                    <span>🗺️</span>
                    <p>Map will appear here</p>
                  </div>
                )}
              </div>

              {error && <div className="lp-error">⚠️ {error}</div>}

              <button className="lp-detect-btn" onClick={detectLocation} disabled={loading}>
                📍 {loading ? 'Detecting...' : 'Detect My Location'}
              </button>

              <div className="lp-address-field">
                <label>Delivery Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your full address with landmark"
                  rows={3}
                />
              </div>

              {location && (
                <div className="lp-distance-info">
                  <div className="lp-distance-item">
                    <span>📏 Distance</span>
                    <strong>{distance.toFixed(1)} km</strong>
                  </div>
                  <div className="lp-distance-item">
                    <span>⏱️ Estimated Time</span>
                    <strong>{eta} minutes</strong>
                  </div>
                  <div className="lp-distance-item">
                    <span>🚴 Delivery Fee</span>
                    <strong>Rs. {distance > 5 ? 200 : 150}</strong>
                  </div>
                </div>
              )}
            </>
          )}

          {/* PICKUP VIEW */}
          {orderType === 'pickup' && (
            <div className="lp-pickup-box">
              <div className="lp-pickup-icon">🏪</div>
              <h3>{RESTAURANT_LOCATION.name}</h3>
              <p>Saddar Road, Rawalpindi, Pakistan</p>
              <div className="lp-pickup-info">
                <div className="lp-pickup-item">
                  <span>⏱️ Ready in</span>
                  <strong>15-20 minutes</strong>
                </div>
                <div className="lp-pickup-item">
                  <span>💰 No delivery fee</span>
                  <strong>Save Rs. 150</strong>
                </div>
              </div>
              <iframe
                title="restaurant-map"
                className="lp-map-iframe"
                style={{marginTop:16}}
                src={`https://maps.google.com/maps?q=${RESTAURANT_LOCATION.lat},${RESTAURANT_LOCATION.lng}&z=15&output=embed`}
              />
            </div>
          )}

        </div>

        <div className="lp-footer">
          <button className="lp-confirm-btn" onClick={handleConfirm}>
            Confirm {orderType === 'delivery' ? 'Delivery Address' : 'Pickup'} →
          </button>
        </div>

      </div>
    </div>
  );
}