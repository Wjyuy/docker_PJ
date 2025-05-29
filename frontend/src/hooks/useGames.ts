// src/hooks/useGames.ts (새로운 버전 - 무한 루프 및 searchTerm 동기화 재시도)
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameDTO } from '../dto/GameDTO';
import { fetchFilteredPaginatedGames, GameFilterParams, PaginatedGamesResponse } from '../api/gameApi';

export interface GameQueryParam {
    searchType: string;
    searchTerm: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    genre: string;
    platform: string;
}

interface UseGamesResult {
    games: GameDTO[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMoreGames: () => void;
}

const PAGE_SIZE = 12;

const useGames = (queryParams: GameQueryParam): UseGamesResult => {
    const [games, setGames] = useState<GameDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // loading과 hasMore의 최신 상태를 참조하기 위한 useRef
    const loadingRef = useRef(loading);
    const hasMoreRef = useRef(hasMore);

    // queryParams의 이전 값을 저장하기 위한 useRef
    const prevQueryParamsRef = useRef<GameQueryParam>(queryParams);

    // 컴포넌트의 첫 마운트 여부를 추적 (초기 데이터 로드를 위함)
    const isInitialMount = useRef(true);

    // loading 상태가 바뀔 때마다 loadingRef.current를 업데이트합니다.
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    // hasMore 상태가 바뀔 때마다 hasMoreRef.current를 업데이트합니다.
    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    // API 호출 함수
    // useCallback의 의존성 배열에서 loading, hasMore를 제거하고 queryParams만 남깁니다.
    const fetchData = useCallback(async (currentOffset: number, isReset: boolean) => {
        // useRef를 통해 최신 loading 및 hasMore 상태 참조
        if (!isReset && (loadingRef.current || !hasMoreRef.current)) {
            console.log('fetchData: Skipping - already loading or no more data (current state).');
            return;
        }

        setLoading(true);
        setError(null);

        // fetchData가 호출되는 시점의 최신 queryParams를 사용합니다.
        // 이 queryParams는 useCallback의 의존성이므로 항상 최신 값을 보장합니다.
        const params: GameFilterParams = {
            offset: currentOffset,
            limit: PAGE_SIZE,
            searchType: queryParams.searchType,
            searchTerm: queryParams.searchTerm,
            sortBy: queryParams.sortBy,
            sortOrder: queryParams.sortOrder,
            genre: queryParams.genre,
            platform: queryParams.platform,
        };

        // ★★★ params 객체의 내용을 직접 출력하여 searchTerm과 searchType 확인!
        console.log(`fetchData: API request params after search:`, params);

        try {
            const data: PaginatedGamesResponse = await fetchFilteredPaginatedGames(params);

            setGames((prevGames) => {
                if (isReset) {
                    console.log("fetchData: Resetting games with new data.");
                    return data.games;
                } else {
                    const existingIds = new Set(prevGames.map(game => game.id));
                    const uniqueNewGames = data.games.filter((game: GameDTO) => !existingIds.has(game.id));
                    console.log(`fetchData: Added ${uniqueNewGames.length} new games.`);
                    return [...prevGames, ...uniqueNewGames];
                }
            });

            setOffset(currentOffset + data.games.length);
            setHasMore(data.hasMore);

        } catch (err) {
            console.error('Error in fetchData:', err);
            setError('게임 목록을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
            console.log('fetchData: Loading finished for offset', currentOffset);
        }
    }, [queryParams]); // ★★★ 중요: loading, hasMore 제거. queryParams만 의존성으로 남김.

    // loadMoreGames는 현재 offset으로 fetchData를 호출
    const loadMoreGames = useCallback(() => {
        fetchData(offset, false);
    }, [offset, fetchData]);

    // 필터 변경 또는 초기 마운트 시 데이터 로드
    useEffect(() => {
        // 컴포넌트 첫 마운트 시
        if (isInitialMount.current) {
            isInitialMount.current = false;
            console.log('useGames useEffect: Initial mount detected. Fetching first games.');
            fetchData(0, true);
        } else {
            // queryParams가 실제로 변경되었는지 (깊은 비교) 확인
            // JSON.stringify는 객체 순서에 민감할 수 있으나, 일반적으로는 작동합니다.
            const currentQueryParamsString = JSON.stringify(queryParams);
            const prevQueryParamsString = JSON.stringify(prevQueryParamsRef.current);

            if (currentQueryParamsString !== prevQueryParamsString) {
                console.log('useGames useEffect: queryParams changed. Resetting state and initiating new fetch.');

                setGames([]); // 기존 게임 목록 비우기
                setOffset(0); // offset을 0으로 리셋
                setHasMore(true); // hasMore를 true로 리셋

                fetchData(0, true); // 첫 페이지 데이터 로드 (reset=true)
            }
        }
        // 현재 queryParams를 이전 queryParams로 저장
        prevQueryParamsRef.current = queryParams;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams, fetchData]); // queryParams와 fetchData가 변경될 때만 실행

    return { games, loading, error, hasMore, loadMoreGames };
};

export default useGames;