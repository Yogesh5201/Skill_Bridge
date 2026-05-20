import { Mail, MessageSquare, Send, Sparkles, Globe, Terminal } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-hidden font-sans text-white">
      
      {/* Deep Background Glows for Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00c3ff]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 text-xs font-mono text-gray-400 tracking-widest uppercase mb-8 bg-[#111]/50 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#00c3ff]" /> Get in Touch
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[0.9] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Let's build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-[#00c3ff]">together.</span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-xl leading-relaxed font-medium">
            Have a question about the platform, want to report an issue, or just want to say hi? Drop the team a message below.
          </p>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Info & Bento Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Discord/Community Card */}
            <div className="relative bg-[#0a0a0a] border border-gray-800/80 rounded-[2rem] p-8 overflow-hidden group hover:border-[#00c3ff]/40 transition-colors duration-500 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00c3ff]/5 blur-[50px] group-hover:bg-[#00c3ff]/20 transition-colors duration-700"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                  <MessageSquare className="w-6 h-6 text-[#00c3ff]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Join the Community</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Get instant answers, network with other creators, and find swap partners in real-time on our Discord server.
                </p>
                <div className="inline-flex items-center text-sm font-bold text-white group-hover:text-[#00c3ff] transition-colors">
                  Open Discord <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* System Status Card */}
            <div className="relative bg-[#0a0a0a] border border-gray-800/80 rounded-[2rem] p-8 overflow-hidden group hover:border-emerald-500/40 transition-colors duration-500">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#111] border border-gray-800 flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-emerald-400" />
                    </div>
                    {/* Pulsing Status Dot */}
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">Systems Normal</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Developer API</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Building something cool? Check out our developer documentation and API endpoints.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Reach Mini-Card */}
            <div className="relative bg-[#0a0a0a] border border-gray-800/80 rounded-[2rem] p-6 flex items-center gap-4 group">
              <div className="p-3 rounded-full bg-[#111] border border-gray-800 group-hover:rotate-180 transition-transform duration-700 ease-in-out">
                <Globe className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Global Support</p>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-0.5">24/7 Response time</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: The Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0a0a0a] border border-gray-800/80 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
              
              {/* Subtle inner glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

              <form className="relative z-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-mono uppercase tracking-widest text-gray-500 group-focus-within:text-[#00c3ff] transition-colors ml-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#050505] border border-gray-800/80 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-[#00c3ff] focus:border-[#00c3ff] outline-none transition-all shadow-inner" 
                      placeholder="John" 
                    />
                  </div>
                  {/* Email */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-mono uppercase tracking-widest text-gray-500 group-focus-within:text-[#00c3ff] transition-colors ml-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-[#050505] border border-gray-800/80 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-[#00c3ff] focus:border-[#00c3ff] outline-none transition-all shadow-inner" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2 group">
                  <label className="text-xs font-mono uppercase tracking-widest text-gray-500 group-focus-within:text-[#00c3ff] transition-colors ml-2">Subject</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#050505] border border-gray-800/80 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-[#00c3ff] focus:border-[#00c3ff] outline-none transition-all shadow-inner" 
                    placeholder="How can we help?" 
                  />
                </div>

                {/* Message */}
                <div className="space-y-2 group">
                  <label className="text-xs font-mono uppercase tracking-widest text-gray-500 group-focus-within:text-[#00c3ff] transition-colors ml-2">Message</label>
                  <textarea 
                    rows="6" 
                    className="w-full bg-[#050505] border border-gray-800/80 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:ring-1 focus:ring-[#00c3ff] focus:border-[#00c3ff] outline-none resize-none transition-all shadow-inner" 
                    placeholder="Type your message here..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold py-4 px-10 rounded-full transition-all flex items-center justify-center group/btn shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <Mail className="w-5 h-5 mr-2 opacity-70 group-hover/btn:opacity-100 transition-opacity" /> 
                    Send Message
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}