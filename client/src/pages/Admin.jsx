import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, Activity, ShieldBan, CheckCircle } from 'lucide-react';
import { apiRequest, clearToken } from '../api/client';
import { getCurrentUser } from '../api/authApi';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser.role !== 'ADMIN') {
          return navigate('/dashboard');
        }
        setUser(currentUser);
        
        // Fetch users
        const allUsers = await apiRequest('/api/users');
        setUsersList(allUsers);
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 text-white relative font-sans overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage platform users, reports, and analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-bold">Total Users</p>
              <p className="text-3xl font-extrabold">{usersList.length}</p>
            </div>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl"><Activity className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-bold">Active Swaps</p>
              <p className="text-3xl font-extrabold">24</p>
            </div>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-4 bg-red-500/10 text-red-400 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-bold">Open Reports</p>
              <p className="text-3xl font-extrabold">3</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800 text-sm">
                  <th className="pb-4 font-medium">User</th>
                  <th className="pb-4 font-medium">Role</th>
                  <th className="pb-4 font-medium">Joined</th>
                  <th className="pb-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {usersList.map(u => (
                  <tr key={u.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} className="w-8 h-8 rounded-full" alt=""/>
                        <div>
                          <p className="font-bold text-sm">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-medium">
                      <span className={`px-2 py-1 rounded-md text-xs ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-300'}`}>{u.role}</span>
                    </td>
                    <td className="py-4 text-sm text-gray-400">Recently</td>
                    <td className="py-4 text-right">
                      <button className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold flex items-center gap-1 inline-flex">
                        <ShieldBan className="w-3 h-3" /> Ban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
