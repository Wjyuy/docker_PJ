import React, { useState, useEffect } from 'react';
import MobileMenuOverlay from './MobileMenuOverlay'
import './Header.css'; 

// 메뉴 열림 상태를 부모로 전달하는 함수
interface HeaderProps {
  onToggleMenu: (isOpen: boolean) => void; 
}
const Header: React.FC<HeaderProps> = ({ onToggleMenu }) => { // props로 onToggleMenu를 받습니다.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // 컴포넌트 언마운트 시 또는 isMobileMenuOpen이 false가 될 때 clean-up
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onToggleMenu(newState); // 변경된 상태를 부모 컴포넌트로 전달
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    onToggleMenu(false); // 메뉴 닫힘 상태를 부모 컴포넌트로 전달
  };


  return (
    <header className="header">
      {/* 헤더 콘텐츠: 로고, 데스크톱 내비게이션, 모바일 메뉴 버튼 */}
      <div className="header-content">
        <img src="/Gemsup.png" alt="GEMSUP" className="header-logo" />

        {/* 데스크톱/태블릿용 내비게이션 */}
        <nav className="nav desktop-nav">
          <a href="/" className="nav-link">게임 목록</a>
          <a href="/search" className="nav-link">검색</a>
          <a href="/wishlist" className="nav-link">위시리스트</a>
          <a href="/reviews" className="nav-link">리뷰</a>
          <a href="/recommend" className="nav-link">추천</a>
        </nav>

        {/* 모바일 햄버거 메뉴 버튼 */}
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기/닫기"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MobileMenuOverlay 컴포넌트 사용 */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
};

export default Header;