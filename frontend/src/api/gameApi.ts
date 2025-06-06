// src/api/gameApi.ts
import axios from 'axios';
import { GameDTO } from '../dto/GameDTO';

// 백엔드 API의 기본 URL (서버 주소와 포트까지만!)
const API_SERVER_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8486';

// TS : fetchAllGames 함수가 GameDTO 객체 배열을 담은 Promise를 반환할 것임을 명시 
export const fetchAllGames = async (): Promise<GameDTO[]> => {
  try {
    // 제네릭을 사용하여 응답 데이터가 GameDTO[] 임을 명시
    const response = await axios.get<GameDTO[]>(`${API_SERVER_BASE_URL}/api/games`);
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

// 페이지네이션 API 호출 함수
export const fetchPaginatedGames = async (offset: number, limit: number): Promise<GameDTO[]> => {
  try {
    const response = await axios.get<GameDTO[]>(`${API_SERVER_BASE_URL}/api/games/paginated`, {
      params: { offset, limit }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching paginated games (offset: ${offset}, limit: ${limit}):`, error);
    throw error;
  }
};

export const fetchGameById = async (id: number): Promise<GameDTO> => {
  try {
    const response = await axios.get<GameDTO>(`${API_SERVER_BASE_URL}/api/games/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game with ID ${id}:`, error);
    throw error;
  }
};

export const createGame = async (gameDto: GameDTO): Promise<void> => {
  try {
    await axios.post(`${API_SERVER_BASE_URL}/api/games`, gameDto);
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

export const updateGame = async (gameDto: GameDTO): Promise<void> => {
  try {
    await axios.put(`${API_SERVER_BASE_URL}/api/games`, gameDto);
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
};

export const deleteGame = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_SERVER_BASE_URL}/api/games/${id}`);
  } catch (error) {
    console.error(`Error deleting game with ID ${id}:`, error);
    throw error;
  }
};

// IGDB sync 관련 API도 추가
export const syncGamesFromIGDB = async (query?: string): Promise<number> => {
  try {
    const response = await axios.post<number>(`${API_SERVER_BASE_URL}/api/games/sync`, query, {
      headers: {
        'Content-Type': 'text/plain' // query가 String이므로 텍스트로 보냄
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error syncing games from IGDB:', error);
    throw error;
  }
};

export const syncGamesBulk = async (baseQuery?: string, limit?: number, maxCount?: number): Promise<number> => {
    try {
        const params = {
            baseQuery,
            limit,
            maxCount
        };
        const response = await axios.post<number>(`${API_SERVER_BASE_URL}/api/games/sync/bulk`, null, { params });
        return response.data;
    } catch (error) {
        console.error('Error syncing games bulk:', error);
        throw error;
    }
};

// IGDB에서 게임을 동기화하는 API (오프셋을 지원)
export const syncGamesBulkFromOffset = async (baseQuery?: string, limit?: number, maxCount?: number, startOffset?: number): Promise<number> => {
    try {
        const params = {
            baseQuery,
            limit,
            maxCount,
            startOffset
        };
        const response = await axios.post<number>(`${API_SERVER_BASE_URL}/api/games/sync/bulk-from`, null, { params });
        return response.data;
    } catch (error) {
        console.error('Error syncing games bulk from offset:', error);
        throw error;
    }
};

// 필터링 및 페이지네이션을 지원하는 게임 목록 API
export interface GameFilterParams {
  offset: number;
  limit: number;
  searchType?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  genre?: string;
  platform?: string;
}


// 필터링 및 페이지네이션을 지원하는 게임 목록 응답 타입
export interface PaginatedGamesResponse {
  games: GameDTO[];
  totalCount: number;
  hasMore: boolean;
}

// 필터링 및 페이지네이션을 지원하는 게임 목록 API 호출 함수
export const fetchFilteredPaginatedGames = async (params: GameFilterParams): Promise<PaginatedGamesResponse> => {
  try {
    const response = await axios.get<PaginatedGamesResponse>(`${API_SERVER_BASE_URL}/api/games/filtered-paginated`, {
      params: params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered/paginated games:', error);
    throw error;
  }
};

// 장르 및 플랫폼 목록을 가져오는 API
export const fetchAllGenres = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_SERVER_BASE_URL}/api/games/genres`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all genres:', error);
    throw error;
  }
};

// 플랫폼 목록을 가져오는 API
export const fetchAllPlatforms = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_SERVER_BASE_URL}/api/games/platforms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all platforms:', error);
    throw error;
  }
};