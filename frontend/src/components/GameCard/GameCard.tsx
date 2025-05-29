// src/components/GameCard/GameCard.tsx
import React from 'react';
import { GameDTO } from '../../dto/GameDTO';
import { Link } from 'react-router-dom';
import './GameCard.css'; // GameCard 전용 CSS 파일

interface GameCardProps {
  //ts사용, game prop의 타입을 GameDTO로 지정
  game: GameDTO;
}

// React.FC<GameCardProps>를 통해 이 props 타입이 컴포넌트에 적용
const GameCard: React.FC<GameCardProps> = ({ game }) => {
  // 날짜 형식 변환
  const formattedReleaseDate = game.releaseDate ?
    new Date(game.releaseDate).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '날짜 미정';

  const defaultImageUrl = '/crack.png';

  return (
    <Link to={`/games/${game.id}`} className="game-card-link">
      <div className="game-card">
        <img
          // game.imageUrl이 유효하면 해당 URL 사용, 아니면 defaultImageUrl 사용
          src={game.imageUrl || defaultImageUrl}
          alt={game.name}
          className="game-card-image"
          loading="lazy"
          // (선택 사항: 이미지가 유효하지 않은 URL일 경우에 대비)
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImageUrl;
          }}
        />
        <div className="game-card-info">
          <h3 className="game-card-title">{game.name}</h3>
          <p className="game-card-genre">장르: {game.genre}</p>
          <p className="game-card-platform">플랫폼: {game.platform}</p>
          <p className="game-card-release-date">출시일: {formattedReleaseDate}</p>
          <p className="game-card-rating">평점: {game.rating ? game.rating.toFixed(1) : 'N/A'}</p>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;