const pool = require('../db/pool');

exports.sendRequest = async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;

  if (!receiverId)
    return res.status(400).json({ error: 'receiverId is required.' });
  if (receiverId === senderId)
    return res.status(400).json({ error: 'You cannot send a request to yourself.' });

  try {
    const result = await pool.query(
      `INSERT INTO "SwapRequest" (id, status, "senderId", "receiverId", message, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'PENDING', $1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [senderId, receiverId, message || null]
    );

    // Create notification
    await pool.query(
      `INSERT INTO "Notification" (id, type, content, read, "userId", "createdAt")
       VALUES (gen_random_uuid(), 'REQUEST', 'You have a new swap request.', false, $1, NOW())`,
      [receiverId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('sendRequest error:', err);
    res.status(500).json({ error: 'Failed to send request.' });
  }
};

exports.getRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const received = await pool.query(
      `SELECT sr.*, u.name as "senderName", u.avatar as "senderAvatar"
       FROM "SwapRequest" sr
       JOIN "User" u ON u.id = sr."senderId"
       WHERE sr."receiverId" = $1
       ORDER BY sr."createdAt" DESC`,
      [userId]
    );

    const sent = await pool.query(
      `SELECT sr.*, u.name as "receiverName", u.avatar as "receiverAvatar"
       FROM "SwapRequest" sr
       JOIN "User" u ON u.id = sr."receiverId"
       WHERE sr."senderId" = $1
       ORDER BY sr."createdAt" DESC`,
      [userId]
    );

    // Format to match frontend expectations
    const formatReceived = received.rows.map(r => ({
      ...r,
      sender: { name: r.senderName, avatar: r.senderAvatar }
    }));
    const formatSent = sent.rows.map(r => ({
      ...r,
      receiver: { name: r.receiverName, avatar: r.receiverAvatar }
    }));

    res.json({ received: formatReceived, sent: formatSent });
  } catch (err) {
    console.error('getRequests error:', err);
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['ACCEPTED', 'REJECTED', 'COMPLETED'];

  if (!validStatuses.includes(status))
    return res.status(400).json({ error: 'Invalid status.' });

  try {
    const result = await pool.query(
      `UPDATE "SwapRequest" SET status=$1, "updatedAt"=NOW()
       WHERE id=$2 AND "receiverId"=$3
       RETURNING *`,
      [status, id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Request not found or unauthorized.' });

    // Notify sender
    await pool.query(
      `INSERT INTO "Notification" (id, type, content, read, "userId", "createdAt")
       VALUES (gen_random_uuid(), 'SYSTEM', $1, false, $2, NOW())`,
      [`Your swap request was ${status.toLowerCase()}.`, result.rows[0].senderId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateRequestStatus error:', err);
    res.status(500).json({ error: 'Failed to update request.' });
  }
};
