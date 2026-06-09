// src/components/GraphViewer.jsx
import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useMathStore } from '../store/useMathStore';

const GraphViewer = () => {
  const containerRef = useRef(null);
  const { matrix } = useMathStore(); // Get global matrix state

  useEffect(() => {
    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        { data: { id: 'node1', label: 'Node 1' } },
        { data: { id: 'node2', label: 'Node 2' } },
        { data: { id: 'edge1', source: 'node1', target: 'node2', weight: matrix[0][1] } }
      ],
      style: [
        { selector: 'node', style: { 'background-color': '#4f46e5', 'label': 'data(label)' } },
        { selector: 'edge', style: { 'width': 'data(weight)', 'line-color': '#94a3b8' } }
      ],
      layout: { name: 'grid' }
    });

    return () => cy.destroy(); // Cleanup on component unmount
  }, [matrix]); // Re-run whenever matrix changes

  return <div ref={containerRef} className="w-full h-64 border rounded-xl bg-slate-50" />;
};

export default GraphViewer;