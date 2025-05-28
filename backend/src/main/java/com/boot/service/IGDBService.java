package com.boot.service;

public interface IGDBService {
    String getAccessToken();
    String fetchGames(String query);
    int fetchAndSaveGames(String query);
    int fetchAndSaveGamesPaged(String baseQuery, int limit, int maxCount);
    int fetchAndSaveGamesPaged(String baseQuery, int limit, int maxCount, int startOffset);
}
