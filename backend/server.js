const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes  = require('./routes/auth');
const menuRoutes  = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const stockRoutes = require('./routes/stock');

const app = express();

// ── SECURITY ──
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// ── RATE LIMIT ──
app.use('/api/', rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 100,
  message  : { error: 'Too many requests, try again later.' }
}));

// ── ROUTES ──
app.use('/api/auth',   authRoutes);
app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stock',  stockRoutes);

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({ status: 'Pizza Valley API running 🍕', version: '2.0.0' });
});

// ── 404 ──
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🍕`));