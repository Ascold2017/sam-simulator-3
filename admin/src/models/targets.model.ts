export interface Target {
    id: number;
    name: string
    rcs: number;
    temperature: number;
    size: number;
}

export type TargetListResponse = Target[]