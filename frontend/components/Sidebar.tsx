
import React, { useState } from 'react';
import { 
  Search, 
  Type, 
  Image, 
  Video, 
  Cpu, 
  Crop, 
  Maximize,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { NodeType } from '../types';
import { useWorkflowStore } from '../store/useWorkflowStore';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');
  const addNode = useWorkflowStore((state) => state.addNode);

  const nodeButtons = [
    { type: NodeType.TEXT, icon: Type, label: 'Text Node', desc: 'Simple text input' },
    { type: NodeType.UPLOAD_IMAGE, icon: Image, label: 'Upload Image', desc: 'Accepts jpg, png, webp' },
    { type: NodeType.UPLOAD_VIDEO, icon: Video, label: 'Upload Video', desc: 'Accepts mp4, mov' },
    { type: NodeType.RUN_LLM, icon: Cpu, label: 'Run Any LLM', desc: 'Gemini 3 Pro vision support' },
    { type: NodeType.CROP_IMAGE, icon: Crop, label: 'Crop Image', desc: 'FFmpeg crop tool' },
    { type: NodeType.EXTRACT_FRAME, icon: Maximize, label: 'Extract Frame', desc: 'Video frame extraction' },
  ];

  const filteredNodes = nodeButtons.filter(n => n.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`
      relative h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-10
      ${isOpen ? 'w-[320px]' : 'w-16'}
    `}>
      <div className="p-4 flex flex-col h-full">
        {/* Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-20 bg-slate-800 border border-slate-700 rounded-full p-1 text-slate-400 hover:text-white transition-colors z-20"
        >
          {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>

        {isOpen && (
          <>
            <div className="mb-8">
              <h1 className="text-xl font-bold text-white mb-2">Workflow Builder</h1>
              <p className="text-xs text-slate-400">Build high-performance AI workflows</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text"
                placeholder="Search nodes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                value={search}
                // Fix: Call setSearch with e.target.value to update state correctly
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Access</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {filteredNodes.map((node) => (
                  <button
                    key={node.type}
                    onClick={() => addNode(node.type, { x: 100, y: 100 })}
                    className="flex items-center gap-4 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-violet-500/50 rounded-xl transition-all group text-left"
                  >
                    <div className="p-2 bg-slate-900 rounded-lg text-violet-400 group-hover:scale-110 transition-transform">
                      <node.icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{node.label}</div>
                      <div className="text-[10px] text-slate-500">{node.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
