

// File: components/BiasMeter.jsx
import React from 'react';

export default function BiasMeter({ bias = { proA: 0, proB: 0, neutral: 100 } }) {
  const total = bias.proA + bias.proB + bias.neutral || 1;
  const pA = Math.round((bias.proA / total) * 100);
  const pB = Math.round((bias.proB / total) * 100);
  const pN = 100 - pA - pB;
  return (
    <div className="mt-3">
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
        <div style={{ width: `${pA}%` }} className="bg-rose-500" title={`Pro A ${pA}%`} />
        <div style={{ width: `${pN}%` }} className="bg-amber-400" title={`Neutral ${pN}%`} />
        <div style={{ width: `${pB}%` }} className="bg-sky-600" title={`Pro B ${pB}%`} />
      </div>
      <div className="flex text-xs text-slate-500 gap-2 mt-1">
        <span>Pro A {pA}%</span>
        <span>Neutral {pN}%</span>
        <span>Pro B {pB}%</span>
      </div>
    </div>
  );
}

