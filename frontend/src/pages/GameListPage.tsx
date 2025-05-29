// src/pages/GameListPage/GameListPage.tsx (수정된 버전)
import React, { useRef, useEffect, useCallback } from 'react';
import useGames from '../hooks/useGames';
import useGameFilters from '../hooks/useGameFilters';
import GameCard from '../components/GameCard/GameCard';
import GameFilterSortControls from '../components/GameFilterSortControls/GameFilterSortControls'; // GameFilterSortControls는 그대로 사용
import './GameListPage.css';

const GameListPage: React.FC = () => {
    // useGameFilters에서 필터 상태와 세터 함수들을 가져옴
    const { 
        filters, 
        setSearchType, 
        setSearchTerm, 
        setSortBy, 
        setSortOrder, 
        setSelectedGenre, 
        setSelectedPlatform,
        genres, // genres, platforms는 필터 컨트롤에 필요할 수 있으므로 함께 전달
        platforms,
        genresLoading,
        platformsLoading,
        genresError,
        platformsError
    } = useGameFilters();

    // useGames 훅에 필터 상태 객체를 전달
    const { games, loading, error, hasMore, loadMoreGames } = useGames(filters);

    const observerTarget = useRef<HTMLDivElement>(null);

    // 로그: GameListPage에서 filters 객체가 useGames 훅에 전달되기 직전의 값 확인
    console.log('GameListPage: filters passed to useGames:', filters);

    // Intersection Observer 콜백 함수
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        // Intersection Observer가 트리거될 때마다 현재 상태 값을 참조하여 정확한 조건 확인
        // useRef를 사용하여 최신 상태를 참조하는 패턴과 유사하게,
        // 이 콜백 함수는 useGames 훅의 hasMore, loading 상태를 참조해야 함
        // (현재 loadMoreGames의 의존성에 포함되어 최신 값 참조 가능)

        // 중요: games.length > 0 조건은 첫 로딩이 완료된 후 추가 로딩을 시작하기 위함
        if (target.isIntersecting && hasMore && !loading && games.length > 0) {
            console.log('GameListPage: Intersection Observer triggered. Calling loadMoreGames().');
            loadMoreGames();
        }
    }, [hasMore, loading, loadMoreGames, games.length]); // 의존성 배열에 games.length 추가

    // Intersection Observer 설정
    useEffect(() => {
        const currentObserverTarget = observerTarget.current;
        let observer: IntersectionObserver;

        if (currentObserverTarget) {
            observer = new IntersectionObserver(handleObserver, {
                root: null,
                rootMargin: '200px',
                threshold: 0.1
            });

            observer.observe(currentObserverTarget);

            return () => {
                if (observer) {
                    observer.unobserve(currentObserverTarget);
                    observer.disconnect();
                }
            };
        }
    }, [handleObserver]); // handleObserver 함수가 변경될 때마다 옵저버 재설정

    if (error) return <p className="error-message">데이터 로딩 중 에러: {error}</p>;

    return (
        <div className="game-list-page">
            <h1 className="page-title">게임 목록</h1>

            <GameFilterSortControls
                // filters 객체를 통째로 전달하는 대신, 개별 필터 값과 세터 함수들을 전달
                // 이렇게 해야 GameFilterSortControls 컴포넌트의 불필요한 리렌더링을 줄일 수 있습니다.
                searchType={filters.searchType}
                searchTerm={filters.searchTerm}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                selectedGenre={filters.genre} // 이름 변경: selectedGenre
                selectedPlatform={filters.platform} // 이름 변경: selectedPlatform
                onSearchTypeChange={setSearchType}
                onSearchTermChange={setSearchTerm} // setSearchTerm 함수를 props로 전달
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                onGenreChange={setSelectedGenre} // 이름 변경: setSelectedGenre
                onPlatformChange={setSelectedPlatform} // 이름 변경: setSelectedPlatform
                
                // 장르/플랫폼 데이터도 전달 (GameFilterSortControls에서 드롭다운 등에 사용)
                genres={genres}
                platforms={platforms}
                genresLoading={genresLoading}
                platformsLoading={platformsLoading}
                genresError={genresError}
                platformsError={platformsError}
            />

            {/* 게임 목록이 비어있고 로딩 중이 아닐 때 메시지 표시 */}
            {games.length === 0 && !loading && !error ? (
                <p className="no-games-message">표시할 게임이 없습니다. 다른 검색/필터 조건을 시도해보세요!</p>
            ) : (
                <div className="game-list-grid">
                    {games.map((game) => (
                        
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            )}

            {/* Infinite Scroll의 트리거 역할 */}
            {hasMore && (
                <div ref={observerTarget} style={{ height: '50px', margin: '20px 0', textAlign: 'center' }}>
                    {loading && <p className="loading-message">더 많은 게임을 불러오는 중...</p>}
                </div>
            )}

            {/* 더 이상 데이터가 없고 로딩 중이 아닐 때 메시지 표시 */}
            {!hasMore && !loading && games.length > 0 && (
                <p className="no-more-games-message">모든 게임을 불러왔습니다.</p>
            )}
        </div>
    );
};

export default GameListPage;