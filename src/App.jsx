// src/App.jsx
import React from 'react';
import { useMathStore } from './store/useMathStore';
import { calculateDeterminant, calculateTrace, calculateEigenvalues } from './utils/matrixOps';
import GraphViewer from './components/GraphViewer';

function App() {
  const { matrix, setMatrixCell, setMatrix } = useMathStore();

  // Real-time math operation binding
  const det = calculateDeterminant(matrix);
  const trace = calculateTrace(matrix);
  const eigenvalues = calculateEigenvalues(matrix);

  // Preset function for easy testing
  const applyPreset = (type) => {
    if (type === 'identity') setMatrix([[1, 0], [0, 1]]);
    if (type === 'symmetric') setMatrix([[2, 1], [1, 2]]);
    if (type === 'rotation') setMatrix([[0, -1], [1, 0]]); // 90-degree rotation matrix
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-2xl border border-slate-200/60">
        
        {/* Top title bar */}
        <div className="text-center mb-8">
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Step 2: State & Matrix Engine
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Math Visualization Simulator
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Mathematics — Tae-Yeon Kim — Zustand Web Storage feature in development
          </p>
        </div>

        {/* 1. Interactive matrix input grid */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md font-bold text-slate-700 flex items-center gap-2">
              <span>⚙️</span> Matrix A components input
            </h2>
            {/* Preset button group */}
            <div className="flex gap-1.5">
              <button onClick={() => applyPreset('identity')} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">Identity</button>
              <button onClick={() => applyPreset('symmetric')} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">Symmetric</button>
              <button onClick={() => applyPreset('rotation')} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">Rotation</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto relative p-2">
            {/* Bracket design wrapper for the matrix */}
            <div className="absolute top-0 bottom-0 left-0 w-2 border-t-2 border-b-2 border-l-2 border-slate-400"></div>
            <div className="absolute top-0 bottom-0 right-0 w-2 border-t-2 border-b-2 border-r-2 border-slate-400"></div>
            
            {matrix.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <div key={`${rIdx}-${cIdx}`} className="flex flex-col items-center">
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => setMatrixCell(rIdx, cIdx, e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl p-3 text-center font-mono font-bold text-slate-800 text-xl shadow-sm transition"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1">a_{rIdx+1}{cIdx+1}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Real-time algebra analysis report */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
            Real-time algebra analysis feed
          </h2>
          
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-600 text-sm">Determinant</span>
            <span className="font-mono font-bold text-indigo-600 text-base">
              det(A) = {isNaN(det) ? 'Unavailable' : det}
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-600 text-sm">Trace</span>
            <span className="font-mono font-bold text-emerald-600 text-base">
              tr(A) = {isNaN(trace) ? 'Unavailable' : trace}
            </span>
          </div>

          <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100">
            <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-wide mb-1">
              Eigenvalues
            </div>
            <div className="font-mono font-bold text-indigo-900 text-base">
              {eigenvalues}
            </div>
          </div>
        </div>

        {/* 3. Graph Visualization */}
        <div className="mt-8">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Adjacency Matrix Graph Visualization
            </h2>
            <GraphViewer />
        </div>

      </div>
    </div>
  );
}

export default App;