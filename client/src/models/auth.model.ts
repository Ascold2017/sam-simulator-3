import { AA } from "./aa.model";

export interface User {
    id: number;
    username: string;
    isPremium: boolean;
    aa: AA
  }

  export interface UserResponse {
    user: User
  }
  
  export interface RegisterResponse {
    message: string;
    token: string;
    user: User
  }

  export interface LoginResponse {
    message: string;
    token: string;
    user: User;
  }