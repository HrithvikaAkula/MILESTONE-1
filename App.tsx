import React, { useState, useEffect } from 'react';
import { AppView, ResearchDocument } from './types';
import WorkspacePage from './components/WorkspacePage';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import SummarizerPage from './components/SummarizerPage';
import InsightPage from './components/InsightPage';
import SearchPage from './components/SearchPage';
import ChatPage from './components/ChatPage';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('research_docs');
    if (saved) {
      try {
        setDocuments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('research_docs', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (doc: ResearchDocument) => {
    setDocuments(prev => [...prev, doc]);
    setCurrentView(AppView.WORKSPACE);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDocId === id) setSelectedDocId(null);
  };

  const updateDocument = (updatedDoc: ResearchDocument) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  if (currentView === AppView.LANDING) {
    return <LandingPage onStart={() => setCurrentView(AppView.WORKSPACE)} />;
  }

  const showBackToWorkspace = currentView !== AppView.WORKSPACE;
  const pageTitles: Record<AppView, string> = {
    [AppView.WORKSPACE]: 'Workspace',
    [AppView.DASHBOARD]: 'My Library',
    [AppView.UPLOAD]: 'Upload Paper',
    [AppView.SUMMARIZER]: 'Summarize',
    [AppView.INSIGHTS]: 'Insights',
    [AppView.SEARCH]: 'Semantic Search',
    [AppView.CHAT]: 'Chat',
    [AppView.LANDING]: '',
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar – no sidebar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView(AppView.WORKSPACE)}
            className="flex items-center gap-2 text-white font-bold tracking-tight hover:text-cyan-400 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-900 text-sm">
              <i className="fa-solid fa-book-open"></i>
            </span>
            PaperLens
          </button>
          {showBackToWorkspace && (
            <button
              onClick={() => setCurrentView(AppView.WORKSPACE)}
              className="text-slate-400 text-sm hover:text-white transition-colors flex items-center gap-1"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              Workspace
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">{documents.length} papers</span>
          <span className="text-slate-600">|</span>
          <span className="text-sm text-slate-400 font-medium">{pageTitles[currentView]}</span>
        </div>
      </header>

      {/* Full-width content – no sidebar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {currentView === AppView.WORKSPACE && (
          <WorkspacePage documentsCount={documents.length} onNavigate={setCurrentView} />
        )}

        {currentView === AppView.DASHBOARD && (
          <div className="max-w-5xl mx-auto p-6">
            <Dashboard
              documents={documents}
              onDelete={deleteDocument}
              onSelect={(id) => {
                setSelectedDocId(id);
                setCurrentView(AppView.SUMMARIZER);
              }}
              onUploadClick={() => setCurrentView(AppView.UPLOAD)}
              onBackToWorkspace={() => setCurrentView(AppView.WORKSPACE)}
            />
          </div>
        )}

        {currentView === AppView.UPLOAD && (
          <UploadPage onUploadComplete={addDocument} onBackToWorkspace={() => setCurrentView(AppView.WORKSPACE)} />
        )}

        {currentView === AppView.SUMMARIZER && (
          <SummarizerPage
            documents={documents}
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
            onUpdateDoc={updateDocument}
            onBackToWorkspace={() => setCurrentView(AppView.WORKSPACE)}
          />
        )}

        {currentView === AppView.INSIGHTS && (
          <InsightPage
            documents={documents}
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
            onUpdateDoc={updateDocument}
            onBackToWorkspace={() => setCurrentView(AppView.WORKSPACE)}
          />
        )}

        {currentView === AppView.SEARCH && (
          <SearchPage documents={documents} onBackToWorkspace={() => setCurrentView(AppView.WORKSPACE)} />
        )}

        {currentView === AppView.CHAT && (
          <ChatPage
            documents={documents}
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
            onBackToWorkspace={() => setCurrentView(AppView.WORKSPACE)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
