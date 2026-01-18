
import React, { useState } from 'react';
import { Clock, ChevronRight, ChevronDown, List, Timer } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';

const HistoryPanel = () => {
  const history = useWorkflowStore((state) => state.history);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  return (
    <div className="w-[340px] h-full bg-[#0b0e14] border-l border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-violet-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">Run History</h2>
        </div>
        <div className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">{history.length} Runs</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center py-20 text-slate-600 italic text-xs">No runs recorded yet.</div>
        ) : (
          history.map((run) => (
            <div key={run.id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
              <button 
                onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                className="w-full flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${run.status === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : run.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-slate-200">Run #{run.id.split('-')[1].slice(-4)}</div>
                    <div className="text-[9px] text-slate-500 flex items-center gap-2">
                      <span>{new Date(run.timestamp).toLocaleTimeString()}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span className="capitalize">{run.scope} Run</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">{(run.duration / 1000).toFixed(1)}s</span>
                  {expandedRun === run.id ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                </div>
              </button>

              {expandedRun === run.id && (
                <div className="px-3 pb-3 pt-1 space-y-2 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase pb-1 pt-2">
                    <List size={10} /> Node Execution Details
                  </div>
                  {Object.entries(run.nodeResults).map(([nodeId, res]: [string, any]) => (
                    <div key={nodeId} className="flex flex-col gap-1.5 p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 truncate w-32">{nodeId.split('-')[0]}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] text-slate-600 flex items-center gap-1"><Timer size={8}/> {(res.duration / 1000).toFixed(2)}s</span>
                           <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold ${res.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'}`}>{res.status}</span>
                        </div>
                      </div>
                      {res.error ? (
                        <div className="text-[9px] text-red-400 bg-red-400/5 p-1.5 rounded border border-red-400/10 font-mono leading-tight">{res.error}</div>
                      ) : res.output && (
                        <div className="text-[9px] text-slate-400 bg-slate-900/50 p-1.5 rounded border border-slate-800 leading-tight truncate max-w-full">
                          Output: {typeof res.output === 'string' ? res.output : 'Data Object'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
