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
}
