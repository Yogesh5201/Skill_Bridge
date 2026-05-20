import React, { useEffect, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

export default function VideoCallModal({ socket, currentUser, targetUser, onClose }) {
  const closedRef = useRef(false);

  // Generate a predictable, unique room name for these two users
  const roomName = `SkillBridge-Call-${[currentUser.id, targetUser.id].sort().join('-')}`;

  const cleanup = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    socket.off('webrtc:call-ended');
    socket.off('webrtc:call-rejected');
    onClose();
  };

  useEffect(() => {
    socket.on('webrtc:call-ended', () => {
      cleanup();
    });
    
    socket.on('webrtc:call-rejected', () => {
      cleanup();
    });

    return () => cleanup();
  }, [socket]);

  const handleEndCall = () => {
    socket.emit('webrtc:end-call', { to: targetUser.id });
    cleanup();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-[101] bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white font-semibold">
          Video Call with {targetUser.name}
        </div>
        <button 
          onClick={handleEndCall}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg"
        >
          End Call
        </button>
      </div>

      <div className="w-full h-full pt-16">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableModeratorIndicator: true,
            startScreenSharing: false,
            enableEmailInStats: false,
            prejoinPageEnabled: false, // Skip pre-join screen to feel like a native call
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_CHROME_EXTENSION_BANNER: false,
          }}
          userInfo={{
            displayName: currentUser.name,
          }}
          onApiReady={(externalApi) => {
            // Automatically end our side if we leave the meeting via Jitsi UI
            externalApi.addListener('videoConferenceLeft', () => {
              handleEndCall();
            });
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
            iframeRef.style.border = 'none';
          }}
        />
      </div>
    </div>
  );
}
