package com.boot.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameDTO {
    private Long id;
    private String name;
    private String genre;
    private String platform;
    private LocalDate releaseDate;
    private String description;
    private String imageUrl;
    private Double rating;
    
    private Long igdb_id;
}
