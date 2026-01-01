
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Game } from './types';
import GameView from './components/GameView';
import SearchView from './components/SearchView';
import CategorySection from './components/CategorySection';
import SearchIcon from './components/icons/SearchIcon';
import MosaicGameGrid from './components/MosaicGameGrid';
import Logo from './components/Logo';
import Footer from './components/Footer';
import AboutUs from './components/pages/AboutUs';
import Contact from './components/pages/Contact';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import SitemapGenerator from './components/pages/SitemapGenerator';
import SitemapXml from './components/SitemapXml';
import { supabase } from './supabase';

const CACHE_KEY = 'playraft_games_cache_v2';

type View = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'game' | 'sitemap';
type SupabaseStatus = 'checking' | 'connected' | 'error';

const getCachedGames = (): Game[] => {
  try {
    const item = window.localStorage.getItem(CACHE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    return [];
  }
};

const App: React.FC = () => {
  if (window.location.pathname === '/sitemap.xml') {
    return <SitemapXml />;
  }

  const [allGames, setAllGames] = useState<Game[]>(getCachedGames());
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(allGames.length === 0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>('checking');
  
  const [currentPage, setCurrentPage] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchGames = useCallback(async (pageNum: number) => {
    try {
      const response = await fetch(`https://feeds.gamepix.com/v2/json?sid=224NQ&pagination=48&page=${pageNum}`);
      if (!response.ok) throw new Error('Network error');
      const result = await response.json();
      
      const newGames: Game[] = (result?.items || []).map((game: any) => ({
        id: `gp_${game.id}`,
        title: game.title || 'Untitled Game',
        thumbnailUrl: game.banner_image || game.thumbnail_url || '',
        category: game.category || 'General',
        gameUrl: game.url || '',
        description: game.description || `Experience the ultimate ${game.category || 'online'} adventure in ${game.title || 'this game'}. Play directly in your browser with no downloads required! High-quality graphics and smooth gameplay await in this trending title on PlayRaft.`,
      }));
      return { games: newGames, hasMore: !!result?.next_url };
    } catch (e) {
      return { games: [], hasMore: false };
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const { games: newGames, hasMore: newHasMore } = await fetchGames(nextPage);

    if (newGames.length > 0) {
      setAllGames(prevGames => {
        const uniqueNewGames = newGames.filter(ng => !prevGames.some(pg => pg.id === ng.id));
        const updatedGames = [...prevGames, ...uniqueNewGames];
        try {
            window.localStorage.setItem(CACHE_KEY, JSON.stringify(updatedGames));
        } catch (e) {
            // Suppress localStorage errors
        }
        return updatedGames;
      });
      setCurrentPage(nextPage);
    }
    setHasMore(newHasMore);
    setIsLoadingMore(false);
  }, [currentPage, fetchGames, hasMore, isLoadingMore]);

  const syncRoute = useCallback(() => {
    const path = window.location.pathname;
    const routes: {[key: string]: View} = {
        '/': 'home',
        '/home': 'home',
        '/about': 'about',
        '/contact': 'contact',
        '/privacy': 'privacy',
        '/terms': 'terms',
        '/sitemap': 'sitemap',
    };
    if (routes[path]) {
        setCurrentView(routes[path]);
        setSelectedGame(null);
    } else if (path.startsWith('/game/')) {
      const gameId = path.split('/game/')[1];
      const found = allGames.find(g => g.id === gameId);
      if (found) {
        setSelectedGame(found);
      }
      setCurrentView('game');
    }
  }, [allGames]);

  const navigate = (view: View, game?: Game) => {
    let path = '/';
    if (view === 'game' && game) {
      path = `/game/${game.id}`;
      setSelectedGame(game);
    } else if (view !== 'home') {
      path = `/${view}`;
      setSelectedGame(null);
    } else {
      setSelectedGame(null);
    }

    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      // Suppress navigation errors
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    syncRoute();
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [syncRoute]);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      const [page1, page2, page3] = await Promise.all([
        fetchGames(1),
        fetchGames(2),
        fetchGames(3),
      ]);
      
      const combinedGames = [...(page1.games || []), ...(page2.games || []), ...(page3.games || [])];
      const uniqueGames = Array.from(new Map(combinedGames.map(item => [item.id, item])).values());

      if (uniqueGames.length > 0) {
        setAllGames(uniqueGames);
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(uniqueGames));
        } catch (e) {
          // Suppress localStorage errors
        }
        
        const path = window.location.pathname;
        if (path.startsWith('/game/')) {
          const gameId = path.split('/game/')[1];
          const found = uniqueGames.find(g => g.id === gameId);
          if (found) {
            setSelectedGame(found);
            setCurrentView('game');
          }
        }
      }
      setHasMore(page3.hasMore);
      setLoading(false);
    };
    if (allGames.length === 0) {
        loadInitial();
    }
  }, [fetchGames, allGames.length]);

  useEffect(() => {
    const initSdk = async () => {
      const win = window as any;
      if (win?.CrazyGames?.SDK?.init) {
        try {
          await win.CrazyGames.SDK.init();
        } catch (e) { 
          // Suppress SDK init errors
        }
      }
    };
    const checkSupabaseConnection = async () => {
      // A lightweight query to check if the connection and table access are working.
      const { error } = await supabase
        .from('sitemap_games')
        .select('game_id', { count: 'exact', head: true });
      
      if (error) {
        setSupabaseStatus('error');
      } else {
        setSupabaseStatus('connected');
      }
    };

    initSdk();
    checkSupabaseConnection();
  }, []);

  const featuredGames = useMemo(() => allGames.slice(0, 18), [allGames]);
  const moreGames = useMemo(() => allGames.slice(18, 36), [allGames]);

  const renderContent = () => {
    if (loading && currentView === 'home') {
      return (
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-brand-text-primary font-semibold">Preparing your raft...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'about': return <AboutUs onNavigate={(v) => navigate(v as View)} />;
      case 'contact': return <Contact onNavigate={(v) => navigate(v as View)} />;
      case 'privacy': return <PrivacyPolicy onNavigate={(v) => navigate(v as View)} />;
      case 'terms': return <TermsOfService onNavigate={(v) => navigate(v as View)} />;
      case 'sitemap': return <SitemapGenerator onNavigate={(v) => navigate(v as View)} />;
      case 'game': 
        if (!selectedGame && loading) {
           return (
            <div className="flex flex-col justify-center items-center h-[60vh]">
              <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xl text-brand-text-primary font-semibold">Loading game details...</p>
            </div>
          );
        }
        return selectedGame ? (
          <GameView game={selectedGame} onClose={() => navigate('home')} />
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <h2 className="text-2xl text-brand-text-primary font-bold">Game not found</h2>
            <p className="text-brand-text-secondary mt-2">The game you are looking for doesn't exist or has moved.</p>
            <button onClick={() => navigate('home')} className="mt-6 bg-brand-accent text-brand-dark px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">Back to Home</button>
          </div>
        );
      default:
        return (
          <div className="animate-fade-in-up">
            <header className="flex justify-between items-center mb-12 flex-wrap gap-4">
              <Logo onClick={() => navigate('home')} />
              <div className="flex items-center bg-brand-card/70 backdrop-blur-lg border border-white/10 rounded-full p-1 shadow-lg">
                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  className="p-3 rounded-full hover:bg-brand-accent/20 transition-colors group flex items-center gap-2"
                >
                  <SearchIcon className="h-6 w-6 text-brand-text-secondary group-hover:text-brand-accent transition-colors" />
                  <span className="hidden sm:inline text-brand-text-primary font-medium pr-2">Search...</span>
                </button>
              </div>
            </header>
            <div className="space-y-20">
              <section>
                <h2 className="text-4xl font-black text-brand-text-primary mb-8 tracking-tighter">Featured Games</h2>
                <MosaicGameGrid games={featuredGames} onSelectGame={(g) => navigate('game', g)} />
              </section>

              <CategorySection title="Action" games={allGames.filter(g => g.category === 'Action')} onSelectGame={(g) => navigate('game', g)} />
              
              <section>
                <h2 className="text-3xl font-extrabold text-brand-text-primary mb-6">More Games</h2>
                 <MosaicGameGrid games={allGames.slice(18, 36)} onSelectGame={(g) => navigate('game', g)} />
              </section>

              <CategorySection title="Puzzle" games={allGames.filter(g => g.category === 'Puzzle')} onSelectGame={(g) => navigate('game', g)} />
              
              {allGames.length > 36 &&
                <section>
                    <h2 className="text-3xl font-extrabold text-brand-text-primary mb-6">All Games</h2>
                    <MosaicGameGrid games={allGames.slice(36)} onSelectGame={(g) => navigate('game', g)} />
                </section>
              }

              <div className="text-center pt-8">
                {hasMore ? (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="bg-gradient-to-r from-brand-accent to-cyan-500 text-brand-dark font-bold py-3 px-8 rounded-full hover:shadow-glow transition-all transform hover:scale-105 duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  >
                    {isLoadingMore && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isLoadingMore ? 'Loading...' : 'Load More Games'}
                  </button>
                ) : (
                  <p className="text-brand-text-secondary font-semibold">You've reached the end of the raft!</p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-accent selection:text-brand-dark overflow-x-hidden">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        {renderContent()}
      </main>
      <Footer onNavigate={(v) => navigate(v as View)} supabaseStatus={supabaseStatus} />
      {isSearchOpen && (
        <SearchView 
          games={allGames} 
          onClose={() => setIsSearchOpen(false)} 
          onSelectGame={(g) => {
            setIsSearchOpen(false);
            navigate('game', g);
          }} 
        />
      )}
    </div>
  );
};

export default App;