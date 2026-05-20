import { Link } from 'react-router-dom';
import { Plus, Code, Music, BookOpen, ArrowRight, MonitorSmartphone } from 'lucide-react';
import Spline from '@splinetool/react-spline'; 
import Footer from '../components/Footer'; // <-- Make sure this path points to your new file!

export default function Home() {
  return (
    <main className="w-full bg-[#050505] overflow-x-hidden font-sans text-white">
      
      {/* ================= HERO SECTION (Full Screen) ================= */}
      <section className="relative w-full h-screen">
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-auto">
          <Spline 
            scene="https://prod.spline.design/6xKGuUTY1mR7NDbP/scene.splinecode" 
            style={{ 
              width: '100%', 
              height: '100%',
              transform: 'scale(0.8) translateX(40%) translateY(-15%)', 
              transformOrigin: 'center center'
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div>

        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-8 md:p-12 lg:px-16 lg:pb-24">
          <div className="flex flex-col md:flex-row justify-between items-end w-full">
            
            <div className="w-full md:w-auto mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-white tracking-tighter leading-[1] drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                Trade what<br />
                you know.<br />
                Learn what<br />
                you want.
              </h1>
            </div>

            <div className="w-full md:w-1/3 flex flex-col items-start md:items-end md:text-right">
              <p className="text-gray-300 text-sm mb-8 max-w-[280px] md:max-w-xs leading-relaxed drop-shadow-md">
                Join a community of engineers and creators. Swap your expertise hour-for-hour. No cash, just skill.
              </p>
              
              <div className="flex flex-row items-center gap-4">
                <Link 
                  to="/explore" 
                  className="pointer-events-auto px-6 py-3 rounded-full border border-gray-600 text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm text-sm font-medium"
                >
                  Explore Skills
                </Link>
                
                <Link 
                  to="/login" 
                  className="pointer-events-auto pl-6 pr-2 py-2 rounded-full border border-gray-600 text-white hover:border-gray-400 transition-all flex items-center gap-4 backdrop-blur-sm text-sm font-medium group bg-black/20"
                >
                  <span>Get Started</span>
                  <div className="bg-[#00c3ff] text-black rounded-full p-2 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,195,255,0.4)]">
                    <Plus className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= BENTO BOX "HOW IT WORKS" SECTION ================= */}
      <section className="relative z-30 w-full px-6 md:px-12 lg:px-16 py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tighter text-white">
            Built for seamless <span className="text-gray-500">collaboration.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            
            <div className="md:col-span-2 relative bg-[#0a0a0a] border border-gray-800/80 rounded-[2rem] p-10 overflow-hidden group cursor-pointer hover:border-gray-700 transition-colors">
              <div className="relative z-10 w-2/3">
                <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">List Your Stack</h3>
                <p className="text-gray-400 text-base leading-relaxed max-w-sm">
                  A shared canvas for what you know and what you want to learn. Build your skill portfolio.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-96 h-96 pointer-events-none">
                <div className="absolute right-20 bottom-10 w-48 h-64 bg-black border border-blue-500/40 rounded-2xl rotate-12 shadow-[0_0_40px_rgba(59,130,246,0.15)] group-hover:rotate-6 group-hover:-translate-y-2 transition-all duration-700 ease-out flex items-start p-4">
                  <span className="text-blue-500 text-xs font-mono">React.js</span>
                </div>
                <div className="absolute right-4 bottom-0 w-48 h-64 bg-black border border-emerald-500/40 rounded-2xl rotate-[25deg] shadow-[0_0_40px_rgba(16,185,129,0.15)] group-hover:rotate-[20deg] group-hover:-translate-y-4 transition-all duration-700 ease-out flex items-start p-4">
                  <span className="text-emerald-500 text-xs font-mono">Figma</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 relative bg-[#0a0a0a] border border-gray-800/80 rounded-[2rem] p-10 overflow-hidden group cursor-pointer hover:border-gray-700 transition-colors">
              <div className="relative z-10">
                <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Smart Matching</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Flexible algorithms connect complex needs instantly.
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end justify-center pointer-events-none">
                <div className="absolute bottom-[-50px] w-48 h-48 border border-gray-700 rounded-full group-hover:border-gray-500 transition-colors duration-700"></div>
                <div className="absolute top-10 left-12 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)] group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute top-4 right-16 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <svg className="absolute top-5 left-12 w-32 h-10" overflow="visible">
                  <line x1="0" y1="20" x2="100" y2="0" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                </svg>
                <div className="absolute top-[28px] left-[70px] w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] z-10 group-hover:scale-125 transition-transform duration-500"></div>
              </div>
            </div>

            <div className="md:col-span-1 relative bg-[#0a0a0a] border border-gray-800/80 rounded-[2rem] p-10 overflow-hidden group cursor-pointer hover:border-gray-700 transition-colors">
              <div className="relative z-10">
                <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Zero Cash</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Hour-for-hour trades, perfectly balanced.
                </p>
              </div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#00c3ff]/30 rounded-full blur-[50px] group-hover:bg-[#00c3ff]/50 transition-colors duration-700 pointer-events-none"></div>
              <div className="absolute bottom-0 -right-10 w-40 h-40 border border-emerald-500/30 rounded-full group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
              <div className="absolute bottom-10 -right-10 w-32 h-32 border border-emerald-500/20 rounded-full pointer-events-none"></div>
            </div>

            <div className="md:col-span-2 relative bg-[#0a0a0a] border border-gray-800/80 rounded-[2rem] p-10 overflow-hidden group cursor-pointer hover:border-gray-700 transition-colors">
              <div className="relative z-10 w-1/2">
                <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Live Interaction</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Video sessions and chat that react in real time.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-2/3 h-full flex items-center justify-center pointer-events-none">
                <div className="absolute bottom-12 left-10 px-8 py-4 bg-[#111] border border-gray-800 rounded-2xl text-gray-600 font-medium text-sm translate-y-4 opacity-50">Chat</div>
                <div className="absolute top-16 left-40 px-8 py-4 bg-[#111] border border-gray-700 rounded-2xl shadow-xl z-20 text-[#00c3ff] font-medium text-sm group-hover:-translate-y-2 transition-transform duration-700 ease-out backdrop-blur-md">Join Call</div>
                <div className="absolute bottom-16 right-16 px-8 py-4 bg-[#050505] border border-emerald-900/50 rounded-2xl shadow-[0_0_30px_rgba(20,83,45,0.4)] z-30 text-emerald-400 font-medium text-sm group-hover:translate-y-[-10px] transition-transform duration-700 ease-out delay-75">Share Screen</div>
                <div className="absolute top-24 right-8 px-6 py-3 bg-black border border-gray-800 rounded-xl z-10 text-gray-400 font-medium text-xs group-hover:translate-x-2 transition-transform duration-700 ease-out">Recording...</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE CATEGORIES SECTION ================= */}
      <section className="relative z-30 w-full px-6 md:px-12 lg:px-16 py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
              Trending <span className="text-gray-500">Categories</span>
            </h2>
            <Link to="/explore" className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-2">
              Explore Library <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-gray-800/80 hover:-translate-y-2 hover:border-[#00c3ff]/50 transition-all duration-500 overflow-hidden group cursor-pointer flex flex-col h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00c3ff]/0 to-[#00c3ff]/0 group-hover:from-[#00c3ff]/10 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#00c3ff]/40 transition-all duration-500 shadow-lg">
                  <Code className="w-7 h-7 text-gray-500 group-hover:text-[#00c3ff] transition-colors" />
                </div>
                <h4 className="font-bold text-2xl text-white mb-2 tracking-tight">Web & AI Dev</h4>
                <p className="text-sm text-gray-500 mb-6 font-medium">2.4k Swaps</p>
                <div className="flex flex-wrap gap-2 mt-auto translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#00c3ff] bg-[#00c3ff]/10 border border-[#00c3ff]/20 px-3 py-1.5 rounded-full">React</span>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#00c3ff] bg-[#00c3ff]/10 border border-[#00c3ff]/20 px-3 py-1.5 rounded-full">AI Integration</span>
                </div>
              </div>
            </div>

            <div className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-gray-800/80 hover:-translate-y-2 hover:border-emerald-500/50 transition-all duration-500 overflow-hidden group cursor-pointer flex flex-col h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/40 transition-all duration-500 shadow-lg">
                  <BookOpen className="w-7 h-7 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h4 className="font-bold text-2xl text-white mb-2 tracking-tight">DSA & Logic</h4>
                <p className="text-sm text-gray-500 mb-6 font-medium">1.8k Swaps</p>
                <div className="flex flex-wrap gap-2 mt-auto translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">Algorithms</span>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">Data Structures</span>
                </div>
              </div>
            </div>

            <div className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-gray-800/80 hover:-translate-y-2 hover:border-purple-500/50 transition-all duration-500 overflow-hidden group cursor-pointer flex flex-col h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-500 shadow-lg">
                  <Music className="w-7 h-7 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <h4 className="font-bold text-2xl text-white mb-2 tracking-tight">Audio & Music</h4>
                <p className="text-sm text-gray-500 mb-6 font-medium">950 Swaps</p>
                <div className="flex flex-wrap gap-2 mt-auto translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">Songwriting</span>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">Mixing</span>
                </div>
              </div>
            </div>

            <div className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-gray-800/80 hover:-translate-y-2 hover:border-pink-500/50 transition-all duration-500 overflow-hidden group cursor-pointer flex flex-col h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/10 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-pink-500/40 transition-all duration-500 shadow-lg">
                  <MonitorSmartphone className="w-7 h-7 text-gray-500 group-hover:text-pink-400 transition-colors" />
                </div>
                <h4 className="font-bold text-2xl text-white mb-2 tracking-tight">UI & 3D Design</h4>
                <p className="text-sm text-gray-500 mb-6 font-medium">3.1k Swaps</p>
                <div className="flex flex-wrap gap-2 mt-auto translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">Spline 3D</span>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">Figma</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= MODULAR FOOTER ================= */}
      <Footer />

    </main>
  );
}