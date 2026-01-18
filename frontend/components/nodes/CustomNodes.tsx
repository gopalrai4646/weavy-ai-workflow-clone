
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Type, Image, Video, Cpu, Crop, Maximize,
  Upload, Play, ChevronDown
} from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeData } from '../../types';
import { useWorkflowStore } from '../../store/useWorkflowStore';

const inputClasses = "w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200";
const labelClasses = "text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block";

export const TextNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <BaseNode id={id} icon={Type} title="Text" status={data.status} selected={selected}>
    <textarea
      className={`${inputClasses} min-h-[100px] resize-none custom-scrollbar`}
      placeholder="Type something here..."
      value={data.config.text || ''}
      onChange={(e) => data.onConfigChange(id, { text: e.target.value })}
    />
    <Handle type="source" position={Position.Right} id="output" />
  </BaseNode>
);

export const UploadImageNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) data.onConfigChange(id, { url: URL.createObjectURL(file) });
  };
  return (
    <BaseNode id={id} icon={Image} title="Upload Image" status={data.status} selected={selected}>
      {data.config.url ? (
        <div className="relative group rounded-lg overflow-hidden border border-slate-800">
          <img src={data.config.url} className="w-full h-36 object-cover" alt="Preview" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="p-2 bg-slate-900/80 rounded-full cursor-pointer hover:bg-slate-800"><Upload size={16}/><input type="file" className="hidden" accept="image/*" onChange={handleUpload}/></label>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-800 rounded-lg hover:border-violet-500/50 cursor-pointer bg-slate-950 transition-all">
          <Upload className="text-slate-600 mb-2" size={24} />
          <span className="text-[10px] text-slate-500 uppercase font-bold">Drop Image Here</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
        </label>
      )}
      <Handle type="source" position={Position.Right} id="output" />
    </BaseNode>
  );
};

export const UploadVideoNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) data.onConfigChange(id, { url: URL.createObjectURL(file) });
  };
  return (
    <BaseNode id={id} icon={Video} title="Upload Video" status={data.status} selected={selected}>
      {data.config.url ? (
        <video src={data.config.url} controls className="w-full rounded-lg border border-slate-800 shadow-lg" />
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-800 rounded-lg hover:border-violet-500/50 cursor-pointer bg-slate-950 transition-all">
          <Play className="text-slate-600 mb-2" size={24} />
          <span className="text-[10px] text-slate-500 uppercase font-bold">Select MP4 or MOV</span>
          <input type="file" className="hidden" accept="video/*" onChange={handleUpload} />
        </label>
      )}
      <Handle type="source" position={Position.Right} id="output" />
    </BaseNode>
  );
};

export const RunLLMNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const isConnected = useWorkflowStore(s => s.isHandleConnected);
  return (
    <BaseNode id={id} icon={Cpu} title="Run Any LLM" status={data.status} selected={selected}
      footer={(data.output || data.error) && (
        <div className="space-y-2">
          <span className={`text-[10px] font-bold uppercase ${data.error ? 'text-red-400' : 'text-slate-500'}`}>{data.error ? 'Error' : 'LLM Result'}</span>
          <div className={`text-xs leading-relaxed max-h-56 overflow-y-auto custom-scrollbar p-2 bg-slate-950/50 rounded border border-slate-800 ${data.error ? 'text-red-300' : 'text-slate-200'}`}>{data.error || data.output}</div>
        </div>
      )}>
      <div className="space-y-4 relative">
        <div className="relative">
          <label className={labelClasses}>Model</label>
          <div className="relative">
            <select 
              className={`${inputClasses} appearance-none pr-8 cursor-pointer`} 
              value={data.config.model || "gemini-3-flash-preview"}
              onChange={(e) => data.onConfigChange(id, { model: e.target.value })}
            >
              <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
              <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
        <div className="relative">
          <label className={labelClasses}>System Prompt</label>
          <textarea className={`${inputClasses} h-12`} placeholder="Connect Text Node..." value={data.config.systemPrompt || ''} onChange={(e) => data.onConfigChange(id, { systemPrompt: e.target.value })} disabled={isConnected(id, 'system_prompt')} />
          <Handle type="target" position={Position.Left} id="system_prompt" style={{ top: '2rem' }} />
        </div>
        <div className="relative">
          <label className={labelClasses}>User Message</label>
          <textarea className={`${inputClasses} h-12`} placeholder="Connect Text Node..." value={data.config.userMessage || ''} onChange={(e) => data.onConfigChange(id, { userMessage: e.target.value })} disabled={isConnected(id, 'user_message')} />
          <Handle type="target" position={Position.Left} id="user_message" style={{ top: '2rem' }} />
        </div>
        <div className="pt-2 border-t border-slate-800">
          <label className={labelClasses}>Vision Inputs</label>
          <div className="h-8 bg-slate-950/50 border border-slate-800 border-dashed rounded flex items-center justify-center text-[9px] text-slate-600">Supports Multi-Image</div>
          <Handle type="target" position={Position.Left} id="images" style={{ top: '2.5rem' }} />
        </div>
        <Handle type="source" position={Position.Right} id="output" />
      </div>
    </BaseNode>
  );
};

export const CropImageNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const isConnected = useWorkflowStore(s => s.isHandleConnected);
  const fields = [
    { id: 'x_percent', label: 'X %' },
    { id: 'y_percent', label: 'Y %' },
    { id: 'width_percent', label: 'Width %' },
    { id: 'height_percent', label: 'Height %' }
  ];
  return (
    <BaseNode id={id} icon={Crop} title="Crop Image" status={data.status} selected={selected}>
      <div className="space-y-3 relative">
        <div className="relative pb-2 border-b border-slate-800">
          <label className={labelClasses}>Input Image</label>
          <div className="h-6 bg-slate-950 border border-slate-800 rounded" />
          <Handle type="target" position={Position.Left} id="image" style={{ top: '1.5rem' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {fields.map((f, i) => (
            <div key={f.id} className="relative">
              <label className={labelClasses}>{f.label}</label>
              <input type="number" className={inputClasses} value={data.config[f.id] ?? (i > 1 ? 100 : 0)} onChange={(e) => data.onConfigChange(id, { [f.id]: parseInt(e.target.value) || 0 })} disabled={isConnected(id, f.id)} />
              <Handle type="target" position={Position.Left} id={f.id} style={{ top: '1.5rem' }} />
            </div>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </BaseNode>
  );
};

export const ExtractFrameNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const isConnected = useWorkflowStore(s => s.isHandleConnected);
  return (
    <BaseNode id={id} icon={Maximize} title="Extract Frame" status={data.status} selected={selected}>
      <div className="space-y-4 relative">
        <div className="relative">
          <label className={labelClasses}>Video Source</label>
          <div className="h-6 bg-slate-950 border border-slate-800 rounded" />
          <Handle type="target" position={Position.Left} id="video_url" style={{ top: '1.5rem' }} />
        </div>
        <div className="relative">
          <label className={labelClasses}>Timestamp</label>
          <input type="text" className={inputClasses} placeholder="50% or 10s" value={data.config.timestamp || '0'} onChange={(e) => data.onConfigChange(id, { timestamp: e.target.value })} disabled={isConnected(id, 'timestamp')} />
          <Handle type="target" position={Position.Left} id="timestamp" style={{ top: '2rem' }} />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </BaseNode>
  );
};
