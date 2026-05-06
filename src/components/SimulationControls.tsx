
import { SimulationParams } from "../types";

interface ControlsProps {
  params: SimulationParams;
  onChange: (updates: Partial<SimulationParams>) => void;
}

export default function SimulationControls({ params, onChange }: ControlsProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Interaction Strength J */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="text-[10px] font-bold uppercase text-app-text-muted tracking-widest">Coupling Constant (J)</label>
          <span className="text-xs font-mono font-bold text-app-accent">
            {params.interactionJ >= 0 ? '+' : ''}{params.interactionJ.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.1"
          value={params.interactionJ}
          onChange={(e) => onChange({ interactionJ: parseFloat(e.target.value) })}
          className="w-full h-1 bg-app-border rounded-full appearance-none cursor-pointer accent-app-accent"
        />
        <div className="flex justify-between text-[9px] font-bold text-app-text-muted uppercase tracking-tighter">
          <span>Anti-Ferro</span>
          <span>Ferro</span>
        </div>
      </div>

      {/* External Field H */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="text-[10px] font-bold uppercase text-app-text-muted tracking-widest">Magnetic Field (h)</label>
          <span className="text-xs font-mono font-bold text-app-text-main">
            {params.externalH.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.1"
          value={params.externalH}
          onChange={(e) => onChange({ externalH: parseFloat(e.target.value) })}
          className="w-full h-1 bg-app-border rounded-full appearance-none cursor-pointer accent-app-text-main"
        />
      </div>

      {/* Temperature T */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="text-[10px] font-bold uppercase text-app-text-muted tracking-widest">Thermal Fluctuations (T)</label>
          <span className="text-xs font-mono font-bold text-slate-400">
            {params.temperature.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="3"
          step="0.05"
          value={params.temperature}
          onChange={(e) => onChange({ temperature: parseFloat(e.target.value) })}
          className="w-full h-1 bg-app-border rounded-full appearance-none cursor-pointer accent-slate-400"
        />
      </div>

      {/* Action Presets */}
      <div className="pt-6 border-t border-app-border grid grid-cols-1 gap-3">
        <button
          onClick={() => onChange({ interactionJ: 2.5, externalH: 0, temperature: 0.1 })}
          className="w-full py-4 bg-app-text-main text-white text-[11px] font-bold uppercase tracking-widest hover:bg-app-accent transition-colors active:translate-y-px"
        >
          Initialize Ferromagnetic
        </button>
        <button
          onClick={() => onChange({ interactionJ: -2.5, externalH: 0, temperature: 0.1 })}
          className="w-full py-4 border-2 border-app-border text-app-text-main text-[11px] font-bold uppercase tracking-widest hover:border-app-accent hover:text-app-accent transition-colors active:translate-y-px"
        >
          Anti-Ferro Preset
        </button>
      </div>
    </div>
  );
}
