const pool = require('../db/pool');

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content)
    return res.status(400).json({ error: 'receiverId and content are required.' });

  try {
    const result = await pool.query(
      `INSERT INTO "Message" (id, content, "senderId", "receiverId", read, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, false, NOW())
       RETURNING *`,
      [content, req.user.id, receiverId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM "Message"
       WHERE ("senderId" = $1 AND "receiverId" = $2)
          OR ("senderId" = $2 AND "receiverId" = $1)
       ORDER BY "createdAt" ASC`,
      [myId, userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};
