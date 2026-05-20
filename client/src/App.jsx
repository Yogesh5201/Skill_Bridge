import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/Admin';
import IncomingCallNotification from './components/IncomingCallNotification';
import VideoCallModal from './components/VideoCallModal';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null); // { from, fromName, offer }
  const [activeCall, setActiveCall] = useState(null);     // { targetUser, offer }

  // Init global socket when logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    const userId = (() => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1])).id;
      } catch { return null; }
    })();

    if (!userId) return;

    const s = io(API_URL);
    setSocket(s);

    s.on('connect', () => {
      s.emit('join', userId);
      setCurrentUser({ id: userId });
    });

    // Listen for incoming calls globally
    s.on('webrtc:incoming-call', ({ from, fromName, offer }) => {
      setIncomingCall({ from, fromName, offer });
    });

    return () => s.disconnect();
  }, [isLoggedIn]);

  const acceptCall = () => {
    if (!incomingCall) return;
    setActiveCall({
      targetUser: { id: incomingCall.from, name: incomingCall.fromName },
      offer: incomingCall.offer,
    });
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (socket && incomingCall) {
      socket.emit('webrtc:reject-call', { to: incomingCall.from });
    }
    setIncomingCall(null);
  };

  return (
    <>
      {/* Global incoming call notification */}
      <AnimatePresence>
        {incomingCall && (
          <IncomingCallNotification
            caller={{ name: incomingCall.fromName, avatar: null }}
            onAccept={acceptCall}
            onReject={rejectCall}
          />
        )}
      </AnimatePresence>

      {/* Global active video call */}
      {activeCall && socket && currentUser && (
        <VideoCallModal
          socket={socket}
          currentUser={currentUser}
          targetUser={activeCall.targetUser}
          initialOffer={activeCall.offer}
          onClose={() => setActiveCall(null)}
        />
      )}

      <Routes>
        <Route element={<MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </>
  );
}