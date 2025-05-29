// src/pages/GameDetailPage/GameDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGameDetail from '../hooks/useGameDetail';
import './GameDetailPage.css';

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 ID 가져오기
  const gameId = id ? parseInt(id, 10) : undefined; // ID를 숫자로 변환
  console.log('GameDetailPage: Component rendered');
  console.log('GameDetailPage: ID from URL:', id);
  console.log('GameDetailPage: Parsed gameId:', gameId);
  const { game, loading, error } = useGameDetail(gameId);
  const navigate = useNavigate(); // 뒤로 가기 기능을 위해 useNavigate 훅 사용

  // 날짜 형식 변환 함수
  const formatReleaseDate = (dateString: string | undefined) => {
    if (!dateString) return '날짜 미정';
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return '날짜 형식 오류';
    }
  };

  if (loading) {
    return (
      <div className="game-detail-page">
        <p className="loading-message">게임 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-detail-page">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">뒤로 가기</button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-detail-page">
        <p className="no-game-found">게임을 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="back-button">뒤로 가기</button>
      </div>
    );
  }

  // 이미지가 없을 때 사용할 기본 이미지 경로
  const defaultImageUrl = '/crack.png';

  return (
    <div className="game-detail-page">
      <div className="game-detail-container">
        <div className="game-detail-header">
          <button onClick={() => navigate(-1)} className="back-button">
            &larr; 목록으로 돌아가기
          </button>
          <h1 className="game-detail-title">{game.name}</h1>
        </div>

        <div className="game-detail-content">
          <div className="game-detail-image-wrapper">
            <img
              src={game.imageUrl || defaultImageUrl}
              alt={game.name}
              className="game-detail-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImageUrl;
              }}
            />
          </div>
          <div className="game-detail-info">
            <p><strong>장르:</strong> {game.genre}</p>
            <p><strong>플랫폼:</strong> {game.platform}</p>
            <p><strong>출시일:</strong> {formatReleaseDate(game.releaseDate)}</p>
            <p><strong>평점:</strong> {game.rating ? game.rating.toFixed(1) : 'N/A'}</p>
            {game.igdb_id && <p><strong>IGDB ID:</strong> {game.igdb_id}</p>}
          </div>
        </div>

        <div className="game-detail-description">
          <h2>게임 설명</h2>
          <p>{game.description || '이 게임에 대한 설명이 없습니다.'}</p>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;