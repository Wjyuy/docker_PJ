// src/hooks/useGames.ts
import { useState, useEffect, useCallback } from 'react';
import { GameDTO } from '../dto/GameDTO';
import { fetchPaginatedGames } from '../api/gameApi';

interface UseGamesResult {
  games: GameDTO[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreGames: () => void;
}

const PAGE_SIZE = 12;

const useGames = (): UseGamesResult => {
  const [games, setGames] = useState<GameDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadMoreGames = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);
    try {
      const newGames = await fetchPaginatedGames(offset, PAGE_SIZE);

      // --- 이 부분이 핵심입니다. ---
      setGames((prevGames) => {
        const existingIds = new Set(prevGames.map(game => game.id));
        const uniqueNewGames = newGames.filter(game => !existingIds.has(game.id));
        return [...prevGames, ...uniqueNewGames];
      });
      // -----------------------------

      setOffset((prevOffset) => prevOffset + newGames.length);

      if (newGames.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      setError('게임 목록을 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  useEffect(() => {
    loadMoreGames();
  }, [loadMoreGames]);

  return { games, loading, error, hasMore, loadMoreGames };
};

export default useGames;