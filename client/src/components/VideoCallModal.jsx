import { useEffect, useRef, useState, useCallback } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://skill-bridge-zcin.onrender.com' : 'http://localhost:5000');

const FALLBACK_ICE = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
  iceCandidatePoolSize: 10,
};

async function fetchIceConfig() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ice-servers`);
    if (!res.ok) throw new Error('Failed to fetch ICE servers');
    const servers = await res.json();
    console.log('[WebRTC] Fetched ICE servers:', servers.length, 'entries');
    return { iceServers: servers, iceCandidatePoolSize: 10 };
  } catch (e) {
    console.warn('[WebRTC] Using fallback ICE config:', e.message);
    return FALLBACK_ICE;
  }
}

export default function VideoCallModal({ socket, currentUser, targetUser, initialOffer, onClose }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const closedRef = useRef(false);
  // Buffer ICE candidates that arrive before remoteDescription is set
  const iceCandidateBuffer = useRef([]);
  const remoteDescSet = useRef(false);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [status, setStatus] = useState(initialOffer ? 'connecting' : 'calling');
  const [duration, setDuration] = useState(0);

  // Apply buffered ICE candidates after remote description is set
  const drainIceCandidates = useCallback(async (pc) => {
    const buffered = iceCandidateBuffer.current.splice(0);
    for (const candidate of buffered) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('[WebRTC] Applied buffered ICE candidate');
      } catch (e) {
        console.warn('[WebRTC] Failed to apply buffered ICE candidate:', e.message);
      }
    }
  }, []);

  // ── Guaranteed cleanup ────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      localStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.oniceconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    socket.off('webrtc:call-accepted');
    socket.off('webrtc:ice-candidate');
    socket.off('webrtc:call-ended');
    socket.off('webrtc:call-rejected');
  }, [socket]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // Duration timer
  useEffect(() => {
    if (status !== 'connected') return;
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ── Start WebRTC ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const iceConfig = await fetchIceConfig();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection(iceConfig);
        pcRef.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // When remote video arrives
        pc.ontrack = (event) => {
          console.log('[WebRTC] Remote track received');
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
          setStatus('connected');
        };

        // Send our ICE candidates to the other peer
        pc.onicecandidate = ({ candidate }) => {
          if (candidate) {
            console.log('[WebRTC] Sending ICE candidate');
            socket.emit('webrtc:ice-candidate', { to: targetUser.id, candidate });
          }
        };

        // Log ICE gathering state
        pc.onicegatheringstatechange = () => {
          console.log('[WebRTC] ICE gathering state:', pc.iceGatheringState);
        };

        // Log ICE connection state (more granular than connectionState)
        pc.oniceconnectionstatechange = () => {
          console.log('[WebRTC] ICE connection state:', pc.iceConnectionState);
          if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
            setStatus('connected');
          }
        };

        pc.onconnectionstatechange = () => {
          const state = pc.connectionState;
          console.log('[WebRTC] Connection state:', state);
          if (state === 'failed' || state === 'closed') {
            setStatus('ended');
            cleanup();
            setTimeout(onClose, 1500);
          }
        };

        // ── CALLEE: Got an offer, send back an answer ──
        if (initialOffer) {
          await pc.setRemoteDescription(new RTCSessionDescription(initialOffer));
          remoteDescSet.current = true;
          await drainIceCandidates(pc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc:accept-call', { to: targetUser.id, answer });
        }
        // ── CALLER: Create offer and wait for answer ──
        else {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('webrtc:call-user', {
            to: targetUser.id,
            from: currentUser.id,
            fromName: currentUser.name,
            offer,
          });

          socket.on('webrtc:call-accepted', async ({ answer }) => {
            try {
              if (pc.signalingState !== 'have-local-offer') return;
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
              remoteDescSet.current = true;
              await drainIceCandidates(pc);
              setStatus('connected');
            } catch (e) {
              console.error('[WebRTC] Error setting remote answer:', e);
            }
          });
        }

        // ── ICE candidates from the other peer ──
        // Buffer them if remote description isn't set yet
        socket.on('webrtc:ice-candidate', async ({ candidate }) => {
          if (!candidate) return;
          if (remoteDescSet.current && pcRef.current) {
            try {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.warn('[WebRTC] Failed to add ICE candidate:', e.message);
            }
          } else {
            console.log('[WebRTC] Buffering ICE candidate (remote desc not set yet)');
            iceCandidateBuffer.current.push(candidate);
          }
        });

        socket.on('webrtc:call-ended', () => {
          setStatus('ended');
          cleanup();
          setTimeout(onClose, 1200);
        });

        socket.on('webrtc:call-rejected', () => {
          setStatus('rejected');
          cleanup();
          setTimeout(onClose, 1200);
        });

      } catch (err) {
        console.error('[WebRTC] Fatal error:', err.message);
        setStatus('error');
      }
    };

    start();
    return () => { cancelled = true; };
  }, []); // run once on mount

  const endCall = () => {
    socket.emit('webrtc:end-call', { to: targetUser.id });
    cleanup();
    onClose();
  };

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setMicOn(p => !p);
  };

  const toggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setCamOn(p => !p);
  };

  const statusText = {
    calling: `Calling ${targetUser.name}...`,
    connecting: 'Connecting...',
    connected: fmt(duration),
    ended: 'Call ended',
    rejected: 'Call rejected',
    error: 'Camera/mic unavailable',
  }[status];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

        {/* Remote video */}
        <div className="relative w-full h-[65vh] bg-gray-900 flex items-center justify-center">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

          {status !== 'connected' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <img
                src={targetUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${targetUser.name}`}
                className="w-24 h-24 rounded-full border-4 border-gray-700 mb-4 animate-pulse"
                alt=""
              />
              <p className="text-white font-bold text-xl">{targetUser.name}</p>
              <p className="text-gray-400 mt-2 text-sm">{statusText}</p>
            </div>
          )}

          {/* Local PiP */}
          <div className="absolute bottom-4 right-4 w-36 h-28 sm:w-48 sm:h-36 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-xl bg-gray-900">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!camOn && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div className="absolute bottom-1 left-2 text-[10px] text-gray-400 font-mono">You</div>
          </div>

          {/* Duration badge */}
          {status === 'connected' && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-1.5 text-sm text-emerald-400 font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {fmt(duration)}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="h-24 flex items-center justify-center gap-6 bg-[#111]">
          <button
            onClick={toggleMic}
            title={micOn ? 'Mute' : 'Unmute'}
            className={`p-4 rounded-full border transition-all ${micOn ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}
          >
            {micOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6" />}
          </button>

          <button
            onClick={endCall}
            title="End Call"
            className="p-5 rounded-full bg-red-600 hover:bg-red-700 transition-all shadow-[0_0_24px_rgba(220,38,38,0.5)] active:scale-95"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>

          <button
            onClick={toggleCam}
            title={camOn ? 'Turn off camera' : 'Turn on camera'}
            className={`p-4 rounded-full border transition-all ${camOn ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}
          >
            {camOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
