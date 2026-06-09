// src/utils/matrixOps.js

// 1. Calculate Determinant
export const calculateDeterminant = (matrix) => {
  const [[a, b], [c, d]] = matrix;
  return a * d - b * c;
};

// 2. Calculate trace: a + d
export const calculateTrace = (matrix) => {
  const [[a, b], [c, d]] = matrix;
  return a + d;
};

// 3. Calculate eigenvalues from the characteristic equation λ² - tr(A)λ + det(A) = 0
export const calculateEigenvalues = (matrix) => {
  const [[a, b], [c, d]] = matrix;
  const trace = a + d;
  const det = a * d - b * c;
  
  // Discriminant D = tr² - 4*det
  const discriminant = trace * trace - 4 * det;
  
  if (discriminant < 0) {
    // Complex eigenvalues
    const realPart = (trace / 2).toFixed(2);
    const imaginaryPart = (Math.sqrt(-discriminant) / 2).toFixed(2);
    return `λ = ${realPart} ± ${imaginaryPart}i (Complex)`;
  }
  
  const l1 = (trace + Math.sqrt(discriminant)) / 2;
  const l2 = (trace - Math.sqrt(discriminant)) / 2;
  
  if (l1 === l2) {
    return `double root λ = ${l1.toFixed(3)}`;
  }
  return `λ₁ = ${l1.toFixed(3)}, λ₂ = ${l2.toFixed(3)}`;
};