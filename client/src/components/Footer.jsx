import { Link } from 'react-router-dom';
import { ArrowRight, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full px-6 md:px-12 lg:px-16 pt-32 pb-12 bg-[#050505] border-t border-gray-900/50 overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#00c3ff]/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Massive Call To Action */}
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-[#00c3ff]">bridge</span> the gap?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl">
            Join thousands of engineers, designers, and creators trading their time. No wallet required.
          </p>
          <Link 
            to="/login" 
            className="px-8 py-4 rounded-full bg-white text-black hover:bg-gray-200 transition-all font-bold text-lg flex items-center group shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105"
          >
            Start Swapping Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer Bottom / Links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800/50 text-sm">
          
          <div className="flex items-center gap-2 text-gray-400 mb-6 md:mb-0">
             
             <span className="font-semibold text-white tracking-tight text-base">Skill Bridge</span>
             <span className="ml-2">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 md:gap-8 text-gray-500 font-medium">
            <Link to="#" className="hover:text-white transition-colors">Discord</Link>
            <Link to="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          
        </div>
      </div>
    </footer>
  );
}