// src/store/useMathStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMathStore = create(
  persist(
    (set) => ({
      size: 3, // Default size
      matrix: Array(3).fill().map(() => Array(3).fill(0)),

      setSize: (newSize) => set({
        size: newSize,
        matrix: Array(newSize).fill().map(() => Array(newSize).fill(0))
      }),

      setMatrix: (newMatrix) => set(() => ({
        matrix: newMatrix,
        size: Array.isArray(newMatrix) ? newMatrix.length : 0
      })),

      setMatrixCell: (row, col, value) => set((state) => {
        const newMatrix = state.matrix.map((r, rIdx) => 
          r.map((c, cIdx) => (rIdx === row && cIdx === col) ? (value === '' ? 0 : Number(value)) : c)
        );
        return { matrix: newMatrix };
      })
    }),
    { name: 'math-matrix-storage' }
  )
);