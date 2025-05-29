// src/components/GameFilterSortControls/GameFilterSortControls.tsx (예시)
import React, { useState, useEffect } from 'react'; // useState는 내부 UI 상태용으로만 남김
import './GameFilterSortControls.css'; // CSS 파일 임포트

// props 타입 정의
interface GameFilterSortControlsProps {
    searchType: string;
    searchTerm: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    selectedGenre: string; // useGameFilters에서 이름 변경
    selectedPlatform: string; // useGameFilters에서 이름 변경
    
    // 이벤트 핸들러 함수들
    onSearchTypeChange: (type: string) => void;
    onSearchTermChange: (term: string) => void;
    onSortByChange: (by: string) => void;
    onSortOrderChange: (order: 'asc' | 'desc') => void;
    onGenreChange: (genre: string) => void; // useGameFilters에서 이름 변경
    onPlatformChange: (platform: string) => void; // useGameFilters에서 이름 변경

    // 장르/플랫폼 데이터
    genres: string[];
    platforms: string[];
    genresLoading: boolean;
    platformsLoading: boolean;
    genresError: string | null;
    platformsError: string | null;
}

const GameFilterSortControls: React.FC<GameFilterSortControlsProps> = ({
    searchType,
    searchTerm, // 부모로부터 받은 searchTerm
    sortBy,
    sortOrder,
    selectedGenre,
    selectedPlatform,
    onSearchTypeChange,
    onSearchTermChange, // 부모로부터 받은 setSearchTerm 함수
    onSortByChange,
    onSortOrderChange,
    onGenreChange,
    onPlatformChange,
    genres,
    platforms,
    genresLoading,
    platformsLoading,
    genresError,
    platformsError
}) => {
    // 검색어 입력 필드의 '값'은 로컬 상태로 관리하여 불필요한 상위 컴포넌트 리렌더링 방지
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // 부모로부터 받은 searchTerm이 변경되면 localSearchTerm 업데이트
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
        console.log('handleSearchInputChange: localSearchTerm updated to:', e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        console.log('handleSearchSubmit: localSearchTerm before calling onSearchTermChange:', localSearchTerm);
        onSearchTermChange(localSearchTerm); // 부모로부터 받은 함수 호출
    };

    // ... (나머지 UI 및 이벤트 핸들러는 props로 받은 함수를 사용하도록 변경)
    const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSearchTypeChange(e.target.value);
    };

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortByChange(e.target.value);
    };

    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortOrderChange(e.target.value as 'asc' | 'desc');
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onGenreChange(e.target.value);
    };

    const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onPlatformChange(e.target.value);
    };


    return (
        <div className="filter-sort-controls">
            <form onSubmit={handleSearchSubmit} className="search-bar">
                <select value={searchType} onChange={handleSearchTypeChange} className="search-type-select">
                    <option value="all">전체</option>
                    <option value="name">이름</option>
                    {/* <option value="developer">개발사</option>
                    <option value="publisher">배급사</option> */}
                </select>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={localSearchTerm} // 로컬 상태 사용
                    onChange={handleSearchInputChange}
                    className="search-input"
                />
                <button type="submit" className="search-button">검색</button>
            </form>

            <div className="filter-group">
                {/* 정렬 기준 선택 */}
                <select value={sortBy} onChange={handleSortByChange} className="sort-by-select">
                    <option value="id">기본</option>
                    <option value="title">제목</option>
                    <option value="releaseDate">출시일</option>
                </select>
                {/* 정렬 순서 선택 */}
                <select value={sortOrder} onChange={handleSortOrderChange} className="sort-order-select">
                    <option value="asc">오름차순</option>
                    <option value="desc">내림차순</option>
                </select>
                {/* 장르 필터 */}
                <select value={selectedGenre} onChange={handleGenreChange} className="genre-select">
                    <option value="">모든 장르</option>
                    {genresLoading && <option disabled>장르 로딩 중...</option>}
                    {genresError && <option disabled>{genresError}</option>}
                    {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>
                {/* 플랫폼 필터 */}
                <select value={selectedPlatform} onChange={handlePlatformChange} className="platform-select">
                    <option value="">모든 플랫폼</option>
                    {platformsLoading && <option disabled>플랫폼 로딩 중...</option>}
                    {platformsError && <option disabled>{platformsError}</option>}
                    {platforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default GameFilterSortControls;