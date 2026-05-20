const pool = require('../db/pool');

exports.getMeetings = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT m.*,
              o.name as "organizerName", o.avatar as "organizerAvatar",
              p.name as "participantName", p.avatar as "participantAvatar"
       FROM meetings m
       JOIN "User" o ON o.id = m.organizer_id
       JOIN "User" p ON p.id = m.participant_id
       WHERE m.organizer_id = $1 OR m.participant_id = $1
       ORDER BY m.scheduled_at ASC`,
      [userId]
    );

    const meetings = result.rows.map(m => ({
      ...m,
      organizer: { id: m.organizer_id, name: m.organizerName, avatar: m.organizerAvatar },
      participant: { id: m.participant_id, name: m.participantName, avatar: m.participantAvatar },
    }));

    res.json(meetings);
  } catch (err) {
    console.error('getMeetings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch meetings.' });
  }
};

exports.createMeeting = async (req, res) => {
  const { title, description, scheduledAt, durationMinutes, participantId, notes } = req.body;
  const organizerId = req.user.id;

  if (!title || !scheduledAt || !participantId)
    return res.status(400).json({ error: 'title, scheduledAt and participantId are required.' });

  try {
    // Check that participantId is not the same as organizerId
    if (participantId === organizerId)
      return res.status(400).json({ error: 'You cannot schedule a meeting with yourself.' });

    // Get organizer info
    const organizerRes = await pool.query(
      `SELECT id, name, avatar FROM "User" WHERE id = $1`, [organizerId]
    );
    const organizerInfo = organizerRes.rows[0];

    // Get participant info
    const participantRes = await pool.query(
      `SELECT id, name, avatar FROM "User" WHERE id = $1`, [participantId]
    );
    if (participantRes.rows.length === 0)
      return res.status(404).json({ error: 'Participant not found.' });
    const participantInfo = participantRes.rows[0];

    // Insert meeting
    const result = await pool.query(
      `INSERT INTO meetings (id, title, description, scheduled_at, duration_minutes, organizer_id, participant_id, notes, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [title, description || null, scheduledAt, durationMinutes || 60, organizerId, participantId, notes || null]
    );

    const meeting = result.rows[0];

    // Notify participant via DB notification
    const notifContent = `${organizerInfo?.name || 'Someone'} scheduled a meeting with you: "${title}" on ${new Date(scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`;
    await pool.query(
      `INSERT INTO "Notification" (id, type, content, read, "userId", "createdAt")
       VALUES (gen_random_uuid(), 'SYSTEM', $1, false, $2, NOW())`,
      [notifContent, participantId]
    );

    // Emit real-time socket notification to participant
    const io = req.app.get('io');
    if (io) {
      io.to(participantId).emit('receive_notification', {
        type: 'MEETING',
        content: notifContent,
        meeting: {
          ...meeting,
          organizer: organizerInfo,
          participant: participantInfo,
        },
      });

      // Also emit the full meeting object so participant's dashboard can update live
      io.to(participantId).emit('meeting_scheduled', {
        ...meeting,
        organizer: organizerInfo,
        participant: participantInfo,
      });
    }

    // Return full meeting with organizer/participant info
    res.status(201).json({
      ...meeting,
      organizer: organizerInfo,
      participant: participantInfo,
    });
  } catch (err) {
    console.error('createMeeting error:', err.message);
    res.status(500).json({ error: 'Failed to create meeting.' });
  }
};

exports.updateMeeting = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE meetings SET status=$1, notes=$2 WHERE id=$3 AND (organizer_id=$4 OR participant_id=$4) RETURNING *`,
      [status, notes || null, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Meeting not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update meeting.' });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    await pool.query(`DELETE FROM meetings WHERE id=$1 AND organizer_id=$2`, [req.params.id, req.user.id]);
    res.json({ message: 'Meeting deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete meeting.' });
  }
};
