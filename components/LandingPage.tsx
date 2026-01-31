import React from 'react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">

            {/* Nav – minimal dark bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center">
                            <i className="fa-solid fa-book-open text-slate-900 text-sm"></i>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">PaperLens</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm text-slate-400">
                        <a href="#steps" className="hover:text-cyan-400 transition-colors">Steps</a>
                        <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
                    </div>
                    <button
                        onClick={onStart}
                        className="px-5 py-2.5 bg-cyan-500 text-slate-900 text-sm font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                        Launch App
                    </button>
                </div>
            </nav>

            {/* Hero – left-aligned, dark */}
            <section className="relative pt-28 pb-20 px-6 max-w-6xl mx-auto">
                <div className="max-w-2xl">
                    <p className="text-cyan-400 text-sm font-medium uppercase tracking-widest mb-4">AI Research Assistant</p>
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                        Turn papers into insights in seconds
                    </h1>
                    <p className="text-slate-400 text-lg mb-10">
                        Upload PDFs, get AI summaries, extract key findings, and search across all your research—all in one place.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={onStart}
                            className="px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
                        >
                            Get started
                        </button>
                        <button
                            className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                        >
                            Learn more
                        </button>
                    </div>
                </div>
                {/* Decorative gradient blob */}
                <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            </section>

            {/* Steps – numbered blocks, dark cards */}
            <section id="steps" className="py-20 px-6 border-t border-slate-800">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-2">How it works</h2>
                    <p className="text-slate-400 mb-12">Four steps from upload to insight.</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { num: '1', title: 'Upload PDF', desc: 'Drop your research paper. We parse text and metadata.' },
                            { num: '2', title: 'AI analysis', desc: 'Models extract abstract, findings, and methodology.' },
                            { num: '3', title: 'Insights', desc: 'View summaries and key concepts in one view.' },
                            { num: '4', title: 'Search & chat', desc: 'Query across papers and ask follow-up questions.' },
                        ].map((item) => (
                            <div key={item.num} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <span className="inline-block w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold flex items-center justify-center mb-4">{item.num}</span>
                                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features – bento-style grid */}
            <section id="features" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-2">Built for researchers</h2>
                    <p className="text-slate-400 mb-12">Everything you need to stay on top of your reading.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: 'fa-cloud-arrow-up', title: 'Upload', desc: 'PDF drag & drop, 10MB max.' },
                            { icon: 'fa-file-lines', title: 'Summarize', desc: 'AI-generated abstract and findings.' },
                            { icon: 'fa-lightbulb', title: 'Insights', desc: 'Objectives, concepts, conclusions.' },
                            { icon: 'fa-magnifying-glass', title: 'Search', desc: 'Semantic search across documents.' },
                            { icon: 'fa-comments', title: 'Chat', desc: 'Ask questions in your language.' },
                            { icon: 'fa-table-columns', title: 'Dashboard', desc: 'All papers in one library.' },
                        ].map((f) => (
                            <div key={f.title} className="bg-slate-900/50 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                                    <i className={`fa-solid ${f.icon}`}></i>
                                </div>
                                <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                                <p className="text-slate-400 text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA – dark strip */}
            <section className="py-20 px-6 bg-slate-900 border-y border-slate-800">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-white mb-3">Ready to try it?</h2>
                    <p className="text-slate-400 mb-8">No sign-up. Use it in your browser now.</p>
                    <button
                        onClick={onStart}
                        className="px-8 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                        Open PaperLens
                    </button>
                </div>
            </section>

            {/* Footer – minimal dark */}
            <footer className="py-10 px-6 border-t border-slate-800">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center">
                            <i className="fa-solid fa-book-open text-cyan-400 text-xs"></i>
                        </div>
                        <span className="font-semibold text-slate-400">PaperLens</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-300">Privacy</a>
                        <a href="#" className="hover:text-slate-300">Terms</a>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-4 text-center text-xs text-slate-600">
                    &copy; 2024 PaperLens. For research use.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
