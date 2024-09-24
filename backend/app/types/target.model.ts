export interface Target {
    id: number;
    name: string
    modelName: string
    soundName: string
    rcs: number;
    temperature: number;
    size: number;
}

export type TargetListResponse = Target[]