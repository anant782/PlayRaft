
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

const CACHE_KEY = 'playraft_games_cache_v2';

type View = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'game';

const getCachedGames = (): Game[] => {
  try {
    const item = window.localStorage.getItem(CACHE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    return [];
  }
};

const App: React.FC = () => {
  const [allGames, setAllGames] = useState<Game[]>(getCachedGames());
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(allGames.length === 0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
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
      console.error('Fetch error:', e);
      return { games: [], hasMore: false };
    }
  }, []);

  const syncRoute = useCallback(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '/home') {
      setCurrentView('home');
      setSelectedGame(null);
    } else if (path === '/about') {
      setCurrentView('about');
      setSelectedGame(null);
    } else if (path === '/contact') {
      setCurrentView('contact');
      setSelectedGame(null);
    } else if (path === '/privacy') {
      setCurrentView('privacy');
      setSelectedGame(null);
    } else if (path === '/terms') {
      setCurrentView('terms');
      setSelectedGame(null);
    } else if (path.startsWith('/game/')) {
      const gameId = path.split('/game/')[1];
      const found = allGames.find(g => g.id === gameId);
      if (found) {
        setSelectedGame(found);
        setCurrentView('game');
      } else {
        // If not found yet, we set the view to game but it might show loading
        setCurrentView('game');
      }
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
      console.error('Navigation error:', e);
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
      const { games, hasMore: more } = await fetchGames(1);
      if (games && games.length > 0) {
        setAllGames(games);
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(games));
        } catch (e) {
          console.warn('LocalStorage error:', e);
        }
        
        const path = window.location.pathname;
        if (path.startsWith('/game/')) {
          const gameId = path.split('/game/')[1];
          const found = games.find(g => g.id === gameId);
          if (found) {
            setSelectedGame(found);
            setCurrentView('game');
          }
        }
      }
      setHasMore(more);
      setLoading(false);
    };
    loadInitial();
  }, [fetchGames]);

  useEffect(() => {
    const initSdk = async () => {
      const win = window as any;
      if (win?.CrazyGames?.SDK?.init) {
        try {
          await win.CrazyGames.SDK.init();
        } catch (e) { 
          console.debug('CrazyGames SDK init skipped or failed'); 
        }
      }
    };
    initSdk();
  }, []);

  const featuredGames = useMemo(() => allGames.slice(0, 18), [allGames]);
  const moreGames = useMemo(() => allGames.slice(18), [allGames]);

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
          <div className="text-center py-20 animate-fade-in">
            <h2 className="text-2xl text-brand-text-primary font-bold">Game not found</h2>
            <p className="text-brand-text-secondary mt-2">The game you are looking for doesn't exist or has moved.</p>
            <button onClick={() => navigate('home')} className="mt-6 bg-brand-accent text-brand-dark px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">Back to Home</button>
          </div>
        );
      default:
        return (
          <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-10 flex-wrap gap-4">
              <Logo onClick={() => navigate('home')} />
              <div className="flex items-center bg-brand-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-2 shadow-lg">
                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  className="p-3 rounded-xl hover:bg-brand-accent/20 transition-colors group flex items-center gap-2"
                >
                  <SearchIcon className="h-6 w-6 text-brand-text-primary group-hover:text-brand-accent transition-colors" />
                  <span className="hidden sm:inline text-brand-text-primary font-medium">Search games...</span>
                </button>
              </div>
            </header>
            <div className="space-y-16">
              <section>
                <h2 className="text-3xl font-extrabold text-brand-text-primary mb-6">Featured Games</h2>
                <MosaicGameGrid games={featuredGames} onSelectGame={(g) => navigate('game', g)} />
              </section>

              <CategorySection title="Action" games={allGames.filter(g => g.category === 'Action')} onSelectGame={(g) => navigate('game', g)} />
              
              <section>
                <h2 className="text-2xl font-bold mb-6 text-brand-text-primary">New Releases</h2>
                <MosaicGameGrid games={moreGames.slice(0, 18)} onSelectGame={(g) => navigate('game', g)} />
              </section>

              <CategorySection title="Puzzle" games={allGames.filter(g => g.category === 'Puzzle')} onSelectGame={(g) => navigate('game', g)} />
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
      <Footer onNavigate={(v) => navigate(v as View)} />
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
