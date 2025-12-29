
import React from 'react';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'terms';

interface PageWrapperProps {
  title: string;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, onNavigate, children }) => {
  return (
    <div className="text-brand-text-primary animate-fade-in">
      <header className="mb-8">
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 text-brand-accent hover:text-cyan-400 transition-colors font-semibold"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Games
        </button>
      </header>
      <div className="bg-brand-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 border-b border-brand-blue pb-4">{title}</h1>
        <div className="prose prose-invert max-w-none prose-p:text-brand-text-secondary prose-h2:text-brand-text-primary prose-h3:text-brand-text-primary prose-strong:text-brand-text-primary prose-a:text-brand-accent hover:prose-a:text-cyan-400">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
