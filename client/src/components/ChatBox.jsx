import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Send, X, MessageSquare, Video, Paperclip, FileText,
  Download, Trash2, Phone, Image, File, ChevronDown
} from 'lucide-react';
import { getMessages, sendMessage } from '../api/messageApi';
import { uploadDocument, getDocuments, deleteDocument } from '../api/documentApi';
import VideoCallModal from './VideoCallModal';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://skill-bridge-zcin.onrender.com' : 'http://localhost:5000');

export default function ChatBox({ currentUser, otherUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [tab, setTab] = useState('chat');
  const [uploading, setUploading] = useState(false);
  const [inCall, setInCall] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Init socket
  useEffect(() => {
    const s = io(API_URL);
    setSocket(s);
    s.on('connect', () => s.emit('join', currentUser.id));
    s.on('receive_message', (data) => {
      if (data.senderId === otherUser.id) setMessages(p => [...p, data]);
    });
    return () => s.disconnect();
  }, [currentUser.id, otherUser.id]);

  // Load history
  useEffect(() => {
    getMessages(otherUser.id).then(setMessages).catch(() => {});
  }, [otherUser.id]);

  // Load docs when tab switches
  useEffect(() => {
    if (tab === 'docs') getDocuments(otherUser.id).then(setDocuments).catch(() => {});
  }, [tab, otherUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartCall = () => {
    socket?.emit('webrtc:call-user', {
      to: otherUser.id,
      from: currentUser.id,
      fromName: currentUser.name,
    });
    setInCall(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msgData = { senderId: currentUser.id, receiverId: otherUser.id, content: newMessage, createdAt: new Date().toISOString() };
    setMessages(p => [...p, msgData]);
    setNewMessage('');
    socket?.emit('send_message', msgData);
    try { await sendMessage({ receiverId: otherUser.id, content: msgData.content }); } catch {}
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const doc = await uploadDocument(file, otherUser.id);
      setDocuments(p => [doc, ...p]);
      setTab('docs');
    } catch (err) { alert('Upload failed: ' + (err.message || 'error')); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleDeleteDoc = async (docId) => {
    try { await deleteDocument(docId); setDocuments(p => p.filter(d => d.id !== docId)); } catch {}
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1048576).toFixed(1)}MB`;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const getFileEmoji = (mime = '') => {
    if (mime.startsWith('image/')) return '🖼️';
    if (mime === 'application/pdf') return '📄';
    if (mime.includes('word')) return '📝';
    if (mime.includes('sheet') || mime.includes('excel')) return '📊';
    return '📎';
  };

  const otherAvatar = otherUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(otherUser.name || 'U')}`;
  const myAvatar = currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name || 'M')}`;

  return (
    <>
      {/* Full-screen overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="w-full max-w-5xl h-[85vh] bg-[#0d0d0d] border border-gray-800/60 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">

          {/* ── Top Header ───────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#111] border-b border-gray-800/60 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={otherAvatar} alt="" className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover" />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#111]"></span>
              </div>
              <div>
                <h2 className="font-bold text-white text-lg leading-tight">{otherUser.name}</h2>
                <p className="text-xs text-emerald-400 font-medium">Active now</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab buttons */}
              <div className="flex bg-[#0a0a0a] border border-gray-800 rounded-xl p-1 gap-1 mr-2">
                <button onClick={() => setTab('chat')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition ${tab === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                  Chat
                </button>
                <button onClick={() => setTab('docs')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition ${tab === 'docs' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                  Files {documents.length > 0 ? `(${documents.length})` : ''}
                </button>
              </div>

              <button
                onClick={handleStartCall}
                className="flex items-center gap-2 px-4 py-2 bg-[#00c3ff]/10 border border-[#00c3ff]/30 text-[#00c3ff] rounded-xl text-sm font-bold hover:bg-[#00c3ff]/20 transition"
              >
                <Video className="w-4 h-4" /> Video Call
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 bg-[#0a0a0a] border border-gray-700 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 rounded-xl transition"
                title="Share file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />

              <button onClick={onClose} className="p-2.5 bg-[#0a0a0a] border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Body ─────────────────────────────────────────────────────── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Left sidebar — user info */}
            <div className="w-64 flex-shrink-0 border-r border-gray-800/60 bg-[#0a0a0a] p-6 hidden md:flex flex-col gap-6">
              <div className="text-center">
                <img src={otherAvatar} alt="" className="w-20 h-20 rounded-full border-2 border-gray-700 mx-auto mb-3 object-cover" />
                <p className="font-bold text-white text-base">{otherUser.name}</p>
                <p className="text-xs text-gray-500 mt-1">{otherUser.role || 'Member'}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleStartCall}
                  className="w-full flex items-center gap-3 p-3 bg-[#111] border border-gray-800 rounded-xl text-sm text-gray-300 hover:text-white hover:border-[#00c3ff]/30 transition"
                >
                  <Video className="w-4 h-4 text-[#00c3ff]" /> Start Video Call
                </button>
                <button
                  onClick={() => { setTab('docs'); fileInputRef.current?.click(); }}
                  className="w-full flex items-center gap-3 p-3 bg-[#111] border border-gray-800 rounded-xl text-sm text-gray-300 hover:text-white hover:border-emerald-500/30 transition"
                >
                  <Paperclip className="w-4 h-4 text-emerald-400" /> Share a File
                </button>
              </div>

              <div className="mt-auto">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono mb-2">Session</p>
                <div className="bg-[#111] border border-gray-800 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                  <p>{messages.length} messages</p>
                  <p>{documents.length} shared files</p>
                </div>
              </div>
            </div>

            {/* ── Messages panel ── */}
            {tab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Message list */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center mb-4">
                        <MessageSquare className="w-9 h-9 text-gray-600" />
                      </div>
                      <p className="text-white font-bold text-lg mb-1">Start your conversation</p>
                      <p className="text-gray-500 text-sm">Send a message to {otherUser.name?.split(' ')[0]}</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.senderId === currentUser.id;
                      const avatar = isMe ? myAvatar : otherAvatar;
                      const showAvatar = !isMe && (i === 0 || messages[i - 1]?.senderId !== msg.senderId);
                      const showTimestamp = i === messages.length - 1 || messages[i + 1]?.senderId !== msg.senderId;

                      return (
                        <div key={i} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div className="flex-shrink-0 w-8">
                            {showAvatar && !isMe && (
                              <img src={avatar} alt="" className="w-8 h-8 rounded-full border border-gray-700" />
                            )}
                          </div>

                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[65%]`}>
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-[#1a1a1a] border border-gray-800 text-gray-100 rounded-bl-sm'
                            }`}>
                              {msg.content}
                            </div>
                            {showTimestamp && (
                              <p className="text-[10px] text-gray-600 mt-1 px-1">{formatTime(msg.createdAt)}</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-gray-800/60 flex-shrink-0 bg-[#111]">
                  <form onSubmit={handleSend} className="flex items-center gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="flex-shrink-0 p-2.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder={`Message ${otherUser.name?.split(' ')[0]}...`}
                      className="flex-1 bg-[#0a0a0a] border border-gray-700 rounded-2xl px-5 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="flex-shrink-0 p-3 bg-blue-600 text-white rounded-xl disabled:opacity-30 hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── Documents panel ── */}
            {tab === 'docs' && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-lg">Shared Files</h3>
                    <p className="text-gray-500 text-sm">Files shared between you and {otherUser.name?.split(' ')[0]}</p>
                  </div>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition flex items-center gap-2">
                    <Paperclip className="w-4 h-4" /> Upload
                  </button>
                </div>

                {uploading && (
                  <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-400 text-sm">Uploading file...</p>
                  </div>
                )}

                {documents.length === 0 && !uploading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center mb-4">
                      <FileText className="w-9 h-9 text-gray-600" />
                    </div>
                    <p className="text-white font-bold mb-1">No shared files yet</p>
                    <p className="text-gray-500 text-sm mb-4">Upload PDFs, images, documents and more</p>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition">
                      Upload first file
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-[#111] border border-gray-800/60 rounded-2xl hover:border-gray-700 transition group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                            {getFileEmoji(doc.mime_type)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{doc.original_name}</p>
                            <p className="text-xs text-gray-500">
                              {formatSize(doc.size)} · {doc.uploader_id === currentUser.id ? 'You' : otherUser.name?.split(' ')[0]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                          <a href={`${API_URL}${doc.url}`} download={doc.original_name} target="_blank" rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition">
                            <Download className="w-4 h-4" />
                          </a>
                          {doc.uploader_id === currentUser.id && (
                            <button onClick={() => handleDeleteDoc(doc.id)}
                              className="p-2 text-gray-600 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {inCall && socket && (
        <VideoCallModal
          socket={socket}
          currentUser={currentUser}
          targetUser={otherUser}
          onClose={() => setInCall(false)}
        />
      )}
    </>
  );
}
