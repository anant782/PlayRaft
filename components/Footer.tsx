
import React from 'react';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'sitemap';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
      </div>
    </footer>
  );
};

export default Footer;
