
export interface SimulationParams {
  interactionJ: number; // Positive = Ferromagnetic, Negative = Antiferromagnetic
  externalH: number;    // External magnetic field
  temperature: number;   // Thermal noise
}

export interface SpinState {
  angle: number; // -180 to 180 degrees
}

export interface SimulationResult {
  energy: number;
  alignment: number; // 1 = fully aligned, -1 = fully anti-aligned
}
