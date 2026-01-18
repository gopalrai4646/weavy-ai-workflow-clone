
export enum NodeType {
  TEXT = 'textNode',
  UPLOAD_IMAGE = 'uploadImageNode',
  UPLOAD_VIDEO = 'uploadVideoNode',
  RUN_LLM = 'runLLMNode',
  CROP_IMAGE = 'cropImageNode',
  EXTRACT_FRAME = 'extractFrameNode'
}

export type NodeStatus = 'idle' | 'running' | 'success' | 'failed';

export interface WorkflowRun {
  id: string;
  timestamp: number;
  status: 'success' | 'failed' | 'partial';
  duration: number;
  scope: 'full' | 'partial' | 'single';
  nodeResults: Record<string, {
    status: NodeStatus;
    duration: number;
    output?: any;
    error?: string;
  }>;
}

export interface NodeData {
  label: string;
  type: NodeType;
  status: NodeStatus;
  config: Record<string, any>;
  output?: any;
  error?: string;
  onConfigChange: (id: string, config: any) => void;
}
