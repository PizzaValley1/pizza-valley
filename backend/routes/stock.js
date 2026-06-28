const express  = require('express');
const auth     = require('../middleware/auth');
const role     = require('../middleware/role');
const supabase = require('../config/supabase');
const router   = express.Router();

// ── GET ALL STOCK (admin only) ──
router.get('/', auth, role('admin', 'super_admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('stock').select('*').order('ingredient');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// ── ADD STOCK ITEM ──
router.post('/', auth, role('admin', 'super_admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('stock').insert([req.body]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ success: true, data });
});

// ── UPDATE STOCK ──
router.put('/:id', auth, role('admin', 'super_admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('stock').update({ ...req.body, updated_at: new Date() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, data });
});

// ── GET LOW STOCK ALERTS ──
router.get('/alerts', auth, role('admin', 'super_admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('stock').select('*')
    .lt('quantity', supabase.raw('low_alert'));
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

module.exports = router;