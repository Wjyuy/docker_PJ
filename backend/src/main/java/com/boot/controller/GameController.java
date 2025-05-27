package com.boot.controller;

import com.boot.dto.GameDTO;
import com.boot.service.GameService;
import com.boot.service.IGDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/games")
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
}
