
import React from 'react';

const AdminDashboard: React.FC = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}} className="min-h-screen p-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold" style={{ color: 'var(--accent-primary)' }}>관리자 대시보드</h1>
            <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>이곳에서 헤어스타일, 디자이너, 토큰 등을 관리합니다.</p>
            <div className="mt-8 p-6 border rounded-lg" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                <p>현재 페이지는 준비 중입니다.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
