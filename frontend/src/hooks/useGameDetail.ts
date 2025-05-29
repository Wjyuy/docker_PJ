// src/hooks/useGameDetail.ts
import { useState, useEffect } from 'react';
import { GameDTO } from '../dto/GameDTO';
import { fetchGameById } from '../api/gameApi';

interface UseGameDetailResult {
  game: GameDTO | null;
  loading: boolean;
  error: string | null;
}

const useGameDetail = (gameId: number | undefined): UseGameDetailResult => {
  const [game, setGame] = useState<GameDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getGameDetail = async () => {
      if (gameId === undefined) {
        setError('게임 ID가 제공되지 않았습니다.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchGameById(gameId);
        setGame(data);
      } catch (err) {
        setError('게임 상세 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getGameDetail();
  }, [gameId]); // gameId가 변경될 때마다 다시 호출

  return { game, loading, error };
};

export default useGameDetail;