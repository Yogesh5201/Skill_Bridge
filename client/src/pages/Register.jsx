import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { setToken } from '../api/client';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Zap } from 'lucide-react';

export default function Register({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const data = await register({
        name: username,
        email,
        password
      });

      setToken(data.token);
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050505] overflow-hidden font-sans text-white relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* Decorative Side Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] border-r border-gray-800/50 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 to-blue-600/10"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="relative z-10 max-w-lg p-12">
          <div className="flex flex-col items-start gap-8">
            <div className="p-4 bg-[#111]/60 border border-gray-700/50 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4 animate-float">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">JD</div>
              <div>
                <p className="text-sm font-bold text-white">Learned Python</p>
                <p className="text-xs text-gray-400">in exchange for UI Design</p>
              </div>
            </div>
            
            <div className="p-4 bg-[#111]/60 border border-gray-700/50 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4 animate-float ml-12" style={{ animationDelay: '1s' }}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">AK</div>
              <div>
                <p className="text-sm font-bold text-white">Taught React</p>
                <p className="text-xs text-gray-400">and learned Marketing</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-4xl font-extrabold tracking-tighter mb-4 text-white">Join the community.</h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                Connect with thousands of professionals worldwide trading knowledge without spending a dime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 relative z-10">
        
        <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
          <Zap className="w-6 h-6 text-emerald-500" />
          Skill<span className="text-gray-500">Bridge</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-3">Create account</h1>
            <p className="text-gray-400 font-medium">Your learning journey starts here.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 bg-[#111]/40 backdrop-blur-xl border border-gray-800/60 p-8 rounded-3xl shadow-2xl">
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600 text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600 text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-white text-black rounded-2xl font-bold text-base hover:bg-gray-100 focus:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:bg-white flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="animate-pulse">Creating...</span>
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          <p className="text-center mt-8 text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:underline">
              Log in instead
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
}
