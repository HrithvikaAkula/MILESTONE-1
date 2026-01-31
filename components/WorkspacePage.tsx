import React from 'react';
import { AppView } from '../types';

interface WorkspacePageProps {
  documentsCount: number;
  onNavigate: (view: AppView) => void;
}

const WorkspacePage: React.FC<WorkspacePageProps> = ({ documentsCount, onNavigate }) => {
  const actions = [
    {
      id: AppView.UPLOAD,
      label: 'Upload Paper',
      desc: 'Add a new PDF',
      icon: 'fa-cloud-arrow-up',
      style: 'row' as const,
      accent: 'cyan',
      size: 'wide',
    },
    {
      id: AppView.DASHBOARD,
      label: 'My Library',
      desc: `${documentsCount} document${documentsCount !== 1 ? 's' : ''}`,
      icon: 'fa-folder-open',
      style: 'stack' as const,
      accent: 'emerald',
      size: 'wide',
    },
    {
      id: AppView.SUMMARIZER,
      label: 'Summarize',
      desc: 'AI summary & findings',
      icon: 'fa-file-lines',
      style: 'compact' as const,
      accent: 'amber',
      size: 'normal',
    },
    {
      id: AppView.INSIGHTS,
      label: 'Insights',
      desc: 'Objectives & conclusions',
      icon: 'fa-lightbulb',
      style: 'compact' as const,
      accent: 'purple',
      size: 'normal',
    },
    {
      id: AppView.SEARCH,
      label: 'Semantic Search',
      desc: 'Query across papers',
      icon: 'fa-magnifying-glass',
      style: 'row' as const,
      accent: 'cyan',
      size: 'normal',
    },
    {
      id: AppView.CHAT,
      label: 'Chat',
      desc: 'Ask about any paper',
      icon: 'fa-comments',
      style: 'stack' as const,
      accent: 'rose',
      size: 'normal',
    },
  ];

  const accentClasses: Record<string, string> = {
    cyan: 'border-cyan-500/50 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400',
    emerald: 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400',
    amber: 'border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400',
    purple: 'border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400',
    rose: 'border-rose-500/50 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400',
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-1">Workspace</h1>
        <p className="text-slate-400 text-sm">Choose an action below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {actions.map((action) => {
          const accent = accentClasses[action.accent] || accentClasses.cyan;
          const isWide = action.size === 'wide';
          const isRow = action.style === 'row';
          const isStack = action.style === 'stack';
          const isCompact = action.style === 'compact';

          return (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className={`text-left rounded-xl border transition-all p-6 ${accent} ${
                isWide ? 'md:col-span-2' : ''
              } ${isRow ? 'flex items-center gap-5' : ''} ${isStack ? 'flex flex-col' : ''} ${
                isCompact ? 'flex flex-row items-center gap-4' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 rounded-lg flex items-center justify-center ${
                  isRow ? 'w-14 h-14' : isCompact ? 'w-12 h-12' : 'w-12 h-12 mb-3'
                } ${action.accent === 'cyan' ? 'bg-cyan-500/20' : ''} ${action.accent === 'emerald' ? 'bg-emerald-500/20' : ''} ${action.accent === 'amber' ? 'bg-amber-500/20' : ''} ${action.accent === 'purple' ? 'bg-purple-500/20' : ''} ${action.accent === 'rose' ? 'bg-rose-500/20' : ''}`}
              >
                <i className={`fa-solid ${action.icon} ${isRow || isCompact ? 'text-lg' : 'text-xl'}`}></i>
              </div>
              <div className={isCompact ? 'flex-1 min-w-0' : ''}>
                <div className="font-semibold text-white">{action.label}</div>
                <div className="text-sm opacity-80 mt-0.5">{action.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspacePage;
