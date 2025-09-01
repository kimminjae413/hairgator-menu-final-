
import * as firebaseApp from 'firebase/app';
import { 
  getFirestore, collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, writeBatch, getDoc, DocumentData, Timestamp, runTransaction
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { COLLECTIONS, DEFAULT_TOKEN_COSTS } from '../config/constants';
import { Designer, Hairstyle, TokenCost, Customer } from '../types';

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBeTlHZwgx36hR-F35QPtGG2xvE5EY0XmY",
    authDomain: "hairgatormenu-4a43e.firebaseapp.com",
    databaseURL: "https://hairgatormenu-4a43e-default-rtdb.firebaseio.com",
    projectId: "hairgatormenu-4a43e",
    storageBucket: "hairgatormenu-4a43e.firebasestorage.app",
    messagingSenderId: "800038006875",
    appId: "1:800038006875:web:2a4de70e3a306986e0cf7e"
};

// Firebase 초기화
const app = firebaseApp.initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Firestore 문서를 TypeScript 타입으로 변환하는 헬퍼 함수
const mapDocToData = <T extends { id: string }>(doc: DocumentData): T => ({ id: doc.id, ...doc.data() } as T);

// =============================================
// 클라이언트 인증 서비스 (Client Auth Service)
// =============================================
export const login = async (name: string, phone: string, password: string): Promise<Designer> => {
    const q = query(
        collection(db, COLLECTIONS.DESIGNERS),
        where('name', '==', name),
        where('phone', '==', phone),
        where('password', '==', password),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        throw new Error('로그인 정보가 올바르지 않습니다.');
    }
    const designerDoc = snapshot.docs[0];
    return mapDocToData<Designer>(designerDoc);
};

// =============================================
// 헤어스타일 서비스 (Hairstyle Services)
// =============================================
export const getHairstyles = async (gender: string, mainCategory: string, subCategory: string): Promise<Hairstyle[]> => {
    if (!gender || !mainCategory || !subCategory) return [];
    const q = query(
        collection(db, COLLECTIONS.HAIRSTYLES),
        where('gender', '==', gender),
        where('mainCategory', '==', mainCategory),
        where('subCategory', '==', subCategory),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapDocToData<Hairstyle>(doc));
};

