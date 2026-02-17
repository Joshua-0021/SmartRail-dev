import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// =====================================================
// GET /api/complaints/:complaintId/replies
// Fetch all replies for a specific complaint
// =====================================================
router.get('/:complaintId/replies', async (req, res) => {
    try {
        const { complaintId } = req.params;
        const authHeader = req.headers.authorization;

        console.log('📥 Fetching replies for complaint:', complaintId);

        if (!authHeader) {
            console.log('❌ No auth header provided');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify user
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            console.log('❌ Invalid token or user error:', userError);
            return res.status(401).json({ error: 'Invalid token' });
        }

        console.log('✅ User authenticated:', user.id);

        // Verify user owns this complaint (using admin client to bypass RLS)
        const { data: complaint, error: complaintError } = await supabaseAdmin
            .from('complaints')
            .select('id, user_id')
            .eq('id', complaintId)
            .eq('user_id', user.id)
            .single();

        if (complaintError || !complaint) {
            console.log('❌ Complaint query error:', complaintError);
            console.log('   Looking for complaint:', complaintId, 'for user:', user.id);
            return res.status(404).json({ error: 'Complaint not found or access denied' });
        }

        console.log('✅ Complaint found:', complaint.id);

        // Fetch all replies for this complaint (using admin client)
        const { data: replies, error: repliesError } = await supabaseAdmin
            .from('complaint_replies')
            .select('*')
            .eq('complaint_id', complaintId)
            .order('created_at', { ascending: true });

        if (repliesError) {
            console.log('❌ Replies fetch error:', repliesError);
            return res.status(500).json({ error: 'Failed to fetch replies' });
        }

        console.log('✅ Fetched', replies?.length || 0, 'replies');
        res.json({ replies: replies || [] });

    } catch (error) {
        console.error('💥 Error fetching replies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// =====================================================
// POST /api/complaints/:complaintId/replies
// Add a new reply to a complaint
// =====================================================
router.post('/:complaintId/replies', async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { message, marks_resolved } = req.body;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify user
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Verify user owns this complaint (using admin client to bypass RLS)
        const { data: complaint, error: complaintError } = await supabaseAdmin
            .from('complaints')
            .select('id, user_id, status')
            .eq('id', complaintId)
            .eq('user_id', user.id)
            .single();

        if (complaintError || !complaint) {
            return res.status(404).json({ error: 'Complaint not found or access denied' });
        }

        // Check if complaint is closed or resolved
        if (complaint.status === 'closed' || complaint.status === 'resolved') {
            return res.status(400).json({ error: 'Cannot reply to closed or resolved complaints' });
        }

        // Insert the reply (using admin client)
        const { data: newReply, error: insertError } = await supabaseAdmin
            .from('complaint_replies')
            .insert({
                complaint_id: complaintId,
                user_id: user.id,
                message: message.trim(),
                is_admin_reply: false,
                marks_resolved: marks_resolved || false
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            return res.status(500).json({ error: 'Failed to create reply' });
        }

        res.status(201).json({ reply: newReply });

    } catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
