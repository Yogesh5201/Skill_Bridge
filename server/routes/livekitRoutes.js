const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const router = express.Router();

// POST /api/livekit/token
// Body: { roomName, participantName }
router.post('/token', async (req, res) => {
  const { roomName, participantName } = req.body;

  if (!roomName || !participantName) {
    return res.status(400).json({ error: 'roomName and participantName are required' });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error('[LiveKit] LIVEKIT_API_KEY or LIVEKIT_API_SECRET not set');
    return res.status(500).json({ error: 'LiveKit credentials not configured on server' });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: '2h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    res.json({ token });
  } catch (err) {
    console.error('[LiveKit] Token generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate LiveKit token' });
  }
});

module.exports = router;
