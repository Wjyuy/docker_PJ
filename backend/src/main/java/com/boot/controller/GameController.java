package com.boot.controller;

import com.boot.dto.GameDTO;
import com.boot.service.GameService;
import com.boot.service.IGDBService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@Slf4j
public class GameController {
    private final GameService gameService;
    private final IGDBService igdbService;

    @Autowired
    public GameController(GameService gameService, IGDBService igdbService) {
        this.gameService = gameService;
        this.igdbService = igdbService;
    }

    @GetMapping
    public List<GameDTO> getAllGames() {
        return gameService.getAllGames();
    }
    @GetMapping("/paginated") 
    public List<GameDTO> getPaginatedGames(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "20") int limit) { // 기본 20개씩 로드
        return gameService.getPaginatedGames(offset, limit);
    }

    @GetMapping("/{id}")
    public GameDTO getGameById(@PathVariable Long id) {
        return gameService.getGameById(id);
    }

    @PostMapping
    public void createGame(@RequestBody GameDTO gameDto) {
        gameService.createGame(gameDto);
    }

    @PutMapping
    public void updateGame(@RequestBody GameDTO gameDto) {
        gameService.updateGame(gameDto);
    }

    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
    }

    @PostMapping("/sync")
    public int syncGamesFromIGDB(@RequestBody(required = false) String query) {
        // 기본 쿼리: 인기순 10개
        if (query == null || query.isBlank()) {
            query = "fields id, name, genres, platforms, first_release_date, summary, cover.url, rating; sort popularity desc; limit 10;";
        }
        return igdbService.fetchAndSaveGames(query);
    }

    @PostMapping("/sync/bulk")
    public int syncGamesBulk(@RequestParam(defaultValue = "fields id, name, genres, platforms, first_release_date, summary, cover.url, rating; sort popularity desc") String baseQuery,
                             @RequestParam(defaultValue = "500") int limit,
                             @RequestParam(defaultValue = "2000") int maxCount) {
        return igdbService.fetchAndSaveGamesPaged(baseQuery, limit, maxCount);
    }
    
    @PostMapping("/sync/bulk-from")
    public int syncGamesBulkFromOffset(
                             @RequestParam(defaultValue = "fields id, name, genres, platforms, first_release_date, summary, cover.url, rating; sort popularity desc") String baseQuery,
                             @RequestParam(defaultValue = "500") int limit,
                             @RequestParam(defaultValue = "2000") int maxCount,
                             @RequestParam(defaultValue = "0") int startOffset) { 
        return igdbService.fetchAndSaveGamesPaged(baseQuery, limit, maxCount, startOffset);
    }
    

    @GetMapping("/filtered-paginated") 
    public ResponseEntity<Map<String, Object>> getFilteredPaginatedGames(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "12") int limit, // 기본 페이지 사이즈
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "id") String sortBy, // 기본 정렬 ID
            @RequestParam(defaultValue = "asc") String sortOrder, // 기본 정렬 오름차순
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String platform
    ) {
        List<GameDTO> games = gameService.getGamesWithFilters(
                offset, limit, searchType, searchTerm, sortBy, sortOrder, genre, platform
        );
        for (GameDTO game : games) {
        	System.out.println("Game DTO imageUrl: " + game.getImageUrl() + ", releaseDate: " + game.getReleaseDate());
        }
        int totalCount = gameService.countGamesWithFilters(searchType, searchTerm, genre, platform);

        Map<String, Object> response = new HashMap<>();
        log.info("response=>",response);
        response.put("games", games);
        response.put("totalCount", totalCount);
        response.put("hasMore", (offset + games.size()) < totalCount); // 다음 페이지가 있는지 여부
        return ResponseEntity.ok(response);
    }

    @GetMapping("/genres") // 모든 장르 목록 가져오기
    public ResponseEntity<List<String>> getAllGenres() {
        List<String> genres = gameService.getAllGenres();
        return ResponseEntity.ok(genres);
    }

    @GetMapping("/platforms") // 모든 플랫폼 목록 가져오기
    public ResponseEntity<List<String>> getAllPlatforms() {
        List<String> platforms = gameService.getAllPlatforms();
        return ResponseEntity.ok(platforms);
    }

}

