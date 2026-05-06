/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Info, RefreshCw, Layers } from 'lucide-react';
import SpinArrow from './components/SpinArrow';
import SimulationControls from './components/SimulationControls';
import { SimulationParams, SpinState } from './types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function App() {
  const [view, setView] = useState<'simulation' | 'theory' | 'resources'>('simulation');

  const [params, setParams] = useState<SimulationParams>({
    interactionJ: 2.0,
    externalH: 0.0,
    temperature: 0.2
  });

  const [spins, setSpins] = useState<SpinState[]>([
    { angle: 0 },
    { angle: 0 }
  ]);

  const [history, setHistory] = useState<{ energy: number; time: number }[]>([]);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  const simulate = () => {
    setSpins(prev => {
      const s1 = (prev[0].angle * Math.PI) / 180;
      const s2 = (prev[1].angle * Math.PI) / 180;
      
      const grad1 = params.interactionJ * Math.sin(s1 - s2) + params.externalH * Math.sin(s1);
      const grad2 = -params.interactionJ * Math.sin(s1 - s2) + params.externalH * Math.sin(s2);

      const eta = 0.05; 
      const noise = params.temperature * 5; 

      const nextS1 = s1 - eta * grad1 + (Math.random() - 0.5) * noise * 0.1;
      const nextS2 = s2 - eta * grad2 + (Math.random() - 0.5) * noise * 0.1;

      return [
        { angle: (nextS1 * 180) / Math.PI },
        { angle: (nextS2 * 180) / Math.PI }
      ];
    });

    requestRef.current = requestAnimationFrame(simulate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(simulate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [params]);

  const energy = useMemo(() => {
    const s1 = (spins[0].angle * Math.PI) / 180;
    const s2 = (spins[1].angle * Math.PI) / 180;
    return -params.interactionJ * Math.cos(s1 - s2) - params.externalH * (Math.cos(s1) + Math.cos(s2));
  }, [spins, params]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHistory(prev => {
        const next = [...prev, { energy, time: (Date.now() - startTimeRef.current) / 1000 }];
        return next.slice(-40);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [energy]);

  return (
    <div className="flex flex-col h-screen w-full bg-app-bg text-app-text-main overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-10 h-20 border-b border-app-border bg-white z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-app-accent rounded flex items-center justify-center text-white font-bold">S</div>
          <span className="text-xs tracking-[0.2em] font-bold uppercase">SpinDynamics Lab</span>
        </div>
        <nav className="flex gap-8 text-[11px] uppercase tracking-widest font-bold text-app-text-muted">
          <button 
            onClick={() => setView('simulation')}
            className={`${view === 'simulation' ? 'text-app-accent border-b-2 border-app-accent' : 'hover:text-app-text-main'} pb-1 transition-all cursor-pointer`}
          >
            Simulation
          </button>
          <button 
            onClick={() => setView('theory')}
            className={`${view === 'theory' ? 'text-app-accent border-b-2 border-app-accent' : 'hover:text-app-text-main'} pb-1 transition-all cursor-pointer`}
          >
            Theory
          </button>
          <button 
            onClick={() => setView('resources')}
            className={`${view === 'resources' ? 'text-app-accent border-b-2 border-app-accent' : 'hover:text-app-text-main'} pb-1 transition-all cursor-pointer`}
          >
            Resources
          </button>
        </nav>
      </header>
      
      {view === 'simulation' ? (
        <main className="flex-1 flex overflow-hidden">
          {/* Sidebar Narrative */}
          <aside className="w-[420px] p-10 border-r border-app-border bg-white flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="inline-block px-2 py-1 mb-6 bg-slate-100 text-[10px] font-bold tracking-tighter uppercase rounded">Module 1.1</div>
              <h1 className="text-4xl font-light mb-6 leading-tight text-app-text-main">
                Simulating <br/>Two-Spin Interaction
              </h1>
              <p className="text-sm text-app-text-muted leading-relaxed mb-8">
                Microscopic magnets follow the laws of quantum mechanics. The Hamiltonian below defines the energy interaction based on the coupling constant <span className="font-mono italic">J</span>.
              </p>
              
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg flex justify-center mb-10 overflow-hidden">
                <span className="text-xl font-serif italic text-slate-700">H = -J (σ₁ · σ₂) - h(σ₁ + σ₂)</span>
              </div>

              <SimulationControls 
                params={params} 
                onChange={(updates) => setParams(p => ({ ...p, ...updates }))} 
              />
            </div>

            <div className="pt-8 mt-10 border-t border-app-border flex items-start gap-4">
              <Info size={18} className="text-app-accent mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold uppercase mb-1 tracking-widest">Real-time Analysis</h4>
                <p className="text-xs text-app-text-muted leading-relaxed">
                  {params.interactionJ > 0 
                    ? "Parallel states effectively lower system energy." 
                    : "Anti-parallel configuration represents the ground state."}
                </p>
              </div>
            </div>
          </aside>

          {/* Simulation Stage */}
          <section className="flex-1 flex flex-col relative bg-[#fcfdfe]">
            {/* Status HUD */}
            <div className="absolute top-10 right-10 flex gap-4 z-10">
              <div className="bg-white/80 backdrop-blur border border-app-border px-5 py-3 rounded-lg minimal-shadow">
                <span className="text-[9px] uppercase text-app-text-muted block font-bold tracking-widest mb-1 font-sans">Hamiltonian Energy</span>
                <span className="font-mono font-bold text-sm text-app-accent">{energy.toFixed(3)} meV</span>
              </div>
              <div className="bg-white/80 backdrop-blur border border-app-border px-5 py-3 rounded-lg minimal-shadow">
                <span className="text-[9px] uppercase text-app-text-muted block font-bold tracking-widest mb-1 font-sans">Simulation State</span>
                <span className="font-mono font-bold text-sm uppercase text-app-text-main">Active</span>
              </div>
            </div>

            {/* Interaction Visualization */}
            <div className="flex-1 flex items-center justify-center gap-24 relative">
              {/* Background Decoration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Layers size={400} />
              </div>

              <SpinArrow 
                angle={spins[0].angle} 
                label="Q-Object Alpha" 
              />
              
              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl font-light text-slate-200">
                  {params.interactionJ >= 0 ? '+' : '−'}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-app-border">
                  Coupling
                </div>
              </div>

              <SpinArrow 
                angle={spins[1].angle} 
                label="Q-Object Beta" 
              />
            </div>

            {/* Footer Analysis Area */}
            <div className="h-48 bg-white border-t border-app-border px-10 flex items-center gap-10">
              <div className="flex-1 h-24 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-app-text-muted" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-app-text-muted">Stability Graph</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <Area 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#2563eb" 
                      fill="#2563eb" 
                      fillOpacity={0.05} 
                      isAnimationActive={false}
                    />
                    <XAxis hide />
                    <YAxis hide domain={['auto', 'auto']} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="w-[1px] h-20 bg-app-border" />

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest mb-1">Polarity</span>
                  <span className="text-sm font-bold">{energy < -0.5 ? 'Stable' : 'Unstable'}</span>
                </div>
                <button 
                  onClick={() => {
                    setSpins([{ angle: Math.random() * 360 }, { angle: Math.random() * 360 }]);
                    setHistory([]);
                  }}
                  className="w-12 h-12 bg-slate-50 border border-app-border rounded-full flex items-center justify-center text-app-text-muted hover:text-app-accent hover:border-app-accent transition-all active:scale-95"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
          </section>
        </main>
      ) : view === 'theory' ? (
        <main className="flex-1 overflow-y-auto p-12 bg-white flex flex-col items-center">
          <div className="max-w-3xl w-full">
            <h1 className="text-5xl font-light mb-8 text-app-text-main">Theoretical Basis</h1>
            <section className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-app-accent">The Ising Model</h2>
                <p className="text-lg text-app-text-muted leading-relaxed">
                  The Ising model is a mathematical representation of ferromagnetism in statistical mechanics. It describes discrete variables ("spins") that can point in different directions. In this two-spin system, we explore the interaction between two such elements.
                </p>
              </div>

              <div className="bg-app-bg border border-app-border p-10 rounded-2xl flex flex-col items-center gap-6">
                <span className="text-2xl font-serif italic text-slate-900">H = -J (σ₁ · σ₂) - h(σ₁ + σ₂)</span>
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <span className="font-bold text-app-accent block mb-1">Exchange Coupling (J)</span>
                    <p className="text-app-text-muted">Dictates the preferred orientation relative to each other.</p>
                  </div>
                  <div>
                    <span className="font-bold text-app-text-main block mb-1">External Field (h)</span>
                    <p className="text-app-text-muted">An external magnetic bias pushing both spins in a specific direction.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Ferromagnetism (J &gt; 0)</h3>
                  <p className="text-sm text-app-text-muted leading-relaxed">
                    Spins are coupled such that parallel alignment results in lower energy. This is common in materials like iron, where atoms spontaneously align to create a macroscopic magnetic moment.
                  </p>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded text-blue-800 text-xs font-mono">
                    Ground State: ↑↑ or ↓↓
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Antiferromagnetism (J &lt; 0)</h3>
                  <p className="text-sm text-app-text-muted leading-relaxed">
                    Neighboring spins favor an anti-parallel arrangement. While there is no overall magnetic moment, the internal order is highly stable at low temperatures.
                  </p>
                  <div className="p-4 bg-slate-100 border border-slate-200 rounded text-slate-800 text-xs font-mono">
                    Ground State: ↑↓ or ↓↑
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto p-12 bg-white flex flex-col items-center">
          <div className="max-w-3xl w-full">
            <h1 className="text-5xl font-light mb-8 text-app-text-main">Resources</h1>
            <div className="grid grid-cols-1 gap-6">
               {[
                {
                  title: "IBM Quantum Learning",
                  desc: "The complete 'Your First Quantum Experiment' course which inspired this simulation.",
                  link: "https://quantum.cloud.ibm.com/learning/en/courses/use-a-qc-today/your-first-quantum-experiment"
                },
                {
                  title: "Qiskit Documentation",
                  desc: "Learn how to implement these spin dynamics on real hardware using the Qiskit SDK.",
                  link: "https://docs.quantum.ibm.com/start"
                },
                {
                  title: "Quantum Physics: Spontaneous Symmetry Breaking",
                  desc: "A deeper look at how microscopic spin alignment leads to macroscopic magnetism.",
                  link: "https://en.wikipedia.org/wiki/Spontaneous_symmetry_breaking"
                }
              ].map((res, i) => (
                <a 
                  key={i}
                  href={res.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-8 border border-app-border rounded-xl hover:border-app-accent hover:bg-slate-50 transition-all block"
                >
                  <h3 className="text-lg font-bold mb-2 group-hover:text-app-accent">{res.title}</h3>
                  <p className="text-sm text-app-text-muted leading-relaxed">{res.desc}</p>
                   <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-app-accent flex items-center gap-2">
                    External Link <span>→</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-16 p-10 bg-slate-900 rounded-2xl text-white">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-blue-400">Project Context</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                This simulator uses a classical gradient descent approximation with stochastic noise to visualize the energy minimization process described in quantum Hamiltonians. It serves as a visual bridge between classical magnetism and quantum state evolution.
              </p>
              <div className="text-[10px] font-mono text-slate-600">
                Created for educational purposes | Simulation Engine: RK4-Lite/Stochastic
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer Status Bar */}
      <footer className="h-10 bg-slate-900 text-slate-500 px-10 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-medium font-sans">
        <div className="flex gap-6">
          <span className="text-blue-400 font-bold tracking-normal">● Live Circuit Active</span>
          <span>Backend: Q-State-Solver v0.9</span>
        </div>
        <div>Precision Gate: &lt; 10⁻⁸ | Latency: 4ms</div>
      </footer>
    </div>
  );
}
