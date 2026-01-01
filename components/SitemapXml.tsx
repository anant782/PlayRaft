
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const SITEMAP_CACHE_KEY = 'playraft_sitemap_cache_v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const SitemapXml: React.FC = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

  useEffect(() => {
    const generateAndSetSitemap = async () => {
      try {
        // Check cache first
        const cachedItem = localStorage.getItem(SITEMAP_CACHE_KEY);
        if (cachedItem) {
          const { xml, timestamp } = JSON.parse(cachedItem);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setSitemapContent(xml);
            return;
          }
        }

        // Fetch from Supabase if cache is stale or missing
        const allGameIds: string[] = [];
        const BATCH_SIZE = 1000;
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          const { data, error } = await supabase
            .from('sitemap_games')
            .select('game_id')
            .range(offset, offset + BATCH_SIZE - 1);

          if (error) throw error;
          
          if (data && data.length > 0) {
            allGameIds.push(...data.map(item => item.game_id));
            offset += data.length;
          }
          
          if (!data || data.length < BATCH_SIZE) {
            hasMore = false;
          }
        }

        const baseUrl = window.location.origin;
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

        setSitemapContent(xml);
        localStorage.setItem(SITEMAP_CACHE_KEY, JSON.stringify({ xml, timestamp: Date.now() }));
      } catch (error) {
        setSitemapContent('<!-- Error generating sitemap. -->');
      }
    };

    generateAndSetSitemap();
  }, []);

  // This component renders the XML as plain text. 
  // For search engines to correctly interpret this as XML, 
  // ideally the server should send a 'Content-Type: application/xml' header.
  // This is a client-side workaround that is generally well-understood by modern crawlers.
  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
      {sitemapContent}
    </pre>
  );
};

export default SitemapXml;