import React, { useEffect, useState, useRef, useCallback } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://skill-bridge-zcin.onrender.com' : 'http://localhost:5000');
const LIVEKIT_URL = 'wss://skill-bridge-559hcvsj.livekit.cloud';

export default function VideoCallModal({ socket, currentUser, targetUser, onClose }) {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const closedRef = useRef(false);

  // Generate a predictable, unique room name for these two users
  const roomName = `skillbridge-${[currentUser.id, targetUser.id].sort().join('-')}`;

  const cleanup = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    socket.off('webrtc:call-ended');
    socket.off('webrtc:call-rejected');
    onClose();
  }, [socket, onClose]);

  // Fetch LiveKit token from our backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const participantName = currentUser.name || `User-${currentUser.id}`;
        const res = await fetch(`${API_URL}/api/livekit/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ roomName, participantName }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned ${res.status}`);
        }

        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.error('[LiveKit] Failed to get token:', err);
        setError(err.message);
      }
    };

    fetchToken();
  }, [roomName, currentUser]);

  // Listen for call-end signals from the other side
  useEffect(() => {
    socket.on('webrtc:call-ended', cleanup);
    socket.on('webrtc:call-rejected', cleanup);
    return () => {
      socket.off('webrtc:call-ended', cleanup);
      socket.off('webrtc:call-rejected', cleanup);
    };
  }, [socket, cleanup]);

  const handleEndCall = () => {
    socket.emit('webrtc:end-call', { to: targetUser.id });
    cleanup();
  };

  // Loading state
  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
        <div className="bg-[#111] border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <div className="text-red-400 text-lg font-bold mb-2">Connection Failed</div>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={handleEndCall}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-semibold text-lg">Connecting to video call...</p>
          <p className="text-gray-500 text-sm">Setting up secure connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Custom top bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#111] border-b border-gray-800 flex-shrink-0 z-[101]">
        <div className="text-white font-semibold text-sm">
          Video Call with {targetUser.name}
        </div>
        <button
          onClick={handleEndCall}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          End Call
        </button>
      </div>

      {/* LiveKit Room */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <LiveKitRoom
          serverUrl={LIVEKIT_URL}
          token={token}
          connect={true}
          video={true}
          audio={true}
          onDisconnected={() => {
            cleanup();
          }}
          style={{ height: '100%', width: '100%' }}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  );
}
