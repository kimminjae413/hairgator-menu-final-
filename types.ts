
import { Timestamp } from 'firebase/firestore';

export interface Hairstyle {
  id: string;
  code: string;
  name: string;
  gender: 'male' | 'female';
  mainCategory: string;
  subCategory: string;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Designer {
  id: string;
  name: string;
  phone: string;
  tokens: number;
  joinedAt: Timestamp;
  tokenUpdatedAt?: Timestamp;
}

export interface TokenCost {
  cost: number;
  name: string;
  description: string;
  updatedAt?: Timestamp;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    styleName: string;
    designer: string;
    registeredAt: Timestamp;
}
