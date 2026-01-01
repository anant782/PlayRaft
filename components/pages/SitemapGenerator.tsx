
import React, { useState } from 'react';
import PageWrapper from './PageWrapper';

type Page = 'home' | 'about' | 'contact' | 'privacy' | 'terms';

interface SitemapGeneratorProps {
  onNavigate: (page: Page) => void;
}

const SitemapGenerator: React.FC<SitemapGeneratorProps> = ({ onNavigate }) => {
    const [sitemapXml, setSitemapXml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState('');

    const generateSitemap = async () => {
        setIsLoading(true);
        setSitemapXml('');
        setProgress('Starting process...');

        const baseUrl = window.location.origin;

        try {
            // Dynamic game IDs are no longer fetched as the backend service is removed.
            const allGameIds: string[] = [];
            
            setProgress(`Generating XML for static pages. Dynamic game URL fetching is disabled.`);
            
            const today = new Date().toISOString().split('T')[0];
            const staticPages = [
                { url: '/', priority: '1.00', freq: 'daily' },
                { url: '/about', priority: '0.80', freq: 'monthly' },
                { url: '/contact', priority: '0.80', freq: 'monthly' },
                { url: '/privacy', priority: '0.80', freq: 'monthly' },
                { url: '/terms', priority: '0.80', freq: 'monthly' },
            ];

            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
            xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
            
            staticPages.forEach(p => {
                xml += `  <url>\n`;
                xml += `    <loc>${baseUrl}${p.url}</loc>\n`;
                xml += `    <lastmod>${today}</lastmod>\n`;
                xml += `    <changefreq>${p.freq}</changefreq>\n`;
                xml += `    <priority>${p.priority}</priority>\n`;
                xml += `  </url>\n`;
            });
            
            allGameIds.forEach(id => {
                xml += `  <url>\n`;
                xml += `    <loc>${baseUrl}/game/${id}</loc>\n`;
                xml += `    <lastmod>${today}</lastmod>\n`;
                xml += `    <changefreq>weekly</changefreq>\n`;
                xml += `    <priority>0.64</priority>\n`;
                xml += `  </url>\n`;
            });

            xml += `</urlset>`;

            setSitemapXml(xml);
            setProgress(`Sitemap generated for static pages only. Copy the content and save it as public/sitemap.xml`);
        } catch (error) {
            const err = error as Error;
            setProgress(`An error occurred: ${err.message}.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (sitemapXml) {
            navigator.clipboard.writeText(sitemapXml).then(() => {
                setProgress('Copied to clipboard!');
            }, () => {
                setProgress('Failed to copy. Please copy manually.');
            });
        }
    };

    return (
        <PageWrapper title="Sitemap Generator" onNavigate={onNavigate}>
            <p className="mb-4">
                This tool will generate a `sitemap.xml` file for the static pages of this site.
            </p>
            <p className="mb-6">
                After generation, copy the text and replace the content of the `public/sitemap.xml` file in your project.
            </p>

            <button
                onClick={generateSitemap}
                disabled={isLoading}
                className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-cyan-400 transition-transform transform hover:scale-105 duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Sitemap'}
            </button>
            
            {(isLoading || sitemapXml || progress) && (
                 <div className="mt-6 p-4 bg-brand-dark/50 rounded-lg">
                    <p className="text-sm font-semibold text-brand-text-secondary">{progress}</p>
                 </div>
            )}

            {sitemapXml && (
                <div className="mt-6 relative">
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 bg-brand-card text-brand-text-primary px-3 py-1 rounded-md text-xs hover:bg-brand-accent hover:text-brand-dark transition-colors"
                    >
                        Copy to Clipboard
                    </button>
                    <textarea
                        readOnly
                        value={sitemapXml}
                        className="w-full h-96 p-4 bg-brand-card border border-brand-blue text-brand-text-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono text-xs"
                        aria-label="Sitemap XML content"
                    />
                </div>
            )}
        </PageWrapper>
    );
};

export default SitemapGenerator;
