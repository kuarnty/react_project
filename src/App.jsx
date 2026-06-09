import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-2">
          Math visualization
        </h1>
        <p className="text-slate-500 mb-6 font-medium">
          Project setting
        </p>
        
        <div className="bg-indigo-50 text-indigo-800 p-4 rounded-xl font-mono text-sm mb-6">
          A = [ [a_11, a_12], [a_21, a_22] ]
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-indigo-200">
          Start Visualization
        </button>
      </div>
    </div>
  );
}

export default App;