import React, { useState, useRef } from 'react';
import { extractTextFromPdf } from '../services/pdfService';
import { ResearchDocument } from '../types';
import { generateUUID } from '../utils/uuid';

interface UploadPageProps {
  onUploadComplete: (doc: ResearchDocument) => void;
  onBackToWorkspace?: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setProgress(20);

      const { text, pages } = await extractTextFromPdf(file);
      setProgress(80);

      const newDoc: ResearchDocument = {
        id: generateUUID(),
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        content: text,
        pageCount: pages,
      };

      setProgress(100);
      setTimeout(() => {
        onUploadComplete(newDoc);
        setIsUploading(false);
      }, 500);

    } catch (err: any) {
      setError("Failed to parse PDF: " + err.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Upload Research Paper</h2>
        <p className="text-slate-400 text-sm">PDF only, up to 10MB.</p>
      </div>

      <div
        className={`bg-slate-900 border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isUploading ? 'border-cyan-500/50' : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        {!isUploading ? (
          <>
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Drop your PDF here</h3>
            <p className="text-slate-500 text-sm mb-6">or click to browse</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
            >
              Choose file
            </button>
            {error && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm flex items-center justify-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {error}
              </div>
            )}
          </>
        ) : (
          <div className="py-6">
            <p className="text-cyan-400 text-sm font-medium mb-3">Extracting text…</p>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-cyan-500 transition-all duration-300"
              />
            </div>
            <p className="text-slate-500 text-xs mt-2">{progress}%</p>
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 text-center">
        {[
          { icon: 'fa-lock', label: 'Private' },
          { icon: 'fa-bolt', label: 'Fast' },
          { icon: 'fa-brain', label: 'AI-ready' },
        ].map((f) => (
          <div key={f.label} className="bg-slate-900/50 border border-slate-800 rounded-lg py-4">
            <i className={`fa-solid ${f.icon} text-cyan-400/80 text-lg mb-2 block`}></i>
            <span className="text-slate-400 text-xs font-medium">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPage;
