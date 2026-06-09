import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMathStore = create(
  persist(
    (set) => ({
      matrix: [
        [1, 0],
        [0, 1]
      ],

      setMatrixCell: (row, col, value) => set((state) => {
        const newMatrix = state.matrix.map((r, rIdx) => 
          r.map((c, cIdx) => {
            if (rIdx === row && cIdx === col)
              return value === '' ? '' : Number(value);
            return c;
          })
        );
        return { matrix: newMatrix };
      }),
      
      setMatrix: (newMatrix) => set({ matrix: newMatrix }),
    }),
    {
      name: 'math-matrix-storage',
    }
  )
);