export interface Photo {
    uuid?: string;
    slug: string;
    created?: string;
    updated?: string;
    photo: string;
    column: number;
    order: number;
}

export interface Login {
    username: string;
    password: string;
}
