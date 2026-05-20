import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useRef, useState } from 'react';

export default function SkillCard({ user }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const avatar = user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`;
  const teachingSkills = user.teachingSkills || [];
  const learningSkills = user.learningSkills || [];
  const teachDisplay = teachingSkills.length > 0 ? teachingSkills.map(s => s.name).join(', ') : (user.teaches || user.teachesSummary || 'No skills listed');
  const learnDisplay = learningSkills.length > 0 ? learningSkills.map(s => s.name).join(', ') : (user.wants || user.wantsSummary || 'Open to anything');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full h-[380px] bg-gray-900/50 rounded-[2rem] p-[1px] overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1"
    >
      {/* Glow border on hover */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 195, 255, 0.5), transparent 40%)`,
        }}
      />

      <div className="relative z-10 w-full h-full bg-[#0a0a0a] rounded-[31px] flex flex-col p-8 overflow-hidden">
        {/* Inner flashlight */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`,
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border border-gray-800 object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00c3ff] transition-colors tracking-tight">{user.name}</h3>
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-0.5">{user.role || 'Member'}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-400 text-xs font-mono border border-gray-800 px-2 py-1 rounded-md bg-[#050505]">
              <Star className="w-3 h-3 mr-1 fill-current text-gray-500 group-hover:text-yellow-500 transition-colors" />
              {user.rating > 0 ? Number(user.rating).toFixed(1) : 'New'}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{user.bio}</p>
          )}

          {/* Skills */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-[10px] text-gray-600 uppercase font-mono tracking-widest mb-2">Teaches \</p>
              <div className="flex flex-wrap gap-1.5">
                {teachingSkills.slice(0, 3).map(skill => (
                  <span key={skill.id} className="text-[10px] uppercase tracking-widest font-mono text-[#00c3ff] bg-[#00c3ff]/10 border border-[#00c3ff]/20 px-2 py-1 rounded-full">
                    {skill.name}
                  </span>
                ))}
                {teachingSkills.length === 0 && (
                  <p className="text-gray-600 text-xs">{teachDisplay}</p>
                )}
                {teachingSkills.length > 3 && (
                  <span className="text-[10px] text-gray-600">+{teachingSkills.length - 3} more</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-600 uppercase font-mono tracking-widest mb-2">Wants \</p>
              <div className="flex flex-wrap gap-1.5">
                {learningSkills.slice(0, 3).map(skill => (
                  <span key={skill.id} className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                    {skill.name}
                  </span>
                ))}
                {learningSkills.length === 0 && (
                  <p className="text-gray-600 text-xs">{learnDisplay}</p>
                )}
                {learningSkills.length > 3 && (
                  <span className="text-[10px] text-gray-600">+{learningSkills.length - 3} more</span>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            to={`/profile/${user.id}`}
            className="w-full mt-5 py-3 rounded-full border border-gray-700 bg-transparent text-gray-300 hover:bg-white hover:text-black font-medium text-sm transition-all duration-300 flex items-center justify-center group/btn"
          >
            View Profile
            <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
