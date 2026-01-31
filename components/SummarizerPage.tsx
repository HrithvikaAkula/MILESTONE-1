import React, { useState } from 'react';
import { ResearchDocument } from '../types';
import { generateSummary } from '../services/geminiService';

interface SummarizerPageProps {
  documents: ResearchDocument[];
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
  onUpdateDoc: (doc: ResearchDocument) => void;
  onBackToWorkspace?: () => void;
}

const SummarizerPage: React.FC<SummarizerPageProps> = ({ documents, selectedDocId, onSelectDoc, onUpdateDoc }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const handleGenerate = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    setError(null);
    try {
      const summary = await generateSummary(selectedDoc.content);
      onUpdateDoc({ ...selectedDoc, summary });
    } catch (err: any) {
      setError("AI generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!selectedDoc?.summary) return;
    const text = `Abstract: ${selectedDoc.summary.abstract}\n\nKey Findings:\n${selectedDoc.summary.findings.join('\n')}\n\nMethodology: ${selectedDoc.summary.methodology}`;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center">
          <i className="fa-solid fa-file-lines text-slate-600 text-4xl mb-4 block"></i>
          <p className="text-slate-500">Select a paper from the dropdown above to generate its summary.</p>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <h2 className="text-lg font-bold text-white truncate">{selectedDoc.name}</h2>
            <div className="flex items-center gap-2 shrink-0">
              {selectedDoc.summary ? (
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors text-sm flex items-center gap-2"
                  title="Copy"
                >
                  <i className="fa-solid fa-copy"></i> Copy
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-500 text-slate-900 text-sm font-semibold rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                  {loading ? 'Analyzing…' : 'Generate Summary'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2 text-sm">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                  <div className="h-16 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {selectedDoc.summary && (
            <div className="space-y-8 pb-10">
              <section>
                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider border-l-2 border-cyan-500 pl-3 mb-3">Abstract</h3>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-300 text-sm leading-relaxed">
                  {selectedDoc.summary.abstract}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider border-l-2 border-emerald-500 pl-3 mb-3">Key Findings</h3>
                <ul className="space-y-3">
                  {selectedDoc.summary.findings.map((finding, idx) => (
                    <li key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check"></i>
                      </span>
                      <p className="text-slate-300 text-sm">{finding}</p>
                    </li>
                  ))}
                </ul>
              </section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider border-l-2 border-amber-500 pl-3 mb-3">Methodology</h3>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-400 text-sm leading-relaxed min-h-[120px]">
                    {selectedDoc.summary.methodology}
                  </div>
                </section>
                <section>
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider border-l-2 border-red-500 pl-3 mb-3">Limitations</h3>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-400 text-sm leading-relaxed min-h-[120px]">
                    {selectedDoc.summary.limitations}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummarizerPage;
