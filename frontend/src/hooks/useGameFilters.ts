// src/hooks/useGameFilters.ts (수정된 버전)
import { useState, useEffect, useCallback } from 'react'; // useCallback 추가
import { fetchAllGenres, fetchAllPlatforms } from '../api/gameApi';
import { GameQueryParam } from './useGames';

interface UseGameFiltersResult {
    filters: GameQueryParam;
    setSearchType: (type: string) => void;
    setSearchTerm: (term: string) => void;
    setSortBy: (by: string) => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    setSelectedGenre: (genre: string) => void;
    setSelectedPlatform: (platform: string) => void;
    genres: string[];
    platforms: string[];
    genresLoading: boolean;
    platformsLoading: boolean;
    genresError: string | null;
    platformsError: string | null;
}

// 필터의 초기 상태를 정의
const initialFilters: GameQueryParam = {
    searchType: 'all',
    searchTerm: '',
    sortBy: 'id',
    sortOrder: 'asc',
    genre: '',
    platform: '',
};

const useGameFilters = (): UseGameFiltersResult => {
    // filters 객체 자체를 useState로 관리
    const [filters, setFilters] = useState<GameQueryParam>(initialFilters);

    const [genres, setGenres] = useState<string[]>([]);
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [genresLoading, setGenresLoading] = useState<boolean>(true);
    const [platformsLoading, setPlatformsLoading] = useState<boolean>(true);
    const [genresError, setGenresError] = useState<string | null>(null);
    const [platformsError, setPlatformsError] = useState<string | null>(null);

    // 장르 및 플랫폼 목록 불러오기 (컴포넌트 마운트 시 한 번만)
    useEffect(() => {
        const getCategories = async () => {
            setGenresLoading(true);
            setPlatformsLoading(true);
            setGenresError(null);
            setPlatformsError(null);
            try {
                const [genresData, platformsData] = await Promise.all([
                    fetchAllGenres(),
                    fetchAllPlatforms()
                ]);
                setGenres(genresData);
                setPlatforms(platformsData);
            } catch (err) {
                setGenresError('장르 목록을 불러오는 데 실패했습니다.');
                setPlatformsError('플랫폼 목록을 불러오는 데 실패했습니다.');
                console.error('Error fetching categories:', err);
            } finally {
                setGenresLoading(false);
                setPlatformsLoading(false);
            }
        };
        getCategories();
    }, []);

    // 각 필터 설정 함수를 useCallback으로 메모이제이션
    // setFilters를 사용하여 filters 객체를 업데이트합니다.
    const setSearchType = useCallback((type: string) => {
        setFilters(prevFilters => ({ ...prevFilters, searchType: type }));
    }, []);

    const setSearchTerm = useCallback((term: string) => {
        setFilters(prevFilters => ({ ...prevFilters, searchTerm: term }));
    }, []);
    
    const setSortBy = useCallback((by: string) => {
        setFilters(prevFilters => ({ ...prevFilters, sortBy: by }));
    }, []);

    const setSortOrder = useCallback((order: 'asc' | 'desc') => {
        setFilters(prevFilters => ({ ...prevFilters, sortOrder: order }));
    }, []);

    const setSelectedGenre = useCallback((genre: string) => {
        setFilters(prevFilters => ({ ...prevFilters, genre: genre }));
    }, []);

    const setSelectedPlatform = useCallback((platform: string) => {
        setFilters(prevFilters => ({ ...prevFilters, platform: platform }));
    }, []);

    // 필터 객체가 업데이트될 때마다 정확한 내용 확인
    console.log('useGameFilters: current filters object after update:', filters);

    return {
        filters,
        setSearchType,
        setSearchTerm,
        setSortBy,
        setSortOrder,
        setSelectedGenre,
        setSelectedPlatform,
        genres,
        platforms,
        genresLoading,
        platformsLoading,
        genresError,
        platformsError,
    };
};

export default useGameFilters;