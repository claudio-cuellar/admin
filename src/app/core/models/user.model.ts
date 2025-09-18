export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    role?: string;
    permissions?: string[];
    preferences?: UserPreferences;
}

export interface UserPreferences {
    theme?: 'light' | 'dark';
    language?: string;
    currency?: string;
    notifications?: boolean;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}