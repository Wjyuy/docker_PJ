// src/pages/GameListPage/GameListPage.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import useGames from '../hooks/useGames';
import GameCard from '../components/GameCard/GameCard';
import './GameListPage.css';

const GameListPage: React.FC = () => {
  const { games, loading, error, hasMore, loadMoreGames } = useGames();
  const observerRef = useRef<HTMLDivElement>(null); // Intersection Observer의 대상 요소

  // Intersection Observer 콜백
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      // 대상 요소가 뷰포트에 들어오고, 더 불러올 데이터가 있고, 로딩 중이 아닐 때
      loadMoreGames();
    }
  }, [hasMore, loading, loadMoreGames]);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // 뷰포트를 root로 사용
      rootMargin: '200px', // 뷰포트 하단에서 200px 남았을 때 콜백 실행
      threshold: 0.1 // 대상 요소의 10%가 보일 때
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]);

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
      <div ref={observerRef} style={{ height: '50px', margin: '20px 0' }}>
        {loading && <p className="loading-message">더 많은 게임을 불러오는 중...</p>}
        {!hasMore && !loading && games.length > 0 && (
          <p className="no-more-games-message">모든 게임을 불러왔습니다.</p>
        )}
      </div>
    </div>
  );
};

export default GameListPage;