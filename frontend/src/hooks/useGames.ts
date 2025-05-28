// src/hooks/useGames.ts
import { useState, useEffect, useCallback  } from 'react';
import { GameDTO } from '../dto/GameDTO';
import { fetchPaginatedGames } from '../api/gameApi';

// ts games[], loading, error 타입 정의
interface UseGamesResult {
  games: GameDTO[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreGames: () => void;
}
const PAGE_SIZE = 12; // 한 번에 불러올 게임 개수

const useGames = (): UseGamesResult => {
  const [games, setGames] = useState<GameDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // 초기 로딩은 true 대신 false로 시작
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true); // 초기에는 더 불러올 데이터가 있다고 가정

  const loadMoreGames = useCallback(async () => {
    if (loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 데이터가 없으면 중복 호출 방지

    setLoading(true);
    setError(null);
    try {
      const newGames = await fetchPaginatedGames(offset, PAGE_SIZE);
      setGames((prevGames) => [...prevGames, ...newGames]);
      setOffset((prevOffset) => prevOffset + newGames.length); // 불러온 개수만큼 offset 증가

      if (newGames.length < PAGE_SIZE) {
        // 불러온 데이터가 PAGE_SIZE보다 적으면 더 이상 데이터가 없음
        setHasMore(false);
      }
    } catch (err) {
      setError('게임 목록을 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]); // 의존성 배열에 변경될 상태를 포함

  // 컴포넌트 마운트 시 첫 번째 게임 목록 로드
  useEffect(() => {
    loadMoreGames();
  }, [loadMoreGames]); // 초기 로드를 위해 loadMoreGames 의존성 포함

  return { games, loading, error, hasMore, loadMoreGames };
};

export default useGames;