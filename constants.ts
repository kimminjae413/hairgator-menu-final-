
export const COLLECTIONS = {
    DESIGNERS: 'designers',
    HAIRSTYLES: 'hairstyles',
    CUSTOMERS: 'customers',
    METADATA: 'metadata'
};

export const CATEGORIES = {
    male: [
        'SIDE FRINGE', 
        'SIDE PART', 
        'FRINGE UP', 
        'PUSHED BACK', 
        'BUZZ', 
        'CROP', 
        'MOHICAN'
    ],
    female: [
        'A Length', 'B Length', 'C Length', 'D Length',
        'E Length', 'F Length', 'G Length', 'H Length'
    ]
};

export const SUBCATEGORIES = ['None', 'Fore Head', 'Eye Brow', 'Eye', 'Cheekbone'];

export const DEFAULT_TOKEN_COSTS: { [key: string]: { cost: number; name: string; description: string } } = {
    'AI_FACE_ANALYSIS': { cost: 5, name: 'AI 얼굴 분석', description: 'AKOOL API를 사용한 얼굴 분석 기능' },
    'CUSTOMER_REGISTER': { cost: 1, name: '고객 등록', description: '새 고객 정보 등록' },
    'RESERVATION_CREATE': { cost: 1, name: '예약 생성', description: '새 예약 생성' },
    'BASIC_ANALYTICS': { cost: 2, name: '기본 분석', description: '기본 통계 및 분석 기능' },
    'ADVANCED_RECOMMEND': { cost: 3, name: '고급 추천', description: '고급 스타일 추천 기능' },
    'DATA_EXPORT': { cost: 2, name: '데이터 내보내기', description: '데이터 내보내기 기능' },
    'BULK_OPERATIONS': { cost: 10, name: '대량 작업', description: '대량 데이터 처리' }
};
