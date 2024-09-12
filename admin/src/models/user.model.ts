export interface User {
    id: number;
    username: string;
    isPremium: boolean;
}

export type UserListResponse = User[]