import { Phone, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncomingCallNotification({ caller, onAccept, onReject }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -80 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-[#111] border border-gray-700 rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-72 backdrop-blur-xl"
    >
      <div className="relative">
        <img
          src={caller.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${caller.name}`}
          className="w-14 h-14 rounded-full border-2 border-gray-600"
          alt=""
        />
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111] animate-ping"></span>
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111]"></span>
      </div>

      <div className="flex-1">
        <p className="text-white font-bold">{caller.name}</p>
        <p className="text-gray-400 text-sm">Incoming video call...</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReject}
          className="p-3 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 hover:bg-red-500/40 transition"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
        <button
          onClick={onAccept}
          className="p-3 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 hover:bg-green-500/40 transition animate-bounce"
        >
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
