package com.boot.dao;

import com.boot.dto.GameDTO;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface GameDAO {
    List<GameDTO> findAll();
    GameDTO findById(@Param("id") Long id);
    void insert(GameDTO game);
    void update(GameDTO game);
    void delete(@Param("id") Long id);
    
    Optional<GameDTO> findByIgdbId(@Param("igdbId") Long igdbId);
    //페이징해서 동적인 리스트 출력
    List<GameDTO> findPaginated(@Param("offset") int offset, @Param("limit") int limit);
    
    // 검색, 정렬, 필터링을 포함한 페이지네이션 쿼리
    List<GameDTO> findGamesWithFilters(
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("searchType") String searchType, // "name", "genre", "all"
            @Param("searchTerm") String searchTerm,
            @Param("sortBy") String sortBy, // "rating", "releaseDate"
            @Param("sortOrder") String sortOrder, // "asc", "desc"
            @Param("genre") String genre, // 장르 필터
            @Param("platform") String platform // 플랫폼 필터
    );

    // 전체 게임 수를 세는 메서드 (페이지네이션 계산에 필요)
    int countGamesWithFilters(
            @Param("searchType") String searchType,
            @Param("searchTerm") String searchTerm,
            @Param("genre") String genre,
            @Param("platform") String platform
    );

    // 모든 장르 목록을 가져오는 메서드
    List<String> findAllGenres();

    // 모든 플랫폼 목록을 가져오는 메서드
    List<String> findAllPlatforms();
    
}
