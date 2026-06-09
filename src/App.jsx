// src/App.jsx
import React from 'react';
import { useMathStore } from './store/useMathStore';
import { calculateDeterminant, calculateTrace, calculateEigenvalues, calculateLargestEigenvalue } from './utils/matrixOps';
import GraphViewer from './components/GraphViewer';
import { listExamples, saveExample, deleteExample } from './supabase/matrixExamples';

function App() {
  const { matrix, setMatrixCell, setMatrix } = useMathStore();
  const [sizeInput, setSizeInput] = React.useState((matrix && matrix.length) || 2);

  const createZeroMatrix = (n) => Array.from({ length: n }, () => Array.from({ length: n }, () => 0));

  const applySize = () => {
    const n = Math.max(1, parseInt(sizeInput, 10) || 0);
    setMatrix(createZeroMatrix(n));
    // keep local size input in sync with actual matrix size
    setSizeInput(n);
  };
  // Real-time math operation binding
  const det = calculateDeterminant(matrix);
  const trace = calculateTrace(matrix);
  const eigenvalues = calculateEigenvalues(matrix);
  const largestEigen = calculateLargestEigenvalue(matrix);

  // Preset function for easy testing
  const applyPreset = (type) => {
    const n = (matrix && matrix.length) || 2;
    const createZeroMatrix = (m) => Array.from({ length: m }, () => Array.from({ length: m }, () => 0));

    if (type === 'identity') {
      const id = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
      );
      setMatrix(id);
      return;
    }

    if (type === 'symmetric') {
      const newMatrix = (matrix && Array.isArray(matrix)) ? matrix.map((r) => r.slice()) : createZeroMatrix(n);
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const val = Number(newMatrix[i] && newMatrix[i][j]) || 0;
          newMatrix[j][i] = val;
        }
      }
      setMatrix(newMatrix);
      return;
    }
    if (type === 'random') {
      const rnd = Array.from({ length: n }, () => Array.from({ length: n }, () => Math.floor(Math.random() * 11)));
      setMatrix(rnd);
      return;
    }
  };

  // Supabase examples
  const [examples, setExamples] = React.useState([]);
  const [exampleName, setExampleName] = React.useState('');
  const [exampleType, setExampleType] = React.useState('custom');
  const [selectedExampleId, setSelectedExampleId] = React.useState('');

  const refreshExamples = async () => {
    const res = await listExamples();
    if (res && res.data) setExamples(res.data);
  };

  React.useEffect(() => {
    refreshExamples();
  }, []);

  const handleSaveExample = async () => {
    if (!exampleName) return alert('Enter a name');
    const res = await saveExample({ name: exampleName, type: exampleType, matrix });
    if (res && res.error) {
      const message = res.error.message || res.error || 'Unknown error';
      return alert('Save failed: ' + message);
    }
    setExampleName('');
    refreshExamples();
  };

  const handleLoadExample = async () => {
    if (!selectedExampleId) return alert('Select an example');
    const ex = examples.find((e) => e.id === selectedExampleId);
    if (!ex) return alert('Example not found');
    if (!ex.matrix) return alert('Example has no matrix');
    setMatrix(ex.matrix);
  };

  const handleDeleteExample = async () => {
    if (!selectedExampleId) return alert('Select an example');
    const ok = confirm('Delete selected example?');
    if (!ok) return;
    const res = await deleteExample(selectedExampleId);
    if (res && res.error) return alert('Delete failed: ' + res.error.message);
    setSelectedExampleId('');
    refreshExamples();
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
            {/* Preset button group + matrix size input (stacked layout) */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  className="w-20 text-sm bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                  placeholder="n"
                />
                <button onClick={applySize} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">
                  Apply size
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => applyPreset('identity')} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">Identity</button>
                <button onClick={() => applyPreset('symmetric')} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">Symmetric</button>
                <button onClick={() => applyPreset('random')} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">Random</button>
              </div>
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-2">
                <input value={exampleName} onChange={(e) => setExampleName(e.target.value)} placeholder="Example name" className="flex-1 text-sm bg-white border border-slate-200 rounded px-2 py-1" />
                <select value={exampleType} onChange={(e) => setExampleType(e.target.value)} className="text-sm bg-white border border-slate-200 rounded px-2 py-1">
                  <option value="custom">custom</option>
                  <option value="identity">identity</option>
                  <option value="symmetric">symmetric</option>
                  <option value="random">random</option>
                </select>
                <button onClick={handleSaveExample} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">Save</button>
              </div>

              <div className="w-full flex items-center gap-2 mt-2">
                <select value={selectedExampleId} onChange={(e) => setSelectedExampleId(e.target.value)} className="flex-1 text-sm bg-white border border-slate-200 rounded px-2 py-1">
                  <option value="">-- Load saved example --</option>
                  {examples.map((ex) => (
                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.type})</option>
                  ))}
                </select>
                <button onClick={handleLoadExample} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium">Load</button>
                <button onClick={handleDeleteExample} className="text-xs bg-white hover:bg-slate-200 border px-2 py-1 rounded transition font-medium text-red-600">Delete</button>
              </div>
            </div>
          </div>

          <div
            className="gap-4 mx-auto relative p-2 w-full"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${(matrix && matrix[0] && matrix[0].length) || 2}, minmax(0, 1fr))`,
              maxWidth: `${Math.min(((matrix && matrix[0] && matrix[0].length) || 2) * 90, 560)}px`,
              gap: '1rem',
            }}
          >
            {/* Bracket design wrapper for the matrix */}
            <div className="absolute top-0 bottom-0 left-0 w-2 border-t-2 border-b-2 border-l-2 border-slate-400"></div>
            <div className="absolute top-0 bottom-0 right-0 w-2 border-t-2 border-b-2 border-r-2 border-slate-400"></div>
            
            {(matrix || [[0]]).map((row, rIdx) =>
              row.map((val, cIdx) => (
                <div key={`${rIdx}-${cIdx}`} className="flex flex-col items-center">
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => setMatrixCell(rIdx, cIdx, Number(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl p-3 text-center font-mono font-bold text-slate-800 text-xl shadow-sm transition"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1">a_{rIdx + 1}{cIdx + 1}</span>
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

          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-600 text-sm">Largest eigenvalue (power)</span>
            <span className="font-mono font-bold text-rose-600 text-base">
              {largestEigen === 'Unavailable' ? 'Unavailable' : largestEigen}
            </span>
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