export interface IUser {
    id: string;
    name: string;
    email: string;
}

export interface IAuthContextData {
    user: IUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<IUser>;
    logout: () => void;
}