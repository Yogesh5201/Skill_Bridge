import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, Search } from 'lucide-react';
import { createMeeting } from '../api/meetingApi';
import { apiRequest } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeetingModal({ currentUser, participants: propParticipants, preselectedParticipant, onClose, onCreated }) {
  const [fetchedParticipants, setFetchedParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    durationMinutes: 60,
    participantId: preselectedParticipant?.id || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically compute participants directly from props (deduplicating by id) 
  // or fall back to fetched ones. This avoids state desync.
  const rawParticipants = (propParticipants && propParticipants.length > 0) ? propParticipants : fetchedParticipants;
  const displayParticipants = Object.values(
    rawParticipants.reduce((acc, p) => {
      if (p?.id && !acc[p.id]) acc[p.id] = p;
      return acc;
    }, {})
  );

  useEffect(() => {
    // Only fetch if nothing was passed
    if (!propParticipants || propParticipants.length === 0) {
      fetchAcceptedPartners();
    }
  }, [propParticipants]);

  const fetchAcceptedPartners = async () => {
    setLoadingParticipants(true);
    try {
      const data = await apiRequest('/api/requests');
      const seen = new Set();
      const partners = [];
      (data.received || []).filter(r => r.status === 'ACCEPTED').forEach(r => {
        if (r.sender && !seen.has(r.senderId)) {
          seen.add(r.senderId);
          partners.push({ id: r.senderId, name: r.sender.name, avatar: r.sender.avatar });
        }
      });
      (data.sent || []).filter(r => r.status === 'ACCEPTED').forEach(r => {
        if (r.receiver && !seen.has(r.receiverId)) {
          seen.add(r.receiverId);
          partners.push({ id: r.receiverId, name: r.receiver.name, avatar: r.receiver.avatar });
        }
      });
      setFetchedParticipants(partners);
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.scheduledAt || !form.participantId)
      return setError('Please fill in all required fields including the participant.');

    setLoading(true);
    setError('');

    try {
      const meeting = await createMeeting({
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationMinutes: parseInt(form.durationMinutes),
      });
      onCreated?.(meeting);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const selectedParticipant = displayParticipants.find(p => p.id === form.participantId);
  const filteredParticipants = displayParticipants.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputClass = "w-full bg-[#0d0d0d] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff]/20 transition text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-lg bg-[#111] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-800/60">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00c3ff]" />
              Schedule Meeting
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">Book a session with your swap partner</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Participant Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3" /> Schedule With *
            </label>

            {loadingParticipants ? (
              <div className="flex items-center gap-3 p-3 bg-[#0d0d0d] border border-gray-800 rounded-xl">
                <div className="w-4 h-4 border-2 border-[#00c3ff] border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm">Loading your swap partners...</span>
              </div>
            ) : displayParticipants.length === 0 ? (
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
                ⚠️ No accepted swap partners found. Accept a swap request first before scheduling a meeting.
              </div>
            ) : (
              <div className="space-y-2">
                {/* Search */}
                {displayParticipants.length > 4 && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search partner..."
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                )}

                {/* Partner Cards */}
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                  {filteredParticipants.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, participantId: f.participantId === p.id ? '' : p.id }))}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition text-left w-full ${
                        form.participantId === p.id
                          ? 'border-[#00c3ff]/50 bg-[#00c3ff]/8 ring-1 ring-[#00c3ff]/20'
                          : 'border-gray-800 hover:border-gray-600 bg-[#0d0d0d]'
                      }`}
                    >
                      <img
                        src={p.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`}
                        alt={p.name}
                        className="w-9 h-9 rounded-full border border-gray-700 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">Swap Partner</p>
                      </div>
                      {form.participantId === p.id && (
                        <span className="w-2 h-2 bg-[#00c3ff] rounded-full flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {filteredParticipants.length === 0 && searchQuery && (
                  <p className="text-center text-gray-600 text-sm py-2">No partner found matching "{searchQuery}"</p>
                )}
              </div>
            )}
          </div>

          {/* Meeting Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Meeting Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder={selectedParticipant ? `e.g. React Session with ${selectedParticipant.name}` : 'e.g. React Fundamentals Session'}
              className={inputClass}
              required
            />
          </div>

          {/* Date & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> Date & Time *
              </label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                className={inputClass}
                min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</label>
              <select value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: e.target.value })} className={inputClass}>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows="2"
              placeholder="What will you cover in this session?"
              className={inputClass}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3" /> Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows="2"
              placeholder="Prerequisites, resources, agenda..."
              className={inputClass}
            />
          </div>

          {/* Summary box */}
          {selectedParticipant && form.scheduledAt && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-[#00c3ff]/5 border border-[#00c3ff]/20 rounded-xl"
            >
              <p className="text-xs text-[#00c3ff] font-semibold mb-1">📋 Meeting Summary</p>
              <p className="text-xs text-gray-300">
                With <span className="text-white font-semibold">{selectedParticipant.name}</span>
                {' '}on{' '}
                <span className="text-white font-semibold">
                  {new Date(form.scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
                {' '}· <span className="text-white">{form.durationMinutes} min</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                This meeting will also appear in <span className="text-gray-300">{selectedParticipant.name}'s</span> dashboard.
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-transparent border border-gray-700 text-white rounded-xl hover:bg-gray-800 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || displayParticipants.length === 0}
              className="flex-1 py-3 bg-[#00c3ff] text-black font-bold rounded-xl hover:bg-[#00a3d9] transition text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Schedule Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
