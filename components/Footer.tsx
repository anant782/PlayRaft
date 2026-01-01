
import React from 'react';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'sitemap';
type SupabaseStatus = 'checking' | 'connected' | 'error';

interface FooterProps {
  onNavigate: (page: Page) => void;
  supabaseStatus: SupabaseStatus;
}

const SupabaseStatusIndicator: React.FC<{ status: SupabaseStatus }> = ({ status }) => {
  const statusConfig = {
    checking: { text: 'Checking DB...', color: 'bg-yellow-500', pulse: true },
    connected: { text: 'Sitemap DB Connected', color: 'bg-green-500', pulse: false },
    error: { text: 'DB Connection Failed', color: 'bg-red-500', pulse: false },
  };

  const { text, color, pulse } = statusConfig[status];

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-brand-text-secondary/80">
      <span className={`relative flex h-2 w-2`}>
        <span className={`absolute inline-flex h-full w-full rounded-full ${color} ${pulse ? 'animate-ping' : ''} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`}></span>
      </span>
      <span>{text}</span>
    </div>
  );
};

const Footer: React.FC<FooterProps> = ({ onNavigate, supabaseStatus }) => {
  return (
    <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 border-t border-white/20 text-center text-brand-text-secondary">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
        <button onClick={() => onNavigate('about')} className="hover:text-brand-accent transition-colors">About Us</button>
        <span className="hidden sm:inline">|</span>
        <button onClick={() => onNavigate('contact')} className="hover:text-brand-accent transition-colors">Contact</button>
        <span className="hidden sm:inline">|</span>
        <button onClick={() => onNavigate('privacy')} className="hover:text-brand-accent transition-colors">Privacy Policy</button>
        <span className="hidden sm:inline">|</span>
        <button onClick={() => onNavigate('terms')} className="hover:text-brand-accent transition-colors">Terms of Service</button>
      </div>
      <p className="text-sm">
        &copy; {new Date().getFullYear()} PlayRaft. All rights reserved.
      </p>
      <p className="text-xs mt-2">
        All games are the property of their respective owners. This site is for demonstration purposes only.
      </p>
      <div className="mt-4 space-y-2">
         <button onClick={() => onNavigate('sitemap')} className="text-xs text-brand-text-secondary/50 hover:text-brand-accent transition-colors">Sitemap Generator</button>
         <SupabaseStatusIndicator status={supabaseStatus} />
      </div>
    </footer>
  );
};

export default Footer;
