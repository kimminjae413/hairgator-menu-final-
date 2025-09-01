
export interface Theme {
    id: string;
    name: string;
    className: string;
}

export const themes: Record<string, Theme> = {
    light: {
        id: 'light',
        name: '라이트',
        className: 'light', // <html> 태그에 적용될 클래스
    },
    dark: {
        id: 'dark',
        name: '다크',
        className: 'dark', // <html> 태그에 적용될 클래스
    },
    ocean: {
        id: 'ocean',
        name: '오션',
        className: 'ocean', // <html> 태그에 적용될 클래스
    }
};