package com.boot.service;

import com.boot.dto.GameDTO;
import java.util.List;

public interface GameService {
    List<GameDTO> getAllGames();
    GameDTO getGameById(Long id);
    void createGame(GameDTO gameDto);
    void updateGame(GameDTO gameDto);
    void deleteGame(Long id);
}
