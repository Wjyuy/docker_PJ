import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton/ThemeToggleButton';
import MainLayout from './components/MainLayout';
import GameListPage from './pages/GameListPage';
import GameDetailPage from './pages/GameDetailPage';
import './App.css';
import './styles/global.css'; // 확대,축소 반응형 스타일 (다크/라이트 모드 기본 스타일 포함)

const App: React.FC = () => {

  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/games" replace />} />
            <Route path="/games" element={<GameListPage />} />
            <Route path="/games/:id" element={<GameDetailPage />} />
          </Routes>
        </MainLayout>
      </Router>
      {/* 플로팅 버튼 */}
      <ThemeToggleButton />
    </ThemeProvider>
  );
};

export default App;
