import React, { useCallback, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Panel,
  BackgroundVariant,
  Connection,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import Sidebar from './components/Sidebar';
import HistoryPanel from './components/HistoryPanel';
import { 
  TextNode, 
  UploadImageNode, 
  UploadVideoNode, 
  RunLLMNode, 
  CropImageNode, 
  ExtractFrameNode 
} from './components/nodes/CustomNodes';
import { useWorkflowStore } from './store/useWorkflowStore';
import { executeWorkflow } from '../backend/executor';
import { isValidConnection } from '../backend/dag';
import { NodeType } from './types';
import { RotateCcw, RotateCw, Download, Trash2, User, Zap } from 'lucide-react';

const nodeTypes = {
  textNode: TextNode,
  uploadImageNode: UploadImageNode,
  uploadVideoNode: UploadVideoNode,
  runLLMNode: RunLLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
};

const Flow = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    undo,
    redo,
    isRunning,
    deleteNode,
    clearStatuses,
    addNode,
    setWorkflow
  } = useWorkflowStore();
  const { fitView } = useReactFlow();
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (initialLoadDone.current || nodes.length > 0) return;
    initialLoadDone.current = true;

    const imgId = addNode(NodeType.UPLOAD_IMAGE, { x: 0, y: 0 }, { config: { url: 'https://picsum.photos/400/300' } });
    const cropId = addNode(NodeType.CROP_IMAGE, { x: 350, y: 0 }, { config: { width_percent: 80, height_percent: 80 } });
    const sysId = addNode(NodeType.TEXT, { x: 0, y: 250 }, { config: { text: 'You are a professional marketing copywriter. Generate a compelling one-paragraph product description.' } });
    const detId = addNode(NodeType.TEXT, { x: 0, y: 400 }, { config: { text: 'Product: Wireless Headphones. Features: Noise cancellation, 30h battery.' } });
    const llm1Id = addNode(NodeType.RUN_LLM, { x: 700, y: 150 });
    const vidId = addNode(NodeType.UPLOAD_VIDEO, { x: 0, y: 600 }, { config: { url: 'https://www.w3schools.com/html/mov_bbb.mp4' } });
    const frameId = addNode(NodeType.EXTRACT_FRAME, { x: 350, y: 600 }, { config: { timestamp: '50%' } });
    const llm2Id = addNode(NodeType.RUN_LLM, { x: 1100, y: 300 }, { config: { systemPrompt: 'Create a viral tweet based on the assets provided.' } });

    setTimeout(() => {
      const sampleEdges = [
        { id: 'e1', source: imgId, target: cropId, targetHandle: 'image', animated: true },
        { id: 'e2', source: sysId, target: llm1Id, targetHandle: 'system_prompt', animated: true },
        { id: 'e3', source: detId, target: llm1Id, targetHandle: 'user_message', animated: true },
        { id: 'e4', source: cropId, target: llm1Id, targetHandle: 'images', animated: true },
        { id: 'e5', source: vidId, target: frameId, targetHandle: 'video_url', animated: true },
        { id: 'e6', source: llm1Id, target: llm2Id, targetHandle: 'user_message', animated: true },
        { id: 'e7', source: cropId, target: llm2Id, targetHandle: 'images', animated: true },
        { id: 'e8', source: frameId, target: llm2Id, targetHandle: 'images', animated: true },
      ].map(e => ({ ...e, style: { stroke: '#8b5cf6' } }));
      setWorkflow(useWorkflowStore.getState().nodes, sampleEdges);
      fitView();
    }, 200);
  }, [addNode, setWorkflow, fitView, nodes.length]);

  const handleConnect = useCallback((params: Connection) => {
    if (params.source && params.target) {
      if (isValidConnection(edges, params.source, params.target)) {
        onConnect(params);
      }
    }
  }, [edges, onConnect]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') return;
      nodes.filter(n => n.selected).forEach(node => deleteNode(node.id));
    }
  }, [nodes, deleteNode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={handleConnect}
      nodeTypes={nodeTypes}
      fitView
      snapToGrid
      snapGrid={[15, 15]}
    >
      <Background variant={BackgroundVariant.Dots} color="#1e293b" gap={24} size={1} />
      <Panel position="top-left" className="m-4">
         <div className="flex items-center gap-4 bg-slate-900/90 backdrop-blur-md p-1.5 pl-1.5 pr-4 rounded-full border border-slate-800 shadow-2xl">
           <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white"><User size={16} /></div>
           <div className="flex flex-col">
             <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">Developer</span>
             <span className="text-[11px] font-medium text-slate-200 leading-tight">demo@weavy.ai</span>
           </div>
         </div>
      </Panel>
      <Panel position="top-right" className="m-4 flex gap-2">
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-xl">
          <button onClick={undo} className="p-2 hover:bg-slate-800 rounded text-slate-400 transition-all"><RotateCcw size={18} /></button>
          <button onClick={redo} className="p-2 hover:bg-slate-800 rounded text-slate-400 transition-all"><RotateCw size={18} /></button>
        </div>
        <button 
          onClick={() => executeWorkflow()} 
          disabled={isRunning} 
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all shadow-xl ${isRunning ? 'bg-slate-800 text-slate-500' : 'bg-violet-600 hover:bg-violet-500 text-white'}`}
        >
          {isRunning ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <Zap size={18} fill="currentColor" />}
          <span>{isRunning ? 'Executing...' : 'Run Kit Generator'}</span>
        </button>
      </Panel>
      <Controls className="!bg-slate-900 !border-slate-800" />
      <MiniMap className="!bg-slate-900" nodeColor="#334155" maskColor="rgba(11, 14, 20, 0.7)" />
    </ReactFlow>
  );
};

const App: React.FC = () => (
  <div className="flex h-screen w-screen bg-[#0b0e14]">
    <Sidebar />
    <div className="flex-1 relative h-full">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
    <HistoryPanel />
  </div>
);

export default App;