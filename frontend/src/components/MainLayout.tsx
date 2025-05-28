import React, { useState } from 'react';
import Header from './Header/Header';
import Footer from './Footer';
import './MainLayout.css';
import ThemeToggleButton from '../components/ThemeToggleButton/ThemeToggleButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // 모바일 메뉴 열림 상태를 MainLayout에서 관리합니다.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Header에서 메뉴 상태를 전달받을 콜백 함수
  const handleToggleMobileMenu = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
  };

  return (
    <div className="main-layout">
      {/* Header에 메뉴 토글 상태를 전달하는 함수를 prop으로 전달 */}
      <Header onToggleMenu={handleToggleMobileMenu} />

      <main className="main-content">{children}</main>

      <Footer />

      {/* isMobileMenuOpen이 false일 때만 ThemeToggleButton을 렌더링합니다. */}
      {!isMobileMenuOpen && <ThemeToggleButton />}
    </div>
  );
};

export default MainLayout;