export interface Map {
    id: number;
    name: string;
    filename: string;
    size: number;
    data: number[][];
}

export type AdmMapListResponse = Map[]