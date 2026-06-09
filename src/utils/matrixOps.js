// src/utils/matrixOps.js
import * as math from 'mathjs';
import { Matrix, EigenvalueDecomposition } from 'ml-matrix';

export const calculateDeterminant = (matrix) => {
  try {
    const res = math.det(matrix);
    if (res && typeof res === 'object' && res.re !== undefined) return res.re;
    return res;
  } catch (err) {
    console.error('det error', err);
    return NaN;
  }
};

export const calculateTrace = (matrix) => {
  try {
    const res = math.trace(matrix);
    if (res && typeof res === 'object' && res.re !== undefined) return res.re;
    return res;
  } catch (err) {
    console.error('trace error', err);
    return NaN;
  }
};

export const calculateEigenvalues = (matrix) => {
  try {
    if (!matrix || !Array.isArray(matrix)) return 'Unavailable';
    const n = matrix.length;
    if (n === 1) return `${Number(matrix[0][0])}`;
    if (n === 2) {
      const a = Number(matrix[0][0]) || 0;
      const b = Number(matrix[0][1]) || 0;
      const c = Number(matrix[1][0]) || 0;
      const d = Number(matrix[1][1]) || 0;
      const t = a + d;
      const disc = Math.sqrt(((a - d) / 2) ** 2 + b * c);
      const l1 = t / 2 + disc;
      const l2 = t / 2 - disc;
      return `${l1}, ${l2}`;
    }

    // For n>2, try ml-matrix EigenvalueDecomposition
    try {
      const M = Matrix.checkMatrix(matrix) ? new Matrix(matrix) : new Matrix(matrix);
      const evd = new EigenvalueDecomposition(M);
      const real = evd.realEigenvalues || [];
      const imag = evd.imagEigenvalues || [];
      return real.map((r, i) => (imag[i] ? `${r} + ${imag[i]}i` : `${r}`)).join(', ');
    } catch (e) {
      console.error('ml-matrix eigen decomposition failed', e);
    }

    // // If math.eigs is available as a fallback, try it
    // if (math.eigs) {
    //   try {
    //     const res = math.eigs(matrix);
    //     if (res && res.values) return res.values.join(', ');
    //     if (res && res.eigenvalues) return res.eigenvalues.join(', ');
    //   } catch (e) {
    //     console.error('math.eigs failed', e);
    //   }
    // }

    return 'Unavailable';
  } catch (err) {
    console.error('eigen error', err);
    return 'Unavailable';
  }
};

export const calculateLargestEigenvalue = (matrix, { maxIter = 1000, tol = 1e-8 } = {}) => {
  try {
    if (!matrix || !Array.isArray(matrix)) return 'Unavailable';
    const n = matrix.length;
    if (n === 0) return 'Unavailable';
    if (n === 1) return Number(matrix[0][0]);

    // initialize vector with ones
    let v = new Array(n).fill(1);

    const normalize = (vec) => {
      const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0));
      return norm === 0 ? vec.map(() => 0) : vec.map((x) => x / norm);
    };

    v = normalize(v);
    let lambda = 0;

    for (let iter = 0; iter < maxIter; iter++) {
      // w = A * v
      const w = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        let sum = 0;
        const row = matrix[i] || [];
        for (let j = 0; j < n; j++) {
          sum += (Number(row[j]) || 0) * v[j];
        }
        w[i] = sum;
      }

      // compute Rayleigh quotient
      const num = w.reduce((s, wi, i) => s + wi * v[i], 0);
      const den = v.reduce((s, vi) => s + vi * vi, 0) || 1;
      const lambdaNew = num / den;

      const vNew = normalize(w);
      // check convergence on eigenvector or eigenvalue
      const diff = Math.abs(lambdaNew - lambda);
      v = vNew;
      lambda = lambdaNew;
      if (diff < tol) break;
    }

    if (!isFinite(lambda)) return 'Unavailable';
    return lambda;
  } catch (e) {
    console.error('power iteration failed', e);
    return 'Unavailable';
  }
};