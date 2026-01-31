import React, { useState } from 'react';
import { ResearchDocument } from '../types';
import { extractInsights } from '../services/geminiService';

interface InsightPageProps {
  documents: ResearchDocument[];
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
  onUpdateDoc: (doc: ResearchDocument) => void;
  onBackToWorkspace?: () => void;
}

const InsightPage: React.FC<InsightPageProps> = ({ documents, selectedDocId, onSelectDoc, onUpdateDoc }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const handleExtract = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    setError(null);
    try {
      const insights = await extractInsights(selectedDoc.content);
      onUpdateDoc({ ...selectedDoc, insights });
    } catch (err: any) {
      setError("Insights extraction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Choose paper</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-left text-white hover:border-slate-600 transition-colors"
          >
            <span className="truncate">
              {selectedDoc ? selectedDoc.name : documents.length === 0 ? 'No papers' : 'Select a paper…'}
            </span>
            <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} aria-hidden="true" />
              <div className="absolute z-20 mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {documents.length === 0 ? (
                  <div className="px-4 py-3 text-slate-500 text-sm">No papers uploaded.</div>
                ) : (
                  documents.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => { onSelectDoc(doc.id); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 border-b border-slate-800 last:border-0 hover:bg-slate-800 transition-colors ${
                        selectedDocId === doc.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300'
                      }`}
                    >
                      <i className="fa-solid fa-file-pdf text-cyan-400/80 w-4"></i>
                      <span className="truncate">{doc.name}</span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {!selectedDoc ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-20 text-center">
          <i className="fa-solid fa-lightbulb text-slate-600 text-4xl mb-4 block"></i>
          <p className="text-slate-500">Select a paper from the dropdown above to extract insights.</p>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <h2 className="text-lg font-bold text-white truncate">Insights: {selectedDoc.name}</h2>
            {!selectedDoc.insights && (
              <button
                onClick={handleExtract}
                disabled={loading}
                className="px-4 py-2 bg-cyan-500 text-slate-900 text-sm font-semibold rounded-lg hover:bg-cyan-400 disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-brain"></i>}
                {loading ? 'Extracting…' : 'Extract Insights'}
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2 text-sm">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          {selectedDoc.insights ? (
            <div className="space-y-8">
              <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-bullseye"></i> Objectives
                </h3>
                <ul className="space-y-2">
                  {selectedDoc.insights.objectives.map((obj, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300 pl-4 border-l-2 border-cyan-500/40">
                      <span className="text-cyan-400 font-semibold">{i + 1}.</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-atom"></i> Key Concepts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDoc.insights.keyConcepts.map((c, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </section>

              <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-chart-line"></i> Results & Findings
                </h3>
                <div className="space-y-3">
                  {selectedDoc.insights.results.map((res, i) => (
                    <blockquote key={i} className="bg-slate-800 border-l-2 border-amber-500/50 pl-4 py-2 rounded-r-lg text-slate-300 text-sm italic">
                      &ldquo;{res}&rdquo;
                    </blockquote>
                  ))}
                </div>
              </section>

              <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-flag-checkered"></i> Conclusions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedDoc.insights.conclusions.map((c, i) => (
                    <div key={i} className="p-4 bg-slate-800 rounded-lg border-l-2 border-emerald-500">
                      <p className="text-slate-300 text-sm">{c}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm">Running analysis…</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightPage;
