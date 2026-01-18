
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { NodeStatus } from '../../types';

interface BaseNodeProps {
  id: string;
  icon: LucideIcon;
  title: string;
  status: NodeStatus;
  selected?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({ 
  icon: Icon, 
  title, 
  status, 
  selected, 
  children,
  footer 
}) => {
  const isExecuting = status === 'running';
  
  return (
    <div className={`
      w-[280px] bg-slate-900/90 border-2 rounded-xl overflow-hidden shadow-2xl transition-all duration-300
      ${selected ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-800'}
      ${isExecuting ? 'node-executing scale-[1.02]' : ''}
    `}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
        <div className="p-1.5 bg-slate-700/50 rounded-lg text-violet-400">
          <Icon size={18} />
        </div>
        <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{title}</span>
        
        {/* Status Indicator */}
        <div className="ml-auto flex items-center gap-1.5">
           {status === 'success' && <div className="w-2 h-2 rounded-full bg-green-500" />}
           {status === 'failed' && <div className="w-2 h-2 rounded-full bg-red-500" />}
           {status === 'running' && (
             <div className="flex gap-0.5">
               <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
               <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
               <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
             </div>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {children}
      </div>

      {/* Footer / Results */}
      {footer && (
        <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-700/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default BaseNode;
