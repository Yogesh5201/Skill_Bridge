import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { setToken } from '../api/client';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, Zap } from 'lucide-react';

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email, password });
      setToken(data.token);
      setIsLoggedIn(true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050505] overflow-hidden font-sans text-white relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 relative z-10">
        
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
          <Zap className="w-6 h-6 text-blue-500" />
          Skill<span className="text-gray-500">Bridge</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-3">Welcome back</h1>
            <p className="text-gray-400 font-medium">Log in to continue swapping skills.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 bg-[#111]/40 backdrop-blur-xl border border-gray-800/60 p-8 rounded-3xl shadow-2xl">
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-gray-800 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-gray-600"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-gray-800 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-white text-black rounded-2xl font-bold text-base hover:bg-gray-100 focus:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:bg-white flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          <p className="text-center mt-8 text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Decorative Side Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] border-l border-gray-800/50 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="relative z-10 max-w-lg p-12">
          <div className="glass-panel p-8 rounded-[2rem] border border-gray-700/50 bg-[#111]/40 backdrop-blur-md shadow-2xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Master new skills.</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              "SkillBridge totally changed how I learn. I traded my UI design knowledge for React lessons. Best investment of my time."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700"></div>
              <div>
                <p className="text-sm font-bold">Sarah Jenkins</p>
                <p className="text-xs text-gray-500">UI Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
