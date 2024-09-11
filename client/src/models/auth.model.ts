export interface User {
    id: number;
    username: string;
    isPremium: boolean;
    aa: {
        id: number;
        name: string;
        type: 'active-missile' | 'gun'
        ammoMaxRange: number;
        ammoVelocity: number;
        viewAngle: number;
    }
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