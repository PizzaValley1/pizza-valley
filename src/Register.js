import React, { useState } from 'react';
import './Auth.css';

export default function Register({ onSwitch, onClose }) {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirm) {
      setError('Please fill all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('pv_users') || '[]');

      // Check if email already exists
      const exists = users.find(u => u.email === form.email);
      if (exists) {
        setError('This email is already registered. Please login.');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id       : Date.now().toString(),
        name     : form.name,
        email    : form.email,
        phone    : form.phone,
        password : form.password,
        role     : 'customer',
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('pv_users', JSON.stringify(users));

      // Auto login
      localStorage.setItem('pv_current_user', JSON.stringify({
        id    : newUser.id,
        name  : newUser.name,
        email : newUser.email,
        phone : newUser.phone,
        role  : newUser.role,
      }));

      setSuccess(`Account created! Welcome, ${newUser.name}! 🎉`);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1200);

    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🍕 Pizza Valley</div>
        <h2>Create Account</h2>
        <p className="auth-sub">Join us and start ordering!</p>

        {error   && <div className="auth-error">⚠️ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        <form onSubmit={submit}>
          <div className="auth-field">
            <label>Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={handle}
              required
            />
          </div>
          <div className="auth-field">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handle}
              required
            />
          </div>
          <div className="auth-field">
            <label>Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="03XX-XXXXXXX"
              value={form.phone}
              onChange={handle}
              required
            />
          </div>
          <div className="auth-grid2">
            <div className="auth-field">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handle}
                required
              />
            </div>
            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                name="confirm"
                type="password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={handle}
                required
              />
            </div>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button className="auth-link" onClick={onSwitch}>Login here</button>
        </p>
      </div>
    </div>
  );
}