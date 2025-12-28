
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Game } from './types';
import GameView from './components/GameView';
import SearchView from './components/SearchView';
import CategorySection from './components/CategorySection';
import SearchIcon from './components/icons/SearchIcon';
import MosaicGameGrid from './components/MosaicGameGrid';
import Logo from './components/Logo';
import UserIcon from './components/icons/UserIcon';

const CACHE_KEY = 'playrift_games_cache';

const getCachedGames = (): Game[] => {
  try {
    const item = window.localStorage.getItem(CACHE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

// Define a simple type for the user object
interface CrazyGamesUser {
  username: string;
  // Add other user properties here if available
}

// Extend the Window interface for TypeScript to recognize the CrazyGames SDK
declare global {
  interface Window {
    CrazyGames: {
      SDK: {
        init: () => Promise<void>;
        environment: 'local' | 'crazygames' | 'disabled';
        game: {
          loadingStart: () => void;
          loadingStop: () => void;
          gameplayStart: () => void;
          gameplayStop: () => void;
        };
        ad: {
          showRewardedAd: () => Promise<void>;
        };
        user: {
          getUser: () => Promise<CrazyGamesUser | null>;
        };
      };
    };
  }
}

const FEATURED_GAMES_COUNT = 18; // Increased for a larger mosaic
const CATEGORIES = ['Action', 'Adventure', 'Arcade', 'Puzzle', 'Racing', 'Sports', 'Strategy'];

// Utility to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


const App: React.FC = () => {
  const [allGames, setAllGames] = useState<Game[]>(getCachedGames());
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(getCachedGames().length === 0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [sdkEnvironment, setSdkEnvironment] = useState<string | null>(null);
  const [user, setUser] = useState<CrazyGamesUser | null>(null);

  // Initialize CrazyGames SDK on component mount
  useEffect(() => {
    const initializeSdk = async () => {
      if (window.CrazyGames) {
        try {
          await window.CrazyGames.SDK.init();
          setSdkInitialized(true);
          
          const urlParams = new URLSearchParams(window.location.search);
          const forceEnv = urlParams.get('force_env');
          let currentEnv: 'local' | 'crazygames' | 'disabled' = window.CrazyGames.SDK.environment;

          if (forceEnv === 'crazygames' || forceEnv === 'local') {
            console.warn(`DEVELOPER OVERRIDE: Forcing SDK environment to '${forceEnv}'`);
            currentEnv = forceEnv;
          }

          setSdkEnvironment(currentEnv);
          console.log('CrazyGames SDK Initialized. Effective Environment:', currentEnv);
        } catch (error) {
          console.error('Failed to initialize CrazyGames SDK:', error);
        }
      } else {
          setTimeout(initializeSdk, 500);
      }
    };
    initializeSdk();
  }, []);
  
  const isSdkUsable = sdkInitialized && sdkEnvironment !== 'disabled';

  const fetchGamePixGames = useCallback(async (pageNum: number) => {
    try {
      const response = await fetch(`https://feeds.gamepix.com/v2/json?sid=224NQ&pagination=48&page=${pageNum}`);
      if (!response.ok) throw new Error('GamePix Network response was not ok');
      const result = await response.json();
      const newGames: Game[] = (result.items || []).map((game: any) => ({
        id: `gp_${game.id}`,
        title: game.title,
        thumbnailUrl: game.banner_image,
        category: game.category,
        gameUrl: game.url,
      }));
      return { games: newGames, hasMore: !!result.next_url && newGames.length > 0 };
    } catch (error) {
      console.error("Failed to fetch GamePix games:", error);
      return { games: [], hasMore: false };
    }
  }, []);

  const fetchGamePushGames = useCallback(async () => {
    try {
        const query = `
            query Games {
                games(limit: 50, sort: "popularity") {
                    id
                    name
                    url
                    image
                    tags { name }
                }
            }
        `;
        const response = await fetch('https://api.gamepush.com/gs/api/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) throw new Error('GamePush Network response was not ok');
        const result = await response.json();
        const newGames: Game[] = (result.data.games || []).map((game: any) => ({
            id: `gph_${game.id}`,
            title: game.name,
            thumbnailUrl: game.image,
            category: game.tags.length > 0 ? game.tags[0].name : 'General',
            gameUrl: game.url,
        }));
        return newGames;
    } catch (error) {
        console.error("Failed to fetch GamePush games:", error);
        return [];
    }
  }, []);

  const loadInitialGames = useCallback(async (environment: string | null) => {
    const gamePixPromise = fetchGamePixGames(1);
    
    let combinedGames: Game[] = [];
    let gamePixHasMore = false;

    if (environment === 'crazygames') {
        const gamePushPromise = fetchGamePushGames();
        const [gamePixResult, gamePushResult] = await Promise.all([gamePixPromise, gamePushPromise]);
        combinedGames = shuffleArray([...gamePixResult.games, ...gamePushResult]);
        gamePixHasMore = gamePixResult.hasMore;
    } else {
        const gamePixResult = await gamePixPromise;
        combinedGames = gamePixResult.games;
        gamePixHasMore = gamePixResult.hasMore;
    }

    const uniqueGameIds = new Set();
    const uniqueGames = combinedGames.filter(game => {
      if (uniqueGameIds.has(game.id)) return false;
      uniqueGameIds.add(game.id);
      return true;
    });

    if (uniqueGames.length > 0) {
      setAllGames(uniqueGames);
      try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(uniqueGames));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
    setHasMore(gamePixHasMore);
    setPage(1);
    setLoading(false);
  }, [fetchGamePixGames, fetchGamePushGames]);

  useEffect(() => {
    if (sdkInitialized) {
        loadInitialGames(sdkEnvironment);
    }
  }, [sdkInitialized, sdkEnvironment, loadInitialGames]);

  const handleSelectGame = (game: Game) => {
    if (isSdkUsable) {
      try {
        window.CrazyGames.SDK.game.gameplayStart();
      } catch (error) {
        console.error('CrazyGames SDK error on gameplayStart:', error);
      }
    }
    setSelectedGame(game);
    setIsSearchOpen(false);
  };

  const handleCloseGame = () => {
    if (isSdkUsable) {
      try {
        window.CrazyGames.SDK.game.gameplayStop();
      } catch (error) {
          console.error('CrazyGames SDK error on gameplayStop:', error);
      }
    }
    setSelectedGame(null);
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const { games: newGames, hasMore: newHasMore } = await fetchGamePixGames(nextPage);

    if (newGames.length > 0) {
      setAllGames(prev => {
        const existingGameIds = new Set(prev.map(g => g.id));
        const uniqueNewGames = newGames.filter(g => !existingGameIds.has(g.id));
        const updatedGames = [...prev, ...uniqueNewGames];
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(updatedGames));
        } catch (error) {
          console.error("Error updating localStorage", error);
        }
        return updatedGames;
      });
      setPage(nextPage);
    }
    setHasMore(newHasMore);
    setLoading(false);
  };
  
  const handleGetUser = async () => {
    if (!isSdkUsable) return;
    try {
      const fetchedUser = await window.CrazyGames.SDK.user.getUser();
      setUser(fetchedUser);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const featuredGames = useMemo(() => allGames.slice(0, FEATURED_GAMES_COUNT), [allGames]);
  const moreGames = useMemo(() => allGames.slice(FEATURED_GAMES_COUNT), [allGames]);
  const gamesByCategory = useMemo(() => {
    const categoryMap = new Map<string, Game[]>();
    moreGames.forEach(game => { 
      if (game.category) {
        const matchedCategory = CATEGORIES.find(c => game.category.toLowerCase().includes(c.toLowerCase()));
        if (matchedCategory) {
          if (!categoryMap.has(matchedCategory)) categoryMap.set(matchedCategory, []);
          categoryMap.get(matchedCategory)!.push(game);
        }
      }
    });
    return categoryMap;
  }, [moreGames]);

  const sdkButtonTitle = !isSdkUsable && sdkInitialized ? "CrazyGames SDK is not available on this domain." : "";

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <Logo />
          <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-md">
            <button
              onClick={handleGetUser}
              className="p-3 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="User login"
              disabled={!isSdkUsable}
              title={sdkButtonTitle}
            >
              <UserIcon className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-3 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Open search"
            >
              <SearchIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </header>

        {loading && allGames.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-2xl text-white font-semibold animate-pulse">Loading awesome games...</p>
          </div>
        ) : allGames.length > 0 ? (
          <>
            <div className="space-y-12">
              <MosaicGameGrid games={featuredGames} onSelectGame={handleSelectGame} />
              {CATEGORIES.map(category => {
                const games = gamesByCategory.get(category);
                if (games && games.length > 5) {
                  return <CategorySection key={category} title={category} games={games} onSelectGame={handleSelectGame} />;
                }
                return null;
              })}
            </div>
            {moreGames.length > 0 && (
              <div className="mt-12">
                <MosaicGameGrid games={moreGames} onSelectGame={handleSelectGame} />
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-96">
            <p className="text-2xl text-white font-semibold">No games available right now.</p>
          </div>
        )}

        <div className="text-center mt-12">
          {loading && allGames.length > 0 && <p className="text-lg text-white font-semibold animate-pulse">Loading more games...</p>}
          {!loading && hasMore && allGames.length > 0 && (
            <button
              onClick={handleLoadMore}
              className="bg-white text-blue-500 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105 duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Load More Games
            </button>
          )}
          {!loading && !hasMore && allGames.length > FEATURED_GAMES_COUNT && (
            <p className="text-lg text-white/80 font-semibold">You've reached the end of the list!</p>
          )}
        </div>
      </main>

      {isSearchOpen && <SearchView games={allGames} onClose={() => setIsSearchOpen(false)} onSelectGame={handleSelectGame} />}
      {selectedGame && <GameView game={selectedGame} onClose={handleCloseGame} />}
    </div>
  );
};

export default App;
