import express from 'express';
import supabase from '../supabaseClient.js';
import analyzeSentiment from '../sentiment.js';

const router = express.Router();

// Helper to map DB row to API shape
function mapRow(row) {
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    severity: row.severity,
    status: row.status,
    submittedBy: row.submitted_by,
    submittedAt: row.submitted_at ? (typeof row.submitted_at === 'string' ? row.submitted_at : row.submitted_at.toISOString()) : null,
    resolvedAt: row.resolved_at ? (typeof row.resolved_at === 'string' ? row.resolved_at : row.resolved_at.toISOString()) : null,
    resolution: row.resolution,
    attachments: row.attachments,
    supportCount: row.support_count ?? 0,
    sentimentScore: row.sentiment_score ?? 0,
    sentimentLabel: row.sentiment_label ?? 'Neutral',
  };
}

// GET /api/complaints
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('complaints').select('*').order('submitted_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data: data.map(mapRow) });
});

// GET /api/complaints/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('complaints').select('*').eq('id', id).maybeSingle();
  if (error) return res.status(500).json({ success: false, message: error.message });
  if (!data) return res.status(404).json({ success: false, message: 'Complaint not found' });
  return res.json({ success: true, data: mapRow(data) });
});

// POST /api/complaints
router.post('/', async (req, res) => {
  const { title, description, category, severity = 'low', submittedBy = 'Anonymous', attachments = null } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Analyze sentiment for the complaint description
  const { score: sentimentScore, label: sentimentLabel } = analyzeSentiment(description);

  const { data, error } = await supabase.from('complaints').insert([
    {
      title,
      description,
      category,
      severity,
      submitted_by: submittedBy,
      attachments,
      sentiment_score: sentimentScore,
      sentiment_label: sentimentLabel,
    },
  ]).select().single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, data: mapRow(data) });
});

// PUT /api/complaints/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // Normalize client camelCase to DB snake_case
  if (updates.supportCount !== undefined) {
    updates.support_count = updates.supportCount;
    delete updates.supportCount;
  }
  if (updates.submittedBy !== undefined) {
    updates.submitted_by = updates.submittedBy;
    delete updates.submittedBy;
  }

  const { data, error } = await supabase.from('complaints').update(updates).eq('id', id).select().maybeSingle();

  if (error) return res.status(500).json({ success: false, message: error.message });
  if (!data) return res.status(404).json({ success: false, message: 'Complaint not found' });
  return res.json({ success: true, data: mapRow(data) });
});

// POST /api/complaints/:id/support  (increment support_count)
router.post('/:id/support', async (req, res) => {
  const { id } = req.params;

  // First read existing value
  const { data: row, error: fetchError } = await supabase.from('complaints').select('support_count').eq('id', id).maybeSingle();
  if (fetchError) return res.status(500).json({ success: false, message: fetchError.message });
  if (!row) return res.status(404).json({ success: false, message: 'Complaint not found' });

  const newCount = (row.support_count ?? 0) + 1;
  const { data, error } = await supabase.from('complaints').update({ support_count: newCount }).eq('id', id).select().maybeSingle();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data: mapRow(data) });
});

export default router;
