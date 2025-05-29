// src/pages/GameListPage/GameListPage.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import useGames from '../hooks/useGames';
import GameCard from '../components/GameCard/GameCard';
import './GameListPage.css';

const GameListPage: React.FC = () => {
  const { games, loading, error, hasMore, loadMoreGames } = useGames();
  const observerTarget = useRef<HTMLDivElement>(null); // Intersection Observer의 대상 요소

  // Intersection Observer 콜백
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    // target.isIntersecting: 대상 요소가 뷰포트에 들어왔는지
    // hasMore: 더 불러올 데이터가 있는지
    // !loading: 현재 로딩 중이 아닌지 (중복 호출 방지)
    if (target.isIntersecting && hasMore && !loading) {
      loadMoreGames(); // 스크롤하여 하단에 도달했을 때만 호출
    }
  }, [hasMore, loading, loadMoreGames]); // 의존성 배열에 loadMoreGames 추가

  // Intersection Observer 설정
  useEffect(() => {
    // observerTarget.current가 null이 아니면 옵저버를 생성
    if (observerTarget.current) {
      const observer = new IntersectionObserver(handleObserver, {
        root: null, // 뷰포트를 root로 사용
        rootMargin: '200px', // 뷰포트 하단에서 200px 남았을 때 콜백 실행
                              // 이 값을 0px로 하면 정확히 요소가 보일 때 트리거,
                              // 음수 값을 주면 요소가 뷰포트에 진입한 후 트리거
        threshold: 0.1 // 대상 요소의 10%가 보일 때
      });

      observer.observe(observerTarget.current);

      // 컴포넌트 언마운트 시 옵저버 해제
      return () => {
        if (observerTarget.current) {
          observer.unobserve(observerTarget.current);
        }
      };
    }
  }, [handleObserver, observerTarget]); // observerTarget.current가 변경될 때만 재설정

  // 초기 로딩 상태 처리
  if (loading && games.length === 0) { // 초기에 게임이 하나도 없을 때 로딩 중이면
    return (
      <div className="game-list-page">
        <h1 className="page-title">게임 목록</h1>
        <p className="loading-message">게임 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-list-page">
        <h1 className="page-title">게임 목록</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="game-list-page">
      <h1 className="page-title">게임 목록</h1>
      {games.length === 0 && !loading ? (
        <p className="no-games-message">표시할 게임이 없습니다.</p>
      ) : (
        <div className="game-list-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {/* 스크롤 감지를 위한 빈 div (Intersection Observer의 대상) */}
      {/* hasMore이 true일 때만 로딩 스피너를 보여주고, observerTarget을 설정 */}
      {hasMore && (
        <div ref={observerTarget} style={{ height: '50px', margin: '20px 0' }}>
          {loading && <p className="loading-message">더 많은 게임을 불러오는 중...</p>}
        </div>
      )}

      {/* 모든 데이터를 다 불러왔을 때 메시지 */}
      {!hasMore && !loading && games.length > 0 && (
        <p className="no-more-games-message">모든 게임을 불러왔습니다.</p>
      )}
    </div>
  );
};

export default GameListPage;