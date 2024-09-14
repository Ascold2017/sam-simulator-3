import { AA } from "./aa.model";

export interface User {
    id: number;
    username: string;
    isPremium: boolean;
    role: 'user' | 'admin';
    aa: AA;
}

export type UserListResponse = User[]