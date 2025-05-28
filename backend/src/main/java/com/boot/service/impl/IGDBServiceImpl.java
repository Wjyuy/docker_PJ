package com.boot.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.boot.service.IGDBService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.boot.dao.GameDAO;
import com.boot.dto.GameDTO;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant; // 추가
import java.time.LocalDate; // 추가
import java.time.ZoneId; // 추가
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.Optional; // Optional 임포트 추가

@Service
public class IGDBServiceImpl implements IGDBService {

    @Value("${igdb.client-id}")
    private String clientId;

    @Value("${igdb.client-secret}")
    private String clientSecret;

    private String accessToken;
    private long tokenExpireTime = 0;

    @Autowired
    private GameDAO gameDAO;

    @Autowired // ObjectMapper는 스프링이 자동 주입해줍니다.
    private ObjectMapper objectMapper;


    @Override
    public String getAccessToken() {
        if (accessToken != null && System.currentTimeMillis() < tokenExpireTime) {
            return accessToken;
        }
        String url = "https://id.twitch.tv/oauth2/token";
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("grant_type", "client_credentials");
        ResponseEntity<java.util.Map> response = restTemplate.postForEntity(url, params, java.util.Map.class);
        java.util.Map body = response.getBody();
        accessToken = (String) body.get("access_token");
        Integer expiresIn = (Integer) body.get("expires_in");
        tokenExpireTime = System.currentTimeMillis() + (expiresIn - 60) * 1000L; // 1분 여유
        return accessToken;
    }

