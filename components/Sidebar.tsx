import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: AppView.DASHBOARD, icon: 'fa-table-columns', label: 'Dashboard' },
    { id: AppView.UPLOAD, icon: 'fa-cloud-arrow-up', label: 'Upload Paper' },
    { id: AppView.SUMMARIZER, icon: 'fa-file-lines', label: 'Summarizer' },
    { id: AppView.INSIGHTS, icon: 'fa-lightbulb', label: 'Insights' },
    { id: AppView.SEARCH, icon: 'fa-magnifying-glass', label: 'Semantic Search' },
    { id: AppView.CHAT, icon: 'fa-comments', label: 'Chat with AI' },
  ];

  return (
    <div className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center">
            <i className="fa-solid fa-book-open text-slate-900 text-sm"></i>
          </div>
          <span className="text-base font-bold text-white tracking-tight">PaperLens</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentView === item.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-4`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Powered by Gemini
      </div>
    </div>
  );
};

export default Sidebar;
