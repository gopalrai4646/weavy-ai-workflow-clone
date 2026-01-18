
import { create } from 'zustand';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange, 
  addEdge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect, 
  applyNodeChanges, 
  applyEdgeChanges 
} from 'reactflow';
// Fix: Corrected relative import path for types.ts
import { NodeType, WorkflowRun, NodeStatus, NodeData } from '../types';

interface WorkflowState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  history: WorkflowRun[];
  isRunning: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setWorkflow: (nodes: Node<NodeData>[], edges: Edge[]) => void;
  addNode: (type: NodeType, position: { x: number, y: number }, data?: any) => string;
  updateNodeConfig: (id: string, config: any) => void;
  updateNodeStatus: (id: string, status: NodeStatus, output?: any, error?: string) => void;
  clearStatuses: () => void;
  deleteNode: (id: string) => void;
  addRunHistory: (run: WorkflowRun) => void;
  setRunning: (running: boolean) => void;
  undo: () => void;
  redo: () => void;
  past: { nodes: Node<NodeData>[], edges: Edge[] }[];
  future: { nodes: Node<NodeData>[], edges: Edge[] }[];
  isHandleConnected: (nodeId: string, handleId: string) => boolean;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  history: [],
  isRunning: false,
  past: [],
  future: [],

  // Using a cast to ensure the state remains typed with our NodeData interface
  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<NodeData>[] });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection: Connection) => {
    set({ edges: addEdge({ ...connection, animated: true, style: { stroke: '#8b5cf6' } }, get().edges) });
  },

  setWorkflow: (nodes, edges) => set({ nodes, edges }),

  addNode: (type, position, customData = {}) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node<NodeData> = {
      id,
      type,
      position,
      data: { 
        label: type,
        type,
        status: 'idle',
        config: customData.config || {},
        onConfigChange: (id: string, config: any) => get().updateNodeConfig(id, config)
      },
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
    return id;
  },

  // Fix: By typing the nodes in state as Node<NodeData>[], data.config access is now valid
  updateNodeConfig: (id, config) => {
    set((state) => ({
      nodes: state.nodes.map((node) => 
        node.id === id ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } } : node
      ),
    }));
  },

  updateNodeStatus: (id, status, output, error) => {
    set((state) => ({
      nodes: state.nodes.map((node) => 
        node.id === id ? { ...node, data: { ...node.data, status, output, error } } : node
      ),
    }));
  },

  clearStatuses: () => {
    set((state) => ({
      nodes: state.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: 'idle', output: undefined, error: undefined }
      })),
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
    }));
  },

  addRunHistory: (run) => set((state) => ({ history: [run, ...state.history] })),
  setRunning: (running) => set({ isRunning: running }),

  isHandleConnected: (nodeId, handleId) => {
    return get().edges.some(edge => edge.target === nodeId && edge.targetHandle === handleId);
  },

  undo: () => {}, // Simplified for brevity
  redo: () => {},
}));
