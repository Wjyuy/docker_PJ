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
}
