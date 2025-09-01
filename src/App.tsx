
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientApp from './pages/client/ClientApp';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HashRouter>
          <div className="min-h-screen font-sans">
            <Routes>
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/client" element={<ClientApp />} />
              <Route path="/" element={<MainPage />} />
            </Routes>
          </div>
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

const MainPage: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl font-bold mb-4 tracking-wider" style={{ color: 'var(--accent-primary)' }}>HAIRGATOR</h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>프로페셔널 헤어스타일 메뉴 시스템</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link to="/client" className="w-60 text-center px-6 py-3 text-white font-bold rounded-lg transition-transform transform hover:scale-105 shadow-lg" style={{ backgroundColor: 'var(--accent-primary)' }}>
                클라이언트 앱
            </Link>
            <Link to="/admin" className="w-60 text-center px-6 py-3 text-white font-bold rounded-lg transition-transform transform hover:scale-105 shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                관리자 대시보드
            </Link>
        </div>
        <ThemeSelector />
    </div>
);

const ThemeSelector: React.FC = () => {
    const { theme: currentTheme, setTheme, themes } = useTheme();

    return (
        <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <h3 className="text-center font-bold mb-3" style={{ color: 'var(--text-primary)'}}>테마 선택</h3>
            <div className="flex items-center space-x-2">
                {Object.values(themes).map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                            currentTheme === theme.id 
                                ? 'text-white scale-110' 
                                : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ 
                            backgroundColor: currentTheme === theme.id ? 'var(--accent-primary)' : 'var(--bg-primary)',
                            color: currentTheme === theme.id ? 'white' : 'var(--text-primary)'
                        }}
                    >
                        {theme.name}
                    </button>
                ))}
            </div>
        </div>
    );
};


export default App;