
import { motion } from "motion/react";

interface SpinArrowProps {
  angle: number;
  label: string;
  color?: string; // Optional, defaulting to theme blue
}

export default function SpinArrow({ angle, label }: SpinArrowProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex items-center justify-center w-32 h-52 bg-white border-2 border-app-accent rounded-2xl heavy-shadow overflow-hidden">
        {/* Magnet Rod */}
        <motion.div
           animate={{ rotate: angle }}
           transition={{ type: "spring", stiffness: 80, damping: 20 }}
           className="w-1.5 h-36 bg-app-accent relative flex items-center justify-center rounded-full"
        >
          {/* Arrow Head (North) */}
          <div className="absolute top-0 w-5 h-5 bg-app-accent rotate-45 border-l-2 border-t-2 border-white -translate-y-2 rounded-sm"></div>
          
          {/* Polar Indicators */}
          <div className="absolute -top-10 text-[10px] font-bold text-app-accent tracking-widest">N</div>
          <div className="absolute -bottom-10 text-[10px] font-bold text-app-text-muted tracking-widest">S</div>
        </motion.div>
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-app-text-muted">
        {label}
      </span>
    </div>
  );
}
