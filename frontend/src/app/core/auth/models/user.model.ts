export interface User {
    username: string,
    email: string
}

export interface Login {
    username: string;
    password: string;
}

export interface TokenPair {
    access: string;
    refresh: string;
}
