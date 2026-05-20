import { Target, Shield, Zap, ArrowLeft, Globe, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans py-24 px-6 md:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        
        {/* ================= HERO SECTION ================= */}
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            About Skill Bridge
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Discover the story behind the premier unified platform designed to connect diverse creative and technical minds.
          </p>

          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-8 flex flex-col justify-center items-center hover:border-gray-600 transition-colors">
              <span className="text-3xl font-bold text-indigo-400 mb-2">10K+</span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-mono">Active Creators</span>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-8 flex flex-col justify-center items-center hover:border-gray-600 transition-colors">
              <span className="text-3xl font-bold text-[#00c3ff] mb-2">50K+</span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-mono">Hours Swapped</span>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-8 flex flex-col justify-center items-center hover:border-gray-600 transition-colors">
              <span className="text-3xl font-bold text-emerald-400 mb-2">100+</span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-mono">Skills Available</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link to="/explore" className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/20 px-6 py-2.5 rounded-md font-semibold text-xs tracking-wide uppercase transition-colors flex items-center gap-2">
              <Globe className="w-4 h-4" /> Explore Platform
            </Link>
            <Link to="/contact" className="bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 px-6 py-2.5 rounded-md font-semibold text-xs tracking-wide uppercase transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" /> Get in Touch
            </Link>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-16"></div>

        {/* ================= OUR STORY SECTION ================= */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-16">Our Story</h2>
          
          <div className="flex items-center gap-4 mb-8">
            {/* Colored left border accent matching the reference image */}
            <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-200">Bridging the Gap Between Logic & Creation</h3>
          </div>

          {/* STACKED TEXT CARDS */}
          <div className="space-y-4">
            <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-6 md:p-8">
              <p className="text-gray-400 leading-relaxed text-sm">
                Skill Bridge was established with a singular vision: to create the world's most accessible and trusted platform for knowledge exchange. What began as a niche idea for developers and designers has grown into a global marketplace for creative and technical minds.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-6 md:p-8">
              <p className="text-gray-400 leading-relaxed text-sm">
                We believe in the power of connection — bringing together passionate creators with diverse skill sets. Our platform combines cutting-edge matching algorithms with a simple time-trading system to create an unparalleled experience for both teachers and learners.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-6 md:p-8">
              <p className="text-gray-400 leading-relaxed text-sm">
                Over the months, we've facilitated the exchange of thousands of hours of expertise, from complex React architecture to advanced audio mixing. Each session is carefully reviewed by the community to maintain the highest standards of quality and trust.
              </p>
            </div>
          </div>

          {/* BACK BUTTON */}
          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-2 bg-[#00c3ff]/10 text-[#00c3ff] border border-[#00c3ff]/30 hover:bg-[#00c3ff]/20 px-5 py-2.5 rounded-md font-semibold text-xs tracking-wide uppercase transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>

        {/* ================= VALUES / BOTTOM CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-10 flex flex-col items-center text-center">
            <Target className="w-10 h-10 text-indigo-400 mb-6" strokeWidth={1.5} />
            <h4 className="text-lg font-bold text-gray-200 mb-3">Skill Exchange</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              We carefully curate our matching system to feature only the most dedicated creators willing to trade their time.
            </p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-10 flex flex-col items-center text-center">
            <Shield className="w-10 h-10 text-emerald-400 mb-6" strokeWidth={1.5} />
            <h4 className="text-lg font-bold text-gray-200 mb-3">Peer Verified</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every user undergoes verification and peer review to ensure high-quality, authentic learning environments.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-10 flex flex-col items-center text-center">
            <Zap className="w-10 h-10 text-[#00c3ff] mb-6" strokeWidth={1.5} />
            <h4 className="text-lg font-bold text-gray-200 mb-3">Zero Friction</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our platform connects minds from around the world, creating a seamless space to chat, call, and learn.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}