    @Override
    public String fetchGames(String query) {
        String url = "https://api.igdb.com/v4/games";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", clientId);
        headers.set("Authorization", "Bearer " + getAccessToken());
        headers.setContentType(MediaType.TEXT_PLAIN); // IGDB는 TEXT_PLAIN을 선호합니다.
        HttpEntity<String> entity = new HttpEntity<>(query, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return response.getBody();
    }

    private String fetchGenreNames(Set<Integer> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) return null;
        String url = "https://api.igdb.com/v4/genres";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", clientId);
        headers.set("Authorization", "Bearer " + getAccessToken());
        headers.setContentType(MediaType.TEXT_PLAIN);
        String idList = String.join(",", genreIds.stream().map(String::valueOf).toArray(String[]::new));
        String body = "fields name; where id = (" + idList + ");";
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            // ObjectMapper mapper = new ObjectMapper(); // 이미 주입받았으므로 새로 생성할 필요 없음
            JsonNode arr = objectMapper.readTree(response.getBody());
            ArrayList<String> names = new ArrayList<>();
            for (JsonNode node : arr) {
                names.add(node.path("name").asText());
            }
            return String.join(", ", names);
        } catch (Exception e) {
            System.err.println("장르 이름 가져오기 실패: " + e.getMessage());
            return null;
        }
    }

    private String fetchPlatformNames(Set<Integer> platformIds) {
        if (platformIds == null || platformIds.isEmpty()) return null;
        String url = "https://api.igdb.com/v4/platforms";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", clientId);
        headers.set("Authorization", "Bearer " + getAccessToken());
        headers.setContentType(MediaType.TEXT_PLAIN);
        String idList = String.join(",", platformIds.stream().map(String::valueOf).toArray(String[]::new));
        String body = "fields name; where id = (" + idList + ");";
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            // ObjectMapper mapper = new ObjectMapper(); // 이미 주입받았으므로 새로 생성할 필요 없음
            JsonNode arr = objectMapper.readTree(response.getBody());
            ArrayList<String> names = new ArrayList<>();
            for (JsonNode node : arr) {
                names.add(node.path("name").asText());
            }
            return String.join(", ", names);
        } catch (Exception e) {
            System.err.println("플랫폼 이름 가져오기 실패: " + e.getMessage());
            return null;
        }
    }

    @Override
    public int fetchAndSaveGames(String query) {
        String json = fetchGames(query);
        int savedCount = 0;
        try {
            JsonNode root = objectMapper.readTree(json);
            if (root.isArray()) {
                for (JsonNode node : root) {
                    // 1. IGDB ID 추출
                    Long igdbId = node.path("id").asLong(-1L);
                    if (igdbId == -1L) {
                        System.err.println("경고: 유효한 IGDB ID가 없는 게임 데이터를 건너뜀: " + node.path("name").asText("Unknown Game"));
                        continue;
                    }

                    // 2. DB에서 중복 확인
                    Optional<GameDTO> existingGame = gameDAO.findByIgdbId(igdbId);
                    if (existingGame.isPresent()) {
                        System.out.println("게임 '" + node.path("name").asText("Unknown Game") + "' (IGDB ID: " + igdbId + ") 는 이미 존재합니다. 스킵합니다.");
                        continue;
                    }

                    // 3. GameDTO 생성 및 데이터 파싱
                    GameDTO dto = new GameDTO();
                    dto.setIgdb_id(igdbId);
                    dto.setName(node.path("name").asText(null));

                    // genres 변환 - 현재 작동하는 방식 유지
                    Set<Integer> genreIds = new HashSet<>();
                    if (node.has("genres") && node.get("genres").isArray()) {
                        for (JsonNode g : node.get("genres")) {
                            genreIds.add(g.asInt()); // <-- 이 부분이 정상 작동함
                        }
                    }
                    dto.setGenre(fetchGenreNames(genreIds));

                    // platforms 변환 - 현재 작동하는 방식 유지
                    Set<Integer> platformIds = new HashSet<>();
                    if (node.has("platforms") && node.get("platforms").isArray()) {
                        for (JsonNode p : node.get("platforms")) {
                            platformIds.add(p.asInt()); // <-- 이 부분이 정상 작동함
                        }
                    }
                    dto.setPlatform(fetchPlatformNames(platformIds));

                    // first_release_date 변환
                    if (node.has("first_release_date")) {
                        long epoch = node.get("first_release_date").asLong(0);
                        if (epoch > 0) {
                            dto.setReleaseDate(Instant.ofEpochSecond(epoch).atZone(ZoneId.systemDefault()).toLocalDate());
                        } else {
                            dto.setReleaseDate(null);
                        }
                    } else {
                        dto.setReleaseDate(null);
                    }

                    dto.setDescription(node.path("summary").asText(null));

                    // cover.url 변환
                    if (node.has("cover") && node.get("cover").has("url")) {
                        String imageUrl = node.get("cover").get("url").asText(null);
                        if (imageUrl != null) {
                            imageUrl = imageUrl.replace("t_thumb", "t_cover_big"); // 또는 t_original 등
                        }
                        dto.setImageUrl(imageUrl);
                    } else {
                        dto.setImageUrl(null);
                    }

                    // rating 변환
                    if (node.has("rating")) {
                        dto.setRating(node.get("rating").asDouble());
                    } else {
                        dto.setRating(null);
                    }

                    // 4. DB에 저장
                    gameDAO.insert(dto);
                    savedCount++;
                    System.out.println("새로운 게임 저장 완료: " + dto.getName() + " (IGDB ID: " + igdbId + ")");
                }
            } else {
                System.err.println("IGDB API 응답이 예상된 배열 형태가 아닙니다: " + json);
            }
        } catch (Exception e) {
            System.err.println("게임 데이터 파싱 및 저장 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
        return savedCount;
    }
    
    @Override
    public int fetchAndSaveGamesPaged(String baseQuery, int limit, int maxCount) {
        int totalSaved = 0;
        int offset = 0;
        while (totalSaved < maxCount) {
            String pagedQuery = baseQuery + "; limit " + limit + "; offset " + offset + ";";
            System.out.println("IGDB fetchAndSaveGamesPaged: fetching " + limit + " games from offset " + offset);
            int saved = fetchAndSaveGames(pagedQuery);
            if (saved == 0) { // 더 이상 데이터가 없거나, 모든 게임이 이미 저장되어 스킵된 경우
                System.out.println("fetchAndSaveGamesPaged: No new games saved in this batch, or end of data.");
                break;
            }
            totalSaved += saved;
            offset += limit;
            try {
                // IGDB API 호출 제한을 준수하기 위한 딜레이 (1초 이상 권장)
                Thread.sleep(1200);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("스레드 인터럽트 발생: " + e.getMessage());
                break;
            }
            if (offset >= maxCount) { // maxCount를 초과하지 않도록
                 System.out.println("Reached maxCount limit for synchronization.");
                 break;
            }
        }
        System.out.println("총 저장/업데이트된 게임 수: " + totalSaved);
        return totalSaved;
    }
    @Override 
    public int fetchAndSaveGamesPaged(String baseQuery, int limit, int maxCount, int startOffset) {
        int totalSaved = 0;
        int currentOffset = startOffset;
        while (totalSaved < maxCount) {
            String pagedQuery = baseQuery + "; limit " + limit + "; offset " + currentOffset + ";";
            System.out.println("IGDB fetchAndSaveGamesPaged: fetching " + limit + " games from offset " + currentOffset);
            int saved = fetchAndSaveGames(pagedQuery);
            if (saved == 0) {
                System.out.println("fetchAndSaveGamesPaged: No new games saved in this batch, or end of data.");
                break;
            }
            totalSaved += saved;
            currentOffset += limit; // <-- 다음 호출을 위해 offset 증가
            try {
                Thread.sleep(1200);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("스레드 인터럽트 발생: " + e.getMessage());
                break;
            }
            if (currentOffset >= maxCount + startOffset) { // maxCount와 startOffset 고려하여 종료 조건 수정
                 System.out.println("Reached maxCount limit for synchronization.");
                 break;
            }
        }
        System.out.println("총 저장/업데이트된 게임 수: " + totalSaved);
        return totalSaved;
    }
}