// src/components/GraphViewer.jsx
import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useMathStore } from '../store/useMathStore';

const GraphViewer = () => {
  const containerRef = useRef(null);
  const { matrix } = useMathStore(); // Get global matrix state

  const cyRef = React.useRef(null);

  // Initialize Cytoscape once
  useEffect(() => {
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        { selector: 'node', style: { 'background-color': '#4f46e5', label: 'data(label)', color: '#fff', 'text-valign': 'center', 'text-halign': 'center' } },
        { selector: 'edge', style: { width: 'data(weight)', 'line-color': '#94a3b8', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', label: 'data(weight)', 'font-size': 10, 'text-rotation': 'autorotate' } }
      ],
      layout: { name: 'preset' }
    });

    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, []);

  // Update elements on matrix change while preserving node positions when possible
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const size = (matrix && Array.isArray(matrix)) ? matrix.length : 0;

    // save existing node positions
    const savedPositions = {};
    cy.nodes().forEach((node) => {
      const id = node.id();
      savedPositions[id] = node.position();
    });

    const elements = [];
    for (let i = 0; i < size; i++) {
      elements.push({ data: { id: `node${i}`, label: `${i + 1}` } });
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const weight = Number(matrix[i] && matrix[i][j]) || 0;
        if (weight !== 0) elements.push({ data: { id: `edge${i}-${j}`, source: `node${i}`, target: `node${j}`, weight } });
      }
    }

    cy.startBatch();
    cy.elements().remove();
    cy.add(elements);

    // restore positions for known nodes
    let needLayout = false;
    const savedCount = Object.keys(savedPositions).length;
    if (savedCount !== size) needLayout = true;

    for (let i = 0; i < size; i++) {
      const id = `node${i}`;
      const el = cy.getElementById(id);
      if (savedPositions[id]) {
        el.position(savedPositions[id]);
      } else {
        needLayout = true;
      }
    }

    if (needLayout) {
      const layout = cy.layout({ name: size <= 4 ? 'grid' : 'cose', animate: true });
      layout.run();
    } else {
      cy.resize();
      cy.fit();
    }

    cy.endBatch();
  }, [matrix]);

  return <div ref={containerRef} className="w-full h-64 border rounded-xl bg-slate-50" />;
};

export default GraphViewer;