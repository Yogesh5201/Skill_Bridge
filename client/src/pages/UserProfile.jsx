import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Code2, Clock, MessageSquare, ShieldCheck, Sparkles, Star, Terminal, Zap, Send } from 'lucide-react';
import { getToken } from '../api/client';
import { sendRequest } from '../api/requestsApi';
import { getUserById } from '../api/usersApi';

function decodeToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
}

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestError, setRequestError] = useState('');
  const [sending, setSending] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);

  const decoded = decodeToken();
  const isOwnProfile = decoded?.id === id;
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    getUserById(id).then(setUser).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const handleSendRequest = async () => {
    setRequestError('');
    if (!isLoggedIn) return setRequestError('Please log in first.');
    setSending(true);
    try {
      await sendRequest({ receiverId: user.id });
      setRequestMessage('✅ Request sent! Track it from your dashboard.');
      setAlreadySent(true);
    } catch (err) {
      setRequestError(err.message || 'Unable to send request.');
    } finally { setSending(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-400">Loading profile...</div>;

  if (!user || error) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
      <Terminal className="w-12 h-12 text-gray-600 mb-4" />
      <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
      <Link to="/explore" className="px-6 py-3 bg-white text-black font-bold rounded-full text-sm mt-4">← Back to Explore</Link>
    </div>
  );

  const avatar = user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`;
  const teachingSkills = user.teachingSkills || [];
  const learningSkills = user.learningSkills || [];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-hidden font-sans text-white">
      <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-[#00c3ff]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        <Link to="/explore" className="inline-flex items-center text-xs font-mono tracking-widest uppercase text-gray-500 hover:text-white transition mb-10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Link>

        {/* Hero card */}
        <div className="bg-[#0a0a0a] border border-gray-800/80 rounded-[2.5rem] p-8 md:p-12 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-[#00c3ff]/20 blur-xl rounded-full"></div>
              <img src={avatar} alt={user.name} className="w-32 h-32 rounded-full border border-gray-800 object-cover relative z-10 shadow-2xl" />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#00c3ff] border-[3px] border-[#0a0a0a] rounded-full z-20 shadow-[0_0_12px_rgba(0,195,255,0.8)]"></div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                    {isOwnProfile && (
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#00c3ff] bg-[#00c3ff]/10 border border-[#00c3ff]/20 px-2 py-1 rounded">Your Profile</span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-1">{user.name}</h1>
                  <p className="text-gray-400 text-lg">{user.role || 'Member'}</p>
                </div>
                <div className="flex items-center gap-2 text-yellow-500 font-bold bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl">
                  <Star className="w-4 h-4 fill-current" />
                  {user.rating > 0 ? Number(user.rating).toFixed(1) : 'New'}
                  {user.numReviews > 0 && <span className="text-xs text-gray-400 font-normal">({user.numReviews})</span>}
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-base mb-6">
                {user.bio || 'Passionate creator looking to trade skills and grow together.'}
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-500">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-600" /> Usually responds in 1hr</div>
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-gray-600" /> Skill swap member</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-xl bg-[#050505] border border-gray-800"><Code2 className="w-5 h-5 text-indigo-400" /></div>
              <div>
                <h3 className="font-bold text-white">Can Teach</h3>
                <p className="text-xs text-gray-500">Skills {user.name?.split(' ')[0]} can share</p>
              </div>
            </div>
            {teachingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teachingSkills.map(s => (
                  <span key={s.id} className="px-3 py-1.5 bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] text-sm rounded-lg font-medium">{s.name}</span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">{user.teachesSummary || 'No teaching skills listed yet.'}</p>
            )}
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-xl bg-[#050505] border border-gray-800"><Sparkles className="w-5 h-5 text-[#00c3ff]" /></div>
              <div>
                <h3 className="font-bold text-white">Wants to Learn</h3>
                <p className="text-xs text-gray-500">Skills {user.name?.split(' ')[0]} is seeking</p>
              </div>
            </div>
            {learningSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {learningSkills.map(s => (
                  <span key={s.id} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg font-medium">{s.name}</span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">{user.wantsSummary || 'No learning interests listed yet.'}</p>
            )}
          </div>
        </div>

        {/* Propose swap — hidden for own profile */}
        {!isOwnProfile && (
          <div className="bg-[#050505] border border-[#00c3ff]/20 rounded-[2.5rem] p-8 md:p-12 text-center flex flex-col items-center shadow-[0_0_40px_rgba(0,195,255,0.05)]">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to swap skills?</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Send a swap request to {user.name?.split(' ')[0]}. Once accepted, you can chat, share documents, and video call.
            </p>

            {requestError && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">{requestError}</p>}
            {requestMessage && <p className="text-emerald-400 text-sm mb-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">{requestMessage}</p>}

            {!isLoggedIn ? (
              <Link to="/login" className="px-10 py-4 bg-white text-black font-bold rounded-full text-sm hover:bg-gray-100 transition">
                Log in to send a request →
              </Link>
            ) : (
              <button
                onClick={handleSendRequest}
                disabled={sending || alreadySent}
                className="px-10 py-4 rounded-full bg-white text-black font-extrabold text-sm hover:scale-105 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
                {alreadySent ? 'Request Sent!' : sending ? 'Sending...' : 'Propose a Swap'}
              </button>
            )}
          </div>
        )}

        {isOwnProfile && (
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 text-center">
            <p className="text-gray-500 mb-4">This is your own profile. Others can send you swap requests from here.</p>
            <Link to="/dashboard" className="px-8 py-3 bg-white text-black font-bold rounded-full text-sm hover:bg-gray-100 transition inline-flex items-center gap-2">
              Go to Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
