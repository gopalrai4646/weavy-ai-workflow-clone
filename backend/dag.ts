
import { Edge } from 'reactflow';

export function isValidConnection(edges: Edge[], source: string, target: string): boolean {
  if (source === target) return false;
  // Basic cycle detection
  const adj = new Map<string, string[]>();
  edges.forEach(e => {
    const list = adj.get(e.source) || [];
    list.push(e.target);
    adj.set(e.source, list);
  });
  
  const visited = new Set<string>();
  const stack = new Set<string>();

  const hasCycle = (v: string): boolean => {
    if (stack.has(v)) return true;
    if (visited.has(v)) return false;
    visited.add(v);
    stack.add(v);
    const neighbors = adj.get(v) || [];
    for (const n of neighbors) if (hasCycle(n)) return true;
    stack.delete(v);
    return false;
  };

  const allNodes = new Set([...edges.map(e => e.source), ...edges.map(e => e.target), source, target]);
  for (const n of allNodes) if (hasCycle(n)) return true;
  return false;
}
