import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, X, Plus, CheckCircle, Clock, MessageSquare, Calendar, Video } from 'lucide-react';
import { io } from 'socket.io-client';
import { getCurrentUser } from '../api/authApi';
import { clearToken } from '../api/client';
import { getIncomingRequests, getOutgoingRequests, updateRequestStatus } from '../api/requestsApi';
import { getSkills, createSkill } from '../api/skillsApi';
import { updateUser } from '../api/usersApi';
import { getMeetings } from '../api/meetingApi';
import ChatBox from '../components/ChatBox';
import MeetingModal from '../components/MeetingModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '' });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [selectedTeach, setSelectedTeach] = useState('');
  const [selectedLearn, setSelectedLearn] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [preselectedParticipant, setPreselectedParticipant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  // Real-time: listen for meetings scheduled by others
  useEffect(() => {
    if (!user) return;
    const socket = io(API_URL);
    socket.on('connect', () => socket.emit('join', user.id));
    socket.on('meeting_scheduled', (newMeeting) => {
      setMeetings(prev => {
        if (prev.find(m => m.id === newMeeting.id)) return prev;
        return [...prev, newMeeting];
      });
    });
    return () => socket.disconnect();
  }, [user?.id]);

  const load = async () => {
    if (!localStorage.getItem('token')) return navigate('/login');
    try {
      const me = await getCurrentUser();
      const [inc, out, skills, meets] = await Promise.all([
        getIncomingRequests(), getOutgoingRequests(), getSkills(), getMeetings()
      ]);
      setUser(me);
      setProfileForm({ name: me.name || '', bio: me.bio || '' });
      setTeachingSkills(me.teachingSkills || []);
      setLearningSkills(me.learningSkills || []);
      setIncomingRequests(inc || []);
      setOutgoingRequests(out || []);
      setAvailableSkills(skills || []);
      setMeetings(meets || []);
    } catch (err) {
      clearToken(); navigate('/login');
    } finally { setLoading(false); }
  };

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const updated = await updateUser(user.id, {
        ...profileForm,
        teachingSkillIds: teachingSkills.map(s => s.id),
        learningSkillIds: learningSkills.map(s => s.id),
      });
      setUser(updated);
      setTeachingSkills(updated.teachingSkills || []);
      setLearningSkills(updated.learningSkills || []);
      setIsEditing(false);
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const addSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      const skill = await createSkill(newSkillName.trim());
      setAvailableSkills(p => [...p.filter(s => s.id !== skill.id), skill]);
      setNewSkillName('');
    } catch (err) { alert(err.message); }
  };

  const addTeaching = () => {
    const s = availableSkills.find(x => x.id === selectedTeach);
    if (s && !teachingSkills.find(x => x.id === s.id)) setTeachingSkills(p => [...p, s]);
    setSelectedTeach('');
  };
  const addLearning = () => {
    const s = availableSkills.find(x => x.id === selectedLearn);
    if (s && !learningSkills.find(x => x.id === s.id)) setLearningSkills(p => [...p, s]);
    setSelectedLearn('');
  };

  const handleDecision = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      setIncomingRequests(p => p.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) { alert(err.message); }
  };

  const getAcceptedPartners = () => {
    const seen = new Set();
    const partners = [];
    incomingRequests.filter(r => r.status === 'ACCEPTED').forEach(r => {
      if (r.sender && !seen.has(r.senderId)) {
        seen.add(r.senderId);
        partners.push({ id: r.senderId, name: r.sender.name, avatar: r.sender.avatar });
      }
    });
    outgoingRequests.filter(r => r.status === 'ACCEPTED').forEach(r => {
      if (r.receiver && !seen.has(r.receiverId)) {
        seen.add(r.receiverId);
        partners.push({ id: r.receiverId, name: r.receiver.name, avatar: r.receiver.avatar });
      }
    });
    return partners;
  };

  const inputCls = "w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00c3ff] transition text-sm";

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 text-white font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00c3ff]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Profile header */}
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="" className="w-20 h-20 rounded-full border-2 border-gray-700 object-cover" />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-[#0a0a0a]"></span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{user?.name}</h1>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {teachingSkills.slice(0,3).map(s => (
                  <span key={s.id} className="text-[10px] bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] px-2 py-0.5 rounded-full font-mono">{s.name}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowMeetingModal(true)} className="px-5 py-2.5 border border-gray-700 text-gray-300 rounded-full text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Schedule Meeting
            </button>
            <button onClick={() => setIsEditing(p => !p)} className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition flex items-center gap-2">
              {isEditing ? <><X className="w-4 h-4" /> Close</> : <><Settings className="w-4 h-4" /> Edit Profile</>}
            </button>
          </div>
        </div>

        {/* Edit profile panel */}
        {isEditing && (
          <div className="bg-[#0a0a0a] border border-[#00c3ff]/30 rounded-3xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 text-[#00c3ff]">Edit Profile & Skills</h2>
            <form onSubmit={saveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Name</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Bio</label>
                  <input type="text" value={profileForm.bio} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))} className={inputCls} />
                </div>
              </div>

              {/* Create new skill */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Create New Skill</label>
                <div className="flex gap-2">
                  <input type="text" value={newSkillName} onChange={e => setNewSkillName(e.target.value)} placeholder="e.g. Chess, Piano..." className={`${inputCls} flex-1`} />
                  <button type="button" onClick={addSkill} className="px-4 py-3 bg-[#111] border border-gray-700 rounded-xl hover:bg-gray-800 transition">
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Teaching Skills */}
                <div>
                  <label className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3 block">Skills I Teach</label>
                  <div className="flex gap-2 mb-3">
                    <select value={selectedTeach} onChange={e => setSelectedTeach(e.target.value)} className={`${inputCls} flex-1`}>
                      <option value="">Choose a skill...</option>
                      {availableSkills.filter(s => !teachingSkills.find(t => t.id === s.id)).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={addTeaching} className="px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition">
                      <Plus className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {teachingSkills.map(s => (
                      <span key={s.id} className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-lg">
                        {s.name}
                        <button type="button" onClick={() => setTeachingSkills(p => p.filter(x => x.id !== s.id))} className="hover:text-white"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    {teachingSkills.length === 0 && <p className="text-xs text-gray-600">No teaching skills added.</p>}
                  </div>
                </div>

                {/* Learning Skills */}
                <div>
                  <label className="text-xs text-[#00c3ff] font-bold uppercase tracking-wider mb-3 block">Skills I Want to Learn</label>
                  <div className="flex gap-2 mb-3">
                    <select value={selectedLearn} onChange={e => setSelectedLearn(e.target.value)} className={`${inputCls} flex-1`}>
                      <option value="">Choose a skill...</option>
                      {availableSkills.filter(s => !learningSkills.find(l => l.id === s.id)).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={addLearning} className="px-4 py-3 bg-[#00c3ff]/20 border border-[#00c3ff]/30 rounded-xl hover:bg-[#00c3ff]/30 transition">
                      <Plus className="w-4 h-4 text-[#00c3ff]" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {learningSkills.map(s => (
                      <span key={s.id} className="inline-flex items-center gap-1.5 bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] text-xs px-3 py-1.5 rounded-lg">
                        {s.name}
                        <button type="button" onClick={() => setLearningSkills(p => p.filter(x => x.id !== s.id))} className="hover:text-white"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    {learningSkills.length === 0 && <p className="text-xs text-gray-600">No learning skills added.</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="px-8 py-3 bg-[#00c3ff] text-black font-bold rounded-xl hover:bg-[#00a3d9] transition disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Incoming', value: incomingRequests.length, color: 'text-[#00c3ff]' },
            { label: 'Outgoing', value: outgoingRequests.length, color: 'text-purple-400' },
            { label: 'Accepted', value: incomingRequests.filter(r => r.status === 'ACCEPTED').length + outgoingRequests.filter(r => r.status === 'ACCEPTED').length, color: 'text-emerald-400' },
            { label: 'Meetings', value: meetings.length, color: 'text-yellow-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 mb-6 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-1 w-fit">
          {['requests', 'meetings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-[#111] text-white border border-gray-700' : 'text-gray-500 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Incoming */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" />Incoming</h2>
                <span className="text-xs bg-[#111] border border-gray-800 px-3 py-1 rounded-full">{incomingRequests.length}</span>
              </div>
              <div className="space-y-3">
                {incomingRequests.map(req => (
                  <div key={req.id} className="p-4 bg-[#111] border border-gray-800 rounded-2xl">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <img src={req.sender?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${req.sender?.name}`} className="w-9 h-9 rounded-full bg-gray-800" alt="" />
                        <div>
                          <p className="font-bold text-sm">{req.sender?.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{req.status}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {req.status === 'PENDING' ? (
                          <>
                            <button onClick={() => handleDecision(req.id, 'ACCEPTED')} className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg">Accept</button>
                            <button onClick={() => handleDecision(req.id, 'REJECTED')} className="px-3 py-1.5 border border-gray-600 text-white text-xs font-bold rounded-lg">Decline</button>
                          </>
                        ) : (
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${req.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{req.status}</span>
                        )}
                        {req.status === 'ACCEPTED' && (
                          <>
                            <button onClick={() => setActiveChatUser({ id: req.senderId, name: req.sender?.name, avatar: req.sender?.avatar })}
                              className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> Chat
                            </button>
                            <button
                              onClick={() => { setPreselectedParticipant({ id: req.senderId, name: req.sender?.name, avatar: req.sender?.avatar }); setShowMeetingModal(true); }}
                              className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-lg flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Meet
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {incomingRequests.length === 0 && <p className="text-center text-gray-600 py-8 border border-dashed border-gray-800 rounded-2xl text-sm">No incoming requests yet.</p>}
              </div>
            </div>

            {/* Outgoing */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-[#00c3ff]" />Outgoing</h2>
                <span className="text-xs bg-[#111] border border-gray-800 px-3 py-1 rounded-full">{outgoingRequests.length}</span>
              </div>
              <div className="space-y-3">
                {outgoingRequests.map(req => (
                  <div key={req.id} className="p-4 bg-[#111] border border-gray-800 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <img src={req.receiver?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${req.receiver?.name}`} className="w-9 h-9 rounded-full bg-gray-800" alt="" />
                      <div>
                        <p className="font-bold text-sm">{req.receiver?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">You sent this</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${req.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400' : req.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{req.status}</span>
                      {req.status === 'ACCEPTED' && (
                        <>
                          <button onClick={() => setActiveChatUser({ id: req.receiverId, name: req.receiver?.name, avatar: req.receiver?.avatar })}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Chat
                          </button>
                          <button
                            onClick={() => { setPreselectedParticipant({ id: req.receiverId, name: req.receiver?.name, avatar: req.receiver?.avatar }); setShowMeetingModal(true); }}
                            className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-lg flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Meet
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {outgoingRequests.length === 0 && <p className="text-center text-gray-600 py-8 border border-dashed border-gray-800 rounded-2xl text-sm">No outgoing requests yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-yellow-400" />My Meetings</h2>
                <p className="text-gray-500 text-sm mt-1">Meetings appear for both you and the other person automatically.</p>
              </div>
              <button onClick={() => setShowMeetingModal(true)} className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-200 transition flex items-center gap-2">
                <Plus className="w-4 h-4" /> Schedule Meeting
              </button>
            </div>
            <div className="space-y-4">
              {meetings.map(m => {
                const isMine = m.organizer_id === user?.id;
                const other = isMine ? m.participant : m.organizer;
                const otherId = isMine ? m.participant_id : m.organizer_id;
                const past = new Date(m.scheduled_at) < new Date();
                const isNow = !past && Math.abs(new Date(m.scheduled_at) - new Date()) < 30 * 60 * 1000;
                return (
                  <div key={m.id} className={`p-5 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition ${
                    isNow ? 'border-[#00c3ff]/40 bg-[#00c3ff]/5' : past ? 'border-gray-800/40 opacity-55' : 'border-gray-800 hover:border-gray-700'
                  }`}>
                    <div className="flex items-center gap-4">
                      {other && (
                        <img src={other.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${other.name}`}
                          className="w-10 h-10 rounded-full border border-gray-700 flex-shrink-0" alt="" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-white">{m.title}</p>
                          {isNow && <span className="text-[10px] bg-[#00c3ff]/20 text-[#00c3ff] px-2 py-0.5 rounded-full font-bold animate-pulse">HAPPENING NOW</span>}
                          {isMine
                            ? <span className="text-[10px] bg-yellow-500/15 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20">You scheduled</span>
                            : <span className="text-[10px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">Invited by {m.organizer?.name || 'someone'}</span>
                          }
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(m.scheduled_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} · {m.duration_minutes} min
                          {other && <> · with <span className="text-gray-300">{other.name}</span></>}
                        </p>
                        {m.description && <p className="text-xs text-gray-600 mt-1">{m.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-md font-bold ${
                        m.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' :
                        m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>{m.status}</span>
                      {other && (
                        <button
                          onClick={() => setActiveChatUser({ id: otherId, name: other.name, avatar: other.avatar })}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition ${
                            isNow
                              ? 'bg-[#00c3ff]/20 text-[#00c3ff] hover:bg-[#00c3ff]/30 border border-[#00c3ff]/30'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                          }`}
                        >
                          <Video className="w-3 h-3" />
                          {isNow ? 'Join Now' : 'Open Chat'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {meetings.length === 0 && (
                <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
                  <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-white font-bold mb-1">No meetings yet</p>
                  <p className="text-gray-500 text-sm">Schedule a session with an accepted swap partner.</p>
                  <button onClick={() => { setPreselectedParticipant(null); setShowMeetingModal(true); }} className="mt-4 px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition">Schedule first meeting →</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Box */}
      {activeChatUser && user && (
        <ChatBox currentUser={user} otherUser={activeChatUser} onClose={() => setActiveChatUser(null)} />
      )}

      {/* Meeting Modal */}
      {showMeetingModal && (
        <MeetingModal
          currentUser={user}
          participants={getAcceptedPartners()}
          preselectedParticipant={preselectedParticipant}
          onClose={() => { setShowMeetingModal(false); setPreselectedParticipant(null); }}
          onCreated={(m) => { setMeetings(p => [...p, m]); }}
        />
      )}
    </div>
  );
}
