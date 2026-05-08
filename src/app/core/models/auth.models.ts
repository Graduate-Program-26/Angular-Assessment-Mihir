export interface DeezerAuthToken {
    accessToken: string;
    expiresAt: number;
}

export interface DeezerUser {
    id: number;
    name: string;
    email: string;
    picture: string;
    picture_medium: string;
    picture_big: string;
    country: string;
}

export interface AuthState {
    token: DeezerAuthToken | null;
    user: DeezerUser | null;
    loading: boolean;
    error: string | null;
}