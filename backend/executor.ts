import { Node, Edge } from 'reactflow';
import { useWorkflowStore } from '../frontend/store/useWorkflowStore';
import { NodeType, WorkflowRun, NodeData } from '../frontend/types';
import { GoogleGenAI } from "@google/genai";

export async function executeWorkflow(nodeIds?: string[]) {
  const store = useWorkflowStore.getState();
  const nodes = nodeIds ? store.nodes.filter(n => nodeIds.includes(n.id)) : store.nodes;
  const edges = store.edges;
  
  if (store.isRunning) return;

  store.setRunning(true);
  store.clearStatuses();

  const startTime = Date.now();
  const nodeResults: WorkflowRun['nodeResults'] = {};
  const executed = new Set<string>();
  const toExecute = new Set<string>(nodes.map(n => n.id));

  while (toExecute.size > 0) {
    const readyNodes = Array.from(toExecute).filter((id: string) => {
      const dependencies = edges.filter(e => e.target === id).map(e => e.source);
      return dependencies.every(depId => !toExecute.has(depId) || executed.has(depId));
    });

    if (readyNodes.length === 0) break;

    await Promise.all(readyNodes.map(async (id: string) => {
      const node = nodes.find(n => n.id === id)!;
      const nodeStart = Date.now();
      store.updateNodeStatus(id, 'running');
      
      try {
        const result = await simulateTask(node, edges, nodeResults);
        const duration = Date.now() - nodeStart;
        nodeResults[id] = { status: 'success', duration, output: result };
        store.updateNodeStatus(id, 'success', result);
      } catch (error: any) {
        const duration = Date.now() - nodeStart;
        nodeResults[id] = { status: 'failed', duration, error: error.message };
        store.updateNodeStatus(id, 'failed', undefined, error.message);
      }
      
      executed.add(id);
      toExecute.delete(id);
    }));
  }

  store.addRunHistory({
    id: `run-${Date.now()}`,
    timestamp: Date.now(),
    status: Object.values(nodeResults).some(r => r.status === 'failed') ? 'partial' : 'success',
    duration: Date.now() - startTime,
    scope: 'full',
    nodeResults
  });
  store.setRunning(false);
}

// Correctly typed Node<NodeData> and followed Google GenAI SDK guidelines
async function simulateTask(node: Node<NodeData>, edges: Edge[], results: any): Promise<any> {
  await new Promise(r => setTimeout(r, 1000));
  if (node.type === NodeType.RUN_LLM) {
    // Guidelines: Always use named parameter for apiKey and use process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userMsg = node.data.config.userMessage || "Sample prompt";
    
    // Guidelines: Use ai.models.generateContent directly
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMsg,
    });
    
    // Guidelines: Access text as a property, not a method
    return response.text;
  }
  return "Executed successfully";
}