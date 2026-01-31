import React, { useState } from 'react';
import { ResearchDocument, SearchResult } from '../types';
import { getEmbeddings, refineSearchResults, search } from '../services/geminiService';

interface SearchPageProps {
  documents: ResearchDocument[];
  onBackToWorkspace?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ documents }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setResults([]);
    setAiResponse(null);
    try {
      const response = await search(query);
      setAiResponse(response.answer);
    } catch (err: any) {
      console.error(err);
      setAiResponse(`Failed to fetch search results: ${err.message || "Please ensure the backend is running."}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 h-full flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Semantic Search</h2>
        <p className="text-slate-400 text-sm">Search across all your papers in natural language.</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., What are the effects of transformer architecture?"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-5 py-4 pr-14 text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-2 bottom-2 w-10 bg-cyan-500 text-slate-900 rounded-md flex items-center justify-center hover:bg-cyan-400 disabled:opacity-50 transition-colors"
        >
          {isSearching ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 space-y-6">
        {isSearching && (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-slate-800 rounded-lg"></div>
            <div className="h-16 bg-slate-800 rounded-lg"></div>
            <div className="h-16 bg-slate-800 rounded-lg"></div>
          </div>
        )}

        {aiResponse && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 border-t-2 border-t-cyan-500">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <i className="fa-solid fa-sparkles"></i>
              AI Answer
            </div>
            <div className="text-slate-300 leading-relaxed">
              {aiResponse}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sources</h3>
            {results.map((res, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-cyan-400">{res.docName}</span>
                  <span className="text-xs text-slate-500">Page {res.page}</span>
                </div>
                <p className="text-slate-400 text-sm">&ldquo;{res.text}&rdquo;</p>
              </div>
            ))}
          </div>
        )}

        {!isSearching && !aiResponse && documents.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-lg text-center">
            <i className="fa-solid fa-search text-slate-600 text-4xl mb-4 block"></i>
            <h4 className="text-white font-semibold mb-2">Ready to search {documents.length} documents</h4>
            <p className="text-slate-500 text-sm">Ask a question in plain language.</p>
          </div>
        )}

        {documents.length === 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-10 rounded-lg text-center">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 text-4xl mb-4 block"></i>
            <h4 className="text-amber-200 font-semibold mb-2">No documents</h4>
            <p className="text-amber-200/80 text-sm">Upload papers first to search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
