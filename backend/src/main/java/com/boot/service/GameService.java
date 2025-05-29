package com.boot.service;

import com.boot.dto.GameDTO;
import java.util.List;

public interface GameService {
    List<GameDTO> getAllGames();
    GameDTO getGameById(Long id);
    void createGame(GameDTO gameDto);
    void updateGame(GameDTO gameDto);
    void deleteGame(Long id);

    public List<GameDTO> getPaginatedGames(int offset, int limit);
    public List<String> getAllPlatforms();
    public List<String> getAllGenres();
    public int countGamesWithFilters(String searchType, String searchTerm, String genre, String platform);
    public List<GameDTO> getGamesWithFilters(
            int offset, int limit,
            String searchType, String searchTerm,
            String sortBy, String sortOrder,
            String genre, String platform);
}
