import React from 'react';
import { ResearchDocument } from '../types';

interface DashboardProps {
  documents: ResearchDocument[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onUploadClick: () => void;
  onBackToWorkspace?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ documents, onDelete, onSelect, onUploadClick }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">My Library</h2>
          <p className="text-slate-400 text-sm">All your uploaded papers in one place.</p>
        </div>
        <button
          onClick={onUploadClick}
          className="self-start px-4 py-2 bg-cyan-500 text-slate-900 text-sm font-semibold rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Add Paper
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-5">
            <i className="fa-solid fa-folder-open text-slate-500 text-3xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No documents yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mb-6">Upload a PDF to get summaries and insights.</p>
          <button
            onClick={onUploadClick}
            className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
          >
            Upload your first paper
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Document</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">Pages</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Size</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-36">Status</th>
                  <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-slate-800/80 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => onSelect(doc.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-file-pdf text-sm"></i>
                        </span>
                        <span className="font-medium text-white truncate max-w-[200px] sm:max-w-none">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">{doc.pageCount}</td>
                    <td className="px-5 py-4 text-slate-400 text-sm">{formatSize(doc.size)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {doc.summary ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase">Done</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-semibold uppercase">Pending</span>
                        )}
                        {doc.insights && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-semibold uppercase">Insights</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
                        className="text-slate-500 hover:text-red-400 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Delete"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
