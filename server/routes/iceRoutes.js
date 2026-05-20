const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const apiKey = process.env.METERED_API_KEY;
  const appName = process.env.METERED_APP_NAME; // e.g. "skill-bridge" from your Metered app

  if (!apiKey || !appName) {
    // Fallback: STUN only (works same-network, fails cross-network)
    console.warn('[ICE] METERED_API_KEY or METERED_APP_NAME not set, using STUN only');
    return res.json([
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]);
  }

  try {
    const response = await fetch(
      `https://${appName}.metered.ca/api/v1/turn/credentials?apiKey=${apiKey}`
    );
    if (!response.ok) throw new Error(`Metered API returned ${response.status}`);
    const iceServers = await response.json();
    console.log('[ICE] Fetched TURN credentials from Metered.ca');
    res.json(iceServers);
  } catch (err) {
    console.error('[ICE] Failed to fetch TURN credentials:', err.message);
    res.json([
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]);
  }
});

module.exports = router;
