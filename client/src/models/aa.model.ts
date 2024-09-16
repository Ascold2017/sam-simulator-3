export interface AA {
    id: number;
    name: string;
    type:  'missile' | 'gun'
    ammoMaxRange: number;
    ammoVelocity: number;
    ammoKillRadius: number;
    captureAngle: number;
    reloadTime: number;
}

export type AAListResponse = AA[]