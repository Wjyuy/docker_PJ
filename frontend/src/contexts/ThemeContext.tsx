// src/context/ThemeContext.tsx (또는 src/contexts/ThemeContext.tsx)
import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';

// 1. Context의 타입을 정의합니다.
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 2. Context를 생성하고 기본값을 지정합니다.
// 기본값은 실제 사용될 때 덮어씌워지므로, 초기에는 null 또는 undefined로 설정해도 무방하나,
// TypeScript에서 타입 추론을 돕기 위해 최소한의 형태로 정의하는 것이 좋습니다.
// 하지만 실제 Provider가 없으면 작동하지 않으므로, 에러를 방지하기 위해 이렇게 정의합니다.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. ThemeProvider 컴포넌트를 생성합니다.
// 이 컴포넌트는 Context의 값을 제공(provide)하고, 테마 상태를 관리합니다.
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 로컬 스토리지에서 마지막 테마 설정을 불러오거나, 기본값 'light'를 사용합니다.
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') { // 브라우저 환경에서만 localStorage 접근
      const savedTheme = localStorage.getItem('app-theme');
      return savedTheme === 'dark' ? 'dark' : 'light';
    }
    return 'light'; // 서버 사이드 렌더링 또는 초기 렌더링 시 기본값
  });

  // 테마 상태가 변경될 때마다 localStorage에 저장합니다.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme', theme);
      // body에 클래스를 추가/제거하여 전역 스타일을 적용합니다.
      document.body.className = theme;
    }
  }, [theme]);

  // 테마를 토글하는 함수
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Context 값은 렌더링될 때마다 재생성되지 않도록 useMemo로 메모이제이션합니다.
  const memoizedValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={memoizedValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Context 값을 쉽게 사용하기 위한 커스텀 훅을 생성합니다.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};