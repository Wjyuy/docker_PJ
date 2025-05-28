import React from 'react';
import './GameListPage.css';

// 추후 API 연동 및 상태관리 예정
const GameListPage: React.FC = () => {
  return (
    <div className="game-list-page">
      <h1 className="page-title">게임 목록</h1>
      <div className="game-list-placeholder">
        {/* 게임 카드 컴포넌트로 대체 예정 */}
        <p>게임 목록이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
};

export default GameListPage;
