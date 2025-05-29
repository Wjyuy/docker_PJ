// src/dto/GameDTO.ts
// 백엔드의 LocalDate는 JavaScript Date 객체 또는 문자열로 매핑될 수 있습니다.
// 여기서는 API 응답이 ISO 8601 형식의 문자열로 온다고 가정합니다.
export interface GameDTO {
  id: number;
  name: string;
  genre: string;
  platform: string;
  releaseDate: string; 
  description: string;
  imageUrl: string;
  rating: number;
  igdb_id: number;
}