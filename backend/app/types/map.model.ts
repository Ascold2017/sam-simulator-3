export interface Map {
    id: number;
    name: string;
    filename: string;
    size: number;
    maxHeight: number;
}

export type AdmMapListResponse = Map[]