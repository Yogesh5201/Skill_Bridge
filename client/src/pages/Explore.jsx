import { useEffect, useState } from 'react';
import { Search, UserX, Code2, Palette, Music, Globe, Compass } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import { searchUsersBySkill } from '../api/searchApi';

const QUICK_FILTERS = [
  { label: 'React', icon: Code2 },
  { label: 'UI/UX Design', icon: Palette },
  { label: 'Python', icon: Code2 },
  { label: 'Machine Learning', icon: Globe },
  { label: 'Figma', icon: Palette },
  { label: 'Node.js', icon: Code2 },
  { label: 'Video Editing', icon: Music },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Auto-load ALL users on mount
  useEffect(() => {
    fetchUsers('');
  }, []);

  const fetchUsers = async (query) => {
    setLoading(true);
    setError('');
    try {
      const data = await searchUsersBySkill(query);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchUsers(searchQuery);
  };

  const handleQuickFilter = (tag) => {
    setSearchQuery(tag);
    fetchUsers(tag);
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-hidden font-sans text-white">

      {/* Background decorations */}
      <Compass className="absolute top-[15%] right-[8%] w-64 h-64 text-gray-800/20 pointer-events-none z-0" />
      <Globe className="absolute top-[50%] left-[3%] w-40 h-40 text-[#00c3ff]/8 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00c3ff]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-3">
            Find your <span className="text-[#00c3ff]">match</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Discover {users.length > 0 ? users.length : 'hundreds of'} talented people ready to swap skills with you.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search by skill — e.g. React, Python, Figma..."
              className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-gray-800 rounded-2xl text-white placeholder-gray-500 outline-none focus:border-[#00c3ff] transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-4 bg-[#00c3ff] text-black font-bold rounded-2xl hover:bg-[#00a3d9] transition-all flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); fetchUsers(''); }}
              className="px-4 py-4 border border-gray-700 text-gray-400 font-medium rounded-2xl hover:bg-gray-800 transition text-sm"
            >
              Clear
            </button>
          )}
        </form>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="text-xs text-gray-600 uppercase font-mono tracking-wider self-center mr-2">Quick:</span>
          {QUICK_FILTERS.map(({ label }) => (
            <button
              key={label}
              onClick={() => handleQuickFilter(label)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                searchQuery === label
                  ? 'border-[#00c3ff] bg-[#00c3ff]/10 text-[#00c3ff]'
                  : 'border-gray-800 bg-[#0a0a0a] text-gray-400 hover:border-gray-600 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && !error && (
          <div className="mb-6 text-sm text-gray-500">
            {searchQuery ? (
              <span>Showing <strong className="text-white">{users.length}</strong> users for "<strong className="text-[#00c3ff]">{searchQuery}</strong>"</span>
            ) : (
              <span>Showing all <strong className="text-white">{users.length}</strong> users</span>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[380px] bg-[#0a0a0a] border border-gray-800/50 rounded-[2rem] animate-pulse">
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-800 rounded"></div>
                      <div className="w-20 h-3 bg-gray-800 rounded"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-2">{error}</p>
            <button onClick={() => fetchUsers('')} className="text-sm text-gray-500 hover:text-white underline">Try again</button>
          </div>
        )}

        {/* Results grid */}
        {!loading && !error && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <SkillCard key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && !error && users.length === 0 && (
          <div className="text-center py-24 flex flex-col items-center">
            <UserX className="w-16 h-16 text-gray-700 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No users found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? `No one listed "${searchQuery}" as a skill yet.` : 'Be the first to join Skill Bridge!'}
            </p>
            <button onClick={() => { setSearchQuery(''); fetchUsers(''); }} className="px-6 py-3 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-gray-500 transition text-sm">
              Show all users
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
