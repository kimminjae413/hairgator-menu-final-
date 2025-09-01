
import React from 'react';

const ClientApp: React.FC = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}} className="min-h-screen p-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold" style={{ color: 'var(--accent-primary)' }}>클라이언트 앱</h1>
            <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>디자이너가 로그인하여 사용하는 메뉴 시스템입니다.</p>
             <div className="mt-8 p-6 border rounded-lg" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                <p>현재 페이지는 준비 중입니다.</p>
            </div>
        </div>
    );
};

export default ClientApp;
