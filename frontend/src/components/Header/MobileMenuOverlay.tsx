// src/components/Header/MobileMenuOverlay.tsx (새 파일)
import React from 'react';
import './MobileMenuOverlay.css'; // 오버레이 전용 CSS 파일

interface MobileMenuOverlayProps {
  isOpen: boolean; // 메뉴 열림 상태
  onClose: () => void; // 메뉴 닫기 함수
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // 열려있지 않으면 아무것도 렌더링하지 않음

  return (
    <div className="mobile-nav-overlay">
      <nav className="mobile-nav">
        <a href="/" className="nav-link" onClick={onClose}>게임 목록</a>
        <a href="/search" className="nav-link" onClick={onClose}>검색</a>
        <a href="/wishlist" className="nav-link" onClick={onClose}>위시리스트</a>
        <a href="/reviews" className="nav-link" onClick={onClose}>리뷰</a>
        <a href="/recommend" className="nav-link" onClick={onClose}>추천</a>
      </nav>
    </div>
  );
};

export default MobileMenuOverlay;