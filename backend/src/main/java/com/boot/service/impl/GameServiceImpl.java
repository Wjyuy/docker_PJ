package com.boot.service.impl;

import com.boot.dao.GameDAO;
import com.boot.dto.GameDTO;
import com.boot.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameServiceImpl implements GameService {
    private final GameDAO gameDao;

    @Autowired
    public GameServiceImpl(GameDAO gameDao) {
        this.gameDao = gameDao;
    }

    @Override
    public List<GameDTO> getAllGames() {
        return gameDao.findAll();
    }

    public List<GameDTO> getPaginatedGames(int offset, int limit) {
        return gameDao.findPaginated(offset, limit);
    }

    @Override
    public GameDTO getGameById(Long id) {
        return gameDao.findById(id);
    }

    @Override
    public void createGame(GameDTO gameDto) {
        gameDao.insert(gameDto);
    }

    @Override
    public void updateGame(GameDTO gameDto) {
        gameDao.update(gameDto);
    }

    @Override
    public void deleteGame(Long id) {
        gameDao.delete(id);
    }

    // 검색, 정렬, 필터링을 포함한 게임 목록 조회
    @Override
    public List<GameDTO> getGamesWithFilters(
            int offset, int limit,
            String searchType, String searchTerm,
            String sortBy, String sortOrder,
            String genre, String platform) {
        return gameDao.findGamesWithFilters(offset, limit, searchType, searchTerm, sortBy, sortOrder, genre, platform);
    }

    // 필터링된 게임의 총 개수 조회
    @Override
    public int countGamesWithFilters(String searchType, String searchTerm, String genre, String platform) {
        return gameDao.countGamesWithFilters(searchType, searchTerm, genre, platform);
    }

    // 모든 장르 목록 조회
    @Override
    public List<String> getAllGenres() {
        return gameDao.findAllGenres();
    }

    // 모든 플랫폼 목록 조회
    @Override
    public List<String> getAllPlatforms() {
        return gameDao.findAllPlatforms();
    }
}