export const addHairstyle = async (styleData: Omit<Hairstyle, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File): Promise<void> => {
    let imageUrl = '';
    if (imageFile) {
        const timestamp = Date.now();
        const fileName = `${styleData.code}_${timestamp}.${imageFile.name.split('.').pop()}`;
        const storageRef = ref(storage, `hairstyles/${styleData.gender}/${fileName}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
    }

    const newStyle = {
        ...styleData,
        imageUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        likes: 0,
        views: 0,
    };
    await addDoc(collection(db, COLLECTIONS.HAIRSTYLES), newStyle);
};

export const updateHairstyle = async (id: string, updateData: Partial<Omit<Hairstyle, 'id'>>): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.HAIRSTYLES, id);
    await updateDoc(docRef, { ...updateData, updatedAt: Timestamp.now() });
};

export const deleteHairstyle = async (hairstyle: Hairstyle): Promise<void> => {
    if (hairstyle.imageUrl) {
        try {
            const imageRef = ref(storage, hairstyle.imageUrl);
            await deleteObject(imageRef);
        } catch (error) {
            console.error("이미지 삭제 실패 (URL이 올바르지 않을 수 있음):", error);
        }
    }
    await deleteDoc(doc(db, COLLECTIONS.HAIRSTYLES, hairstyle.id));
};

export const generateAutoCode = async (): Promise<string> => {
    const q = query(
        collection(db, COLLECTIONS.HAIRSTYLES),
        where('code', '>=', 'AUTO_'),
        where('code', '<', 'AUTO_Z'),
        orderBy('code', 'desc'),
        limit(1)
    );
    const snapshot = await getDocs(q);
    let nextNumber = 1;
    if (!snapshot.empty) {
        const lastCode = snapshot.docs[0].data().code;
        const match = lastCode.match(/AUTO_(\d+)/);
        if (match) {
            nextNumber = parseInt(match[1]) + 1;
        }
    }
    return `AUTO_${nextNumber.toString().padStart(3, '0')}`;
};

// =============================================
// 디자이너 서비스 (Designer Services)
// =============================================
export const getDesigners = async (): Promise<Designer[]> => {
    const q = query(collection(db, COLLECTIONS.DESIGNERS), orderBy('joinedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapDocToData<Designer>(doc));
};

export const updateDesignerTokens = async (id: string, tokens: number): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.DESIGNERS, id);
    await updateDoc(docRef, { tokens, tokenUpdatedAt: Timestamp.now() });
};

export const batchUpdateTokens = async (amount: number): Promise<number> => {
    const designersSnapshot = await getDocs(collection(db, COLLECTIONS.DESIGNERS));
    const batch = writeBatch(db);
    designersSnapshot.forEach(designerDoc => {
        const docRef = doc(db, COLLECTIONS.DESIGNERS, designerDoc.id);
        const currentTokens = designerDoc.data().tokens || 0;
        batch.update(docRef, { 
            tokens: currentTokens + amount,
            tokenUpdatedAt: Timestamp.now()
        });
    });
    await batch.commit();
    return designersSnapshot.size;
}

export const addTestDesigner = async (name: string, phone: string): Promise<void> => {
    const defaultTokens = await getDefaultTokens();
    const newDesigner = {
        name,
        phone,
        password: '1234',
        tokens: defaultTokens,
        joinedAt: Timestamp.now(),
        tokenUpdatedAt: Timestamp.now(),
        isActive: true,
    };
    await addDoc(collection(db, COLLECTIONS.DESIGNERS), newDesigner);
};

export const deleteDesigner = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.DESIGNERS, id));
};

// =============================================
// 고객 서비스 (Customer Services)
// =============================================
export const getCustomers = async (): Promise<Customer[]> => {
    const q = query(collection(db, COLLECTIONS.CUSTOMERS), orderBy('registeredAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapDocToData<Customer>(doc));
};

export const deleteCustomer = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.CUSTOMERS, id));
};

// =============================================
// 메타데이터 및 설정 서비스 (Metadata & Settings)
// =============================================
export const getDefaultTokens = async (): Promise<number> => {
    const docRef = doc(db, COLLECTIONS.METADATA, 'default_tokens');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().amount : 100;
};

export const saveDefaultTokens = async (amount: number): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.METADATA, 'default_tokens');
    await setDoc(docRef, { amount, updatedAt: Timestamp.now() });
};

export const getTokenCosts = async (): Promise<{ [key: string]: TokenCost }> => {
    const docRef = doc(db, COLLECTIONS.METADATA, 'token_costs');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().costs) {
        return docSnap.data().costs;
    }
    // 데이터가 없으면 기본값으로 초기화
    await saveTokenCosts(DEFAULT_TOKEN_COSTS);
    return DEFAULT_TOKEN_COSTS;
};

export const saveTokenCosts = async (costs: { [key: string]: TokenCost }): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.METADATA, 'token_costs');
    await setDoc(docRef, { costs, lastUpdated: Timestamp.now() }, { merge: true });
};

// =============================================
// 통계 서비스 (Statistics Services)
// =============================================
export const getStats = async () => {
    // 병렬 처리로 성능 개선
    const [stylesSnapshot, designersSnapshot, customersSnapshot] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.HAIRSTYLES)),
        getDocs(collection(db, COLLECTIONS.DESIGNERS)),
        getDocs(collection(db, COLLECTIONS.CUSTOMERS))
    ]);

    const totalStyles = stylesSnapshot.size;
    const totalDesigners = designersSnapshot.size;
    const totalCustomers = customersSnapshot.size;

    let totalMale = 0;
    stylesSnapshot.forEach(doc => {
        if (doc.data().gender === 'male') totalMale++;
    });
    const totalFemale = totalStyles - totalMale;

    const totalTokens = designersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().tokens || 0), 0);

    return { totalStyles, totalDesigners, totalCustomers, totalMale, totalFemale, totalTokens };
};