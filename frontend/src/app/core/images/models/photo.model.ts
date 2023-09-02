export class Photo {
    uuid?: string = '';
    slug: string = '';
    created?: string = '';
    updated?: string = '';
    photo?: string = '';
    file?: string = '';
    column: number = 0;
    order: number = 0;
    status?: string = 'NEW';
}

export class FileElement {
    uuid?: string = '';
    slug?: string = '';
    created?: string = '';
    updated?: string = '';
    file?: string = '';
    column?: number = 0;
    order?: number = 0;
    status?: string = 'NEW';
    isDropped?: boolean = false;
    styleSize?: number = 0;
    styleSide?: number = 0;
}

export class Files {
    files: FileElement[] = [];
    className: string = "";
    uuid: string = "";
    order?: number = 0;
    styleColumn: number = 0;
}

export interface PhotoColumn {
    columns: Photo[]
}

export interface Login {
    username: string;
    password: string;
}